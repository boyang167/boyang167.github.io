---
title: 1. Docker的数据管理
description: 1.1 概述
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 5
draft: false
---
# 1. Docker的数据管理

## 1.1 概述

Docker的数据管理是指在Docker容器中对数据进行存储、共享、备份和持久化的方法和技术。它允许用户在保持容器轻量级的同时，确保容器产生的数据能够安全、高效地存储和管理。

## 1.2 主要的技术（三种数据挂载方式）

### 1.2.1 数据卷（Volumes）

* 数据卷是Docker管理的、独立于容器的存储区域，提供了数据持久化和容器间共享的能力。
* 数据卷存储在Docker主机上的特定目录，默认是 `/var/lib/docker/volumes/`（Linux系统），并且可以在容器间共享而不依赖于任何单一容器的生命周期。
* 即使容器被删除，数据依然存在。

### 1.2.2 绑定挂载（Bind mounts）

* 绑定挂载是将宿主机上的文件系统路径直接挂载到容器内的过程。
* 这种方式允许直接利用宿主机的文件系统资源，但可能带来数据管理上的复杂性和安全性考量。
* 绑定挂载的存储位置和数据格式完全由宿主机控制，不受到Docker的直接管理。

### 1.2.3 tmpfs挂载（Tmpfs mounts）

* Tmpfs挂载是将数据存储在宿主机的内存中而不是磁盘上，适用于临时文件或对速度有高要求的场景。
* 这种类型的存储不会持久化，容器停止或宿主机重启后数据将会丢失。
* 适合存储敏感信息或缓存数据，因其不会写入磁盘，可以增加安全性。

### 1.2.4 之间的关系（数据在Docker主机上的存储位置）

![img](https://nnaigos.oss-cn-hangzhou.aliyuncs.com/imgs/202407241710683.webp)

## 1.3 数据卷示例

### 1、创建一个命名的数据卷

**bash**

```
[root@localhost ~]# docker volume create web_data
web_data
```

### 2、修改数据卷内文件内容

```bash
[root@localhost ~]# docker volume inspect web_data
[
    {
"CreatedAt": "2024-05-29T19:04:36+08:00",
"Driver": "local",
"Labels": null,
"Mountpoint": "/var/lib/docker/volumes/web_data/_data",
"Name": "web_data",
"Options": null,
"Scope": "local"
    }
]
#这里的/var/lib/docker/volumes/web_data/_data就是数据卷在宿主机上的路径。

[root@localhost ~]# echo "nginx test"> /var/lib/docker/volumes/web_data/_data/index.html
#直接在宿主机上通过找到的路径修改数据卷内的文件。
```

### 3、启动两个容器并验证数据共享

```bash
[root@localhost ~]# docker run -itd --name nginx_v1 -v web_data:/usr/share/nginx/html -p 8085:80 nginx
73a584b4345b6bb05f99e153f5a92e1aaaf14b183ffb2173cd4238e1bd4edf60
[root@localhost ~]# docker run -itd --name nginx_v2 -v web_data:/usr/share/nginx/html -p 8086:80 nginx
5ce93af52b15d0f905fb749c483138f7e3247995186b9696709b3bd166bc10f6
[root@localhost ~]# curl -s 192.168.112.60:8085
nginxtest
[root@localhost ~]# curl -s 192.168.112.60:8086
nginxtest
```

> 挂载在了相同宿主机目录到容器内的 `/usr/share/nginx/html`路径，同时映射了不同的端口以区分访问。
>
> 可以看到数据内容是可以共享的，都显示 `nginx test`

### 4、宿主机与容器间的实时同步

#### 4.1、进入容器内部修改数据测试同步

```bash
[root@localhost ~]# docker exec -it nginx_v1 /bin/bash
root@73a584b4345b:/#echo"nginx test write !">/usr/share/nginx/html/index.html
root@73a584b4345b:/#exit
exit
[root@localhost ~]# curl -s 192.168.112.60:8085
nginxtestwrite!
[root@localhost ~]# curl -s 192.168.112.60:8086
nginxtestwrite!
```

#### 4.2、宿主机修改数据测试同步

```bash
[root@localhost ~]# echo "nginx test write twice"> /var/lib/docker/volumes/web_data/_data/index.html
[root@localhost ~]# curl -s 192.168.112.60:8085                                                             nginx test write twice
[root@localhost ~]# curl -s 192.168.112.60:8086                                                           nginx
```

### 5、删除容器验证数据持久性

```bash
[root@localhost ~]# docker rm -fv  `docker ps -qa`
5ce93af52b15
73a584b4345b
#这是删除所有容器的命令针对删除nginx_v1以及nginx_v2的命令如下：
dockerrm-fvnginx_v1
dockerrm-fvnginx_v2

[root@localhost ~]# cat /var/lib/docker/volumes/web_data/_data/index.html
nginxtestwritetwice
```

> 可以看到即使所有使用该数据卷的容器都被删除，数据卷本身及其数据依然会被保留
>
> 直到显式执行 `docker volume rm` 命令来删除它。

### 6、只读挂载

```bash
[root@localhost ~]# docker run -itd --name nginx_v3 -v web_data:/usr/share/nginx/html/:ro -p 8087:80 nginx
64737fc7e6fc60e6d4f6203735afb464bc3cdbacbacb92372e3112d35a3d1be8
[root@localhost ~]# docker run -itd --name nginx_v4 -v web_data:/usr/share/nginx/html/:ro -p 8088:80 nginx
fbb5c0dc949b2fca4d9e39b392d535233dfa57b48f348c028d1518cebd7a3560
[root@localhost ~]# docker exec -it nginx_v3 /bin/bash
root@64737fc7e6fc:/#echo"test readonly">/usr/share/nginx/html/index.html
bash:/usr/share/nginx/html/index.html:Read-onlyfilesystem
```

> 通过只读方式挂载以后，在容器内部是不允许修改数据的

# 2. 数据卷容器

## 2.1 概述

数据卷容器是Docker中管理数据卷的一种高级用法，它允许用户创建一个专门用于数据存储的容器，并将其数据卷挂载到其他容器中。

这种方式使得数据可以跨容器共享，同时保持数据的持久性和可移植性。

数据卷容器主要用于数据的持久化存储和跨容器共享，它本身并不运行任何实际的应用服务，而是作为一个存储媒介存在。

## 2.2 创建数据卷

```bash
[root@localhost ~]# docker volume create my_volume
my_volume
```

## 2.3 查看所有的数据卷

```bash
[root@localhost ~]# docker volume ls
DRIVERVOLUMENAME
localmy_volume
localmysql_data
localweb_data
```

## 2.4 修改数据卷内文件内容

```bash
[root@localhost ~]# echo "my_volume_test"> /var/lib/docker/volumes/my_volume/_data/index.html
```

## 2.5 启动一个挂载数据卷的容器

```bash
[root@localhost ~]# docker run -itd --name volume_v1 -v my_volume:/usr/share/nginx/html:ro -p 8089:80 nginx
c9cff2a314fef930aa570680068e40c280a53d0921613b60d926c9ffd185200b
```

## 2.6 启动两个客户端容器

```bash
[root@localhost ~]# docker run -itd --name web1 -p 8090:80 --volumes-from volume_v1 nginx
c036bb587750c2232e7e1efe11b4b421e2c0be275a0aec6da953e670ba6d47b0
[root@localhost ~]# docker run -itd --name web2 -p 8091:80 --volumes-from volume_v1 nginx
9bff8f66a04d701b46f6e94d39664758e22fa4ab6140dd48a1ce0212bb59b941
```

## 2.7 访问测试

```bash
[root@localhost ~]# curl -s 192.168.112.60:8089
my_volume_test
[root@localhost ~]# curl -s 192.168.112.60:8090
my_volume_test
[root@localhost ~]# curl -s 192.168.112.60:8091
my_volume_test
```

## 2.8 停止了卷容器创建新容器也可以引用他

```bash
[root@localhost ~]# docker stop volume_v1
volume_v1
[root@localhost ~]# docker ps -a
CONTAINERIDIMAGECOMMANDCREATEDSTATUSPORTSNAMES
9bff8f66a04dnginx"/docker-entrypoint.…"5minutesagoUp5minutes0.0.0.0:8091->80/tcp,:::8091->80/tcpweb2
c036bb587750nginx"/docker-entrypoint.…"5minutesagoUp5minutes0.0.0.0:8090->80/tcp,:::8090->80/tcpweb1
c9cff2a314fenginx"/docker-entrypoint.…"8minutesagoExited (0) 4 seconds ago                                           volume_v1
#停止卷容器volume_v1

[root@localhost ~]# docker run -itd --name web3 -p 8092:80 --volumes-from volume_v1 nginx
7e8a3e82e6aacf32e5194d4a47d827f718685e0811ffc478b09a6e1748fd997f
[root@localhost ~]# curl -s 192.168.112.60:8092
my_volume_test
#可以获取my_volume数据卷的内容
```

## 2.9 删除卷容器后无法依据卷容器创建新容器

```bash
[root@localhost ~]# docker rm -f volume_v1
volume_v1
[root@localhost ~]# docker run -itd --name web4 -p 8093:80 --volumes-from volume_v1 nginx
docker:Errorresponsefromdaemon:Nosuchcontainer:volume_v1.
See'docker run --help'.

[root@localhost ~]# curl 192.168.112.60:8089
curl: (7) Failed connect to 192.168.112.60:8089; 拒绝连接
[root@localhost ~]# curl 192.168.112.60:8090
my_volume_test
[root@localhost ~]# curl 192.168.112.60:8091
my_volume_test
[root@localhost ~]# curl 192.168.112.60:8092
my_volume_test
#之前创建好的容器不会有任何影响
```

# 3. 日志清理

```bash
#!/bin/bash
echo'input log file  size '$1
default=20
if [ -n"$1" ]
then
  default=$1
fi

max=`expr1024\*$default`
echo'current set file size '$max
for file in` ls /data/docker/containers/*/*-json.log `
do
#echo $file
  s=`du-k$file|awk '{print $1}'`
# echo $s
if [ $s -gt $max ]
then
echo'remove'$file
truncate-s0 $file
echo'removed'$file
fi
done
```
