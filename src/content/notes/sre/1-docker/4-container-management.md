---
title: 1. 容器管理
description: 1.1 创建容器
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 4
draft: false
---
# 1. 容器管理

## 1.1 创建容器

```bash
#创建容器（仅创建，不运⾏）
docker create [image]

#创建并运⾏容器
docker run-itd [image]
```

## 1.2 启动容器

```bash
docker start [container]

#关闭容器
docker stop [container]

#重启容器
docker restart [container]
```

## 1.3 列出运行容器

```
#列出正在运行的容器
docker ps | docker container ls

#列出所有，不管关闭的还是在运行的
docker ps -a | docker container ls -a
```

## 1.4 容器交互

```bash
docker exec -it [container] /bin/bash


#退出容器，容器也会关闭，如果想退出容器但不想容器停止，则按住Ctrl+P+Q退出
docker attach [container]
```

## 1.5 查看容器日志

```bash
docker logs [container] 
```

## 1.6 删除容器

```bash
docker rm [container]

docker container rm [container]


[root@k8s1 ~]# docker logs nginx-server -f

[root@k8s1 ~]# docker logs nginx-server -f -t

#查看最后10行日志
[root@k8s1 ~]# docker logs nginx-server -f -t --tail 10

-t    显示时间
-f  
--tail number 显示条数



批量删除"exit"状态的容器
```

## 1.7 查看容器资源

```bash
#显示容器内进程
docker top [container]

#显示容器资源使⽤情况
docker stats [container]

docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep 容器名字
```

## 1.8 复制文件

```bash
#复制本地⽂件到容器内的指定路径
docker cp [FILE] [container]:[PATH]


#将宿主机文件复制到容器内
[root@DY-Ubuntu-01 ~]#docker cp /etc/issue 5a44:/root/
[root@DY-Ubuntu-01 ~]#docker exec 5a44 cat /root/issue
Ubuntu 20.04.4 LTS \n \l

##将容器内文件复制到宿主机
[root@DY-Ubuntu-01 ~]#docker cp -a 5a44:/etc/centos-release .
[root@DY-Ubuntu-01 ~]#cat centos-release 
CentOS Linux release 8.4.2105
```

# 2. 容器运⾏

## 2.1 help

```
docker  --help


Commands:
 attach     Attach to a running container # 当前 shell 下 attach 连接指定运行镜像
 build      Build an image from a Dockerfile # 通过 Dockerfile 定制镜像
 commit     Create a new image from a container's changes # 提交当前容器为新的镜像
 cp         Copy files/folders from the containers filesystem to the host path

 # 从容器中拷贝指定文件或者目录到宿主机中
 create     Create a new container # 创建一个新的容器，同 run，但不启动容器
 diff       Inspect changes on a container's filesystem # 查看 docker 容器变化
 events     Get real time events from the server # 从 docker 服务获取容器实时事件
 exec       Run a command in an existing container # 在已存在的容器上运行命令
 export     Stream the contents of a container as a tar archive 

 # 导出容器的内容流作为一个 tar 归档文件[对应 import ]
 history    Show the history of an image # 展示一个镜像形成历史
 images     List images # 列出系统当前镜像
 import     Create a new filesystem image from the contents of a tarball 


 # 从tar包中的内容创建一个新的文件系统映像[对应 export]
 info       Display system-wide information # 显示系统相关信息
 inspect    Return low-level information on a container # 查看容器详细信息
 kill       Kill a running container # kill 指定 docker 容器
 load       Load an image from a tar archive # 从一个 tar 包中加载一个镜像[对应 save]
 login      Register or Login to the docker registry server 

 # 注册或者登陆一个 docker 源服务器
 logout     Log out from a Docker registry server # 从当前 Docker registry 退出
 logs       Fetch the logs of a container # 输出当前容器日志信息
 port       Lookup the public-facing port which is NAT-ed to PRIVATE_PORT

 # 查看映射端口对应的容器内部源端口
 pause      Pause all processes within a container # 暂停容器
 ps         List containers # 列出容器列表
 pull       Pull an image or a repository from the docker registry server


 # 从docker镜像源服务器拉取指定镜像或者库镜像
 push       Push an image or a repository to the docker registry server


 # 推送指定镜像或者库镜像至docker源服务器
 restart    Restart a running container # 重启运行的容器
 rm         Remove one or more containers # 移除一个或者多个容器
 rmi        Remove one or more images 


 # 移除一个或多个镜像[无容器使用该镜像才可删除，否则需删除相关容器才可继续或 -f 强制删除]
 run        Run a command in a new container


 # 创建一个新的容器并运行一个命令
 save       Save an image to a tar archive # 保存一个镜像为一个 tar 包[对应 load]
 search     Search for an image on the Docker Hub # 在 docker hub 中搜索镜像
 start      Start a stopped containers # 启动容器
 stop       Stop a running containers # 停止容器
 tag        Tag an image into a repository # 给源中镜像打标签
 top        Lookup the running processes of a container # 查看容器中运行的进程信息
 unpause Unpause a paused container # 取消暂停容器
 version    Show the docker version information # 查看 docker 版本号
 wait       Block until a container stops, then print its exit code 


 # 截取容器停止时的退出状态值
Run 'docker COMMAND --help' for more information on a command.??

 run   运行一个新的container
      # Usage:docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
      -a,--attack
      -i，--interactive=false   以交互模式运行容器，通常和-t搭配
      -t,--tty=false   分配一个伪输入终端
          -d  后台运行
      -P  允许外部访问容器所有开启的端口
      -p  端口映射  -p 80:80
      --name  指定启动后容器的名字
        # docker run -i -t centos
        # docker run -i -t -d centos /bin/bash
        # docker run -i -t -d --name My_Container centos /bin/bash
        # docker run -i -t -d -p 80:80 --name My_Container centos /bin/bash
      -v,--volume=[] 创建数据卷
         /mnt 在容器中创建一个数据卷
         /webapp:/src/webapp     目录挂载。将本地的webapp目录挂载到容器的/src/webapp。容器和宿主机的挂载目录都会同时变化
         /test.txt:/tmp/text.txt 文件挂载。将本地的/test.txt文件挂载到容器的/tmp/text.txt(注意，只能修改容器挂载内的文件，否则不同步)
       # docker run -ti -v /da --name=dbdata centos 创建一个容器dbdata,并创建一个数据卷挂载容器dbdata的/da目录
    --volume-from 共享挂载数据卷
      # # docker run -ti -v /mnt --name db centos    创建一个数据卷容器db,并创建一个数据卷挂载到容器db的/mnt目录下
      # docker run -ti --volume-from=db --name db1 centos # db1容器挂载db 容器中的数据卷
      # docker run -ti --volume-from=db --name db2 centos # db2容器挂载db 容器中的数据卷
        此时三个容器db,db1,db2都可以分享目录/mnt
    --link  连接其他容器
      --link NAME:Alias  Name要建立连接的容器名，Alias连接的容器的别名
      # docker run -ti -d -P --name web --link lamp:lamp centos6.4 /bin/bash 新建容器web和已经运行的容器lamp连接 
    ps 显示容器的列表
      -a  显示所有信息 
      -q  只显示ID
          # docker inspect 5d20c5528521  显示容器的详细信息
      # docker ps -a -q ID
      # docker inspect -f "{{ .State.Pid }}" 5d20c5528521  显示运行容器的PID
    stop|start|restart 停止|启动|重启容器
    exec 进入容器(推荐使用)
      # docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
      # docker exec -t -i 216c623071b3 /bin/bash
    attack CONTAINER_ID  进入容器
      # docker attack 216c623071b3
      使用 attach 命令有时候并不方便。当多个窗口同时 attach 到同一个容器的时候，所有窗口都会同步显示。当某个窗口因命令阻塞时,其他窗口也无法执行操作了
    nsenter
      # yum install util-linux 
      # PID=$(docker inspect -f "{{ .State.Pid }}" 5d20c5528521)
      # nsenter --target $PID --mount --uts --ipc --net --pid
      # nsenter --target 10981 --mount --uts --ipc --net --pid
           -t, --target <pid>     要获取名字空间的目标进程
       -m, --mount[=<file>]   enter mount namespace
       -u, --uts[=<file>]     enter UTS namespace (hostname etc)
       -i, --ipc[=<file>]     enter System V IPC namespace
       -n, --net[=<file>]     enter network namespace
       -p, --pid[=<file>]     enter pid namespace
    rm   删除一个容器
      -f, --force=true  强制删除
      -l, --link=false  删除容器的连接，但保留容器
      -v, --volumes=false  删除容器挂载的数据卷
    export 导出容器,导出一个已经创建的容器到一个文件，不管此时这个容器是否处于运行状态
      -o, --output="" 
      # docker export 929bf12bc6ea > centos_6.4_php.tar
```

### 1.2.1 run

```
[root@k8s1 ~]#  docker run hello-world
```

**javascript**

```
docker run
1、先检测本地是否有镜像
2、本地没有该镜像，则会向镜像仓库拉取这个镜像
3、先create、再start把该镜像的容器运行起来

解析：
docker client客户端连接到了服务端(服务端是以一个守护进程的形式跑在操作系统里面的)典型的C/S架构
由docker服务端的守护进程从docker hub 上下载了镜像
服务端创建了一个新的容器，然后从拉去的这个镜像启动了一个容器，容器执行了脚本/可执行程序让我们可以查看/使用
docker服务端把这些信息流（传递）返回到客户端并展示出来，(展示在终端上)
docker client可以是多种形式，比如"docker"命令工具所在的终端
```

### 1.2.2 tag

官方文档，[https://docs.docker.com/engine/reference/commandline/tag/](https://docs.docker.com/engine/reference/commandline/tag/)

```bash
#TARGET_IMAGE[:TAG]格式一般形式
仓库主机FQDN或IP[:端口]/项目名(或用户名)/image名字:版本
[root@DY-Ubuntu-01 ~]#docker tag alpine alpine:10.15

#添加镜像标签
格式：dockertag名称:[旧标签]新名称:[新标签]

#docker tag ubuntu:latest ubuntu:20  #给ubuntu打上标签20，原来的标签是latest
ubuntu2001f29b8728273weeksago77.8MB
ubuntulatest01f29b8728273weeksago77.8MB


#删除tag
[root@appman marketapi]# docker rmi ubuntu:20
Untagged:ubuntu:20
```

## 2.2 容器操作

官方文档：

[https://docs.docker.com/engine/reference/commandline/images/](https://docs.docker.com/engine/reference/commandline/images/)

### 2.2.0查看容器

**bash**

```bash
docker ps -a    #-a 选项可以显示所有的容器

容器的ID号      加载的镜像     运行的程序                创建时间       当前的状态                   端口映射   名称
CONTAINER ID   IMAGE         COMMAND                  CREATED        STATUS                      PORTS     NAMES
```

### 2.2.1删除容器


```bash
[root@k8s1 ~]docker rm container_id

#删除停止的容器
docker rm container_id  

#强行删除正在运行的容器
docker rm -f nginx      

#删除指定状态的容器
docker rm `docker ps -qf status=exited`   

#删除所有停止的容器
docker container prune -f      

 #删除所有容器
docker rm -f `docker ps -a -q`     

#删除所有容器
docker ps -a -q | xargs docker rm -f  

#删除所有
docker ps -a -q|xargs docker rm

# 定义删除所有容器的别名
[root@DY-Ubuntu-01 ~]#vim .bashrc 
[root@DY-Ubuntu-01 ~]#. .bashrc
alias rmc='docker rm -f `docker ps -qa`'
```

```
[root@k8s1 ~]# for i in `docker ps -a | grep -i exit | awk '{print $1}'`; do docker rm -f $i;done
```

### 2.2.3启动

启动容器有两种方式，一种是基于 `镜像`新建一个容器并启动，另外一个是将在 `终止状态（stopped）的容器`重新启动。

docker容器可以理解为在沙盒中运行的进程。这个沙盒包含了该进程运行所必须的资源，包括文件系统、系统类库、shell

环境等等。但这个沙盒默认是不会运行任何程序的。需要在沙盒中运行一个进程来启动某一个容器。这个进程是该容器的唯一进程，所以当该进程结束的时候，容器也会完全的停止

> 启动容器。可以用ID，也可以用名字

#### 语法

```
docker run [选项] [镜像名] [shell命令] [参数]
#选项:
-i,       --interactive Keep STDIN open even if not attached，通常和-t一起使用
-t,       --tty 分配pseudo-TTY，通常和-i一起使用,注意对应的容器必须运行shell才支持进入
-d,       --detach Run container in background and print container ID,台后运行，默认前台
--name string         Assign a name to the container
--h, --hostname string     Container host name
--rm             Automatically remove the container when it exits
-p, --publish list        Publish a container's port(s) to the host
-P, --publish-all       Publish all exposed ports to random ports
--dns list          Set custom DNS servers
--entrypoint string     Overwrite the default ENTRYPOINT of the image
--restart policy
--privileged        Give extended privileges to container
-e, --env=[]        Set environment variables
--env-file=[]         Read in a line delimited file of environment variables
```

**bash**

```
#运行hello world
[root@k8s1 ~]# docker run nginx echo "hello world"
helloworld

#或者
[root@k8s1 ~]# docker run -d --name nginx-server --rm  -p 80:80 nginx 
7d17bed169e209fde3a548c956cc8e4f672d56fa80afdfe03eefab9e83ba4331

-d----后台运行
--name----定义名字
--rm----容器停止时自动删除
-p----指定端口
-P----随机生成端口
```

#### 容器启动

```
docker start 容器id   #启动容器
docker restart 容器id #重启容器
docker stop 容器id    #停止当前正在运行的容器
docker kill 容器id    #强制停止当前容器
```

* 容器获取 root 权限

```
[root@DY-Ubuntu-01 ~]#docker run -it --privileged centos          #使用--privileged 让容器获取 root 权限
```

#### 容器停止

```bash
docker stop `docker ps -a -q`          #停止所有容器
docker start `docker ps -a -q`         #启动所有容器
```

#### 暂停和恢复容器

```bash
docker pause nginx1          #暂停容器
docker unpause nginx1          #恢复容器
```

#### 容器发信号

```shell
docker kill 可以给容器发信号,默认号SIGKILL,即9信号

docker kill nginx1                   #关闭容器

docker kill `docker ps -a -q`        #强制关闭所有运行中的容器
```

#### 查看

```bash
查看容器（ps）
# 列出当前所有正在运行的container 
$docker ps 

# 显示全部容器，包括退出状态的容器 
$docker ps -a 

# 列出最近一次启动的container 
$docker ps -1

#只显示容器ID
docker ps -a -q

#查看退出状态的容器，注意：exited不要大写
docker ps -f 'status=exited'

#查看容器内的进程
docker top http

#查看容器资源使用情况
docker stats http

 #查看容器的详细信息
docker inspect http

#选择性查看镜像信息
docker inspect -f "{{.Metadata}}" httpd:latest

docker inspect -f "{{.RootFS}}" httpd:latest

docker inspect -f "{{.Created}}" httpd:latest

docker inspect -f "{{.RepoTags}}" httpd:latest
```

### 2.3.4 容器交互

#### exec

```bash
#容器必须正常运行
[root@k8s1 ~]# docker ps 
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                               NAMES
7d17bed169e2   nginx     "/docker-entrypoint.…"   7 minutes ago   Up 7 minutes   0.0.0.0:80->80/tcp, :::80->80/tcp   nginx-server
[root@k8s1 ~]# docker exec -it 7d17bed169e2 /bin/bash

#或者
[root@k8s1 ~]# docker run -it nginx /bin/bash 
root@1fdabf241d64:/#
■ 退出：
1、Ctrl+d
2、exit

#不进入容器中查看,执行一次性命令
[root@k8s1 ~]# docker exec -it nginx ls -l /
```

> 当利用 docker run 来创建容器时，Docker 在后台运行的标准操作包括：
>
> 检查本地是否存在指定的镜像，不存在就从公有仓库下载
> 利用镜像创建并启动一个容器 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
> 从地址池配置一个 ip 地址给容器 执行用户指定的应用程序 执行完毕后容器被终止

#### **nsenter**

无需sshd、无需attach也可以登录容器

```bash
#通过nsenter访问容器中的空间
[root@k8s1 ~]# rpm -qf `which nsenter`
util-linux-ng-2.17.2-12.18.el6.x86_64

[root@k8s1 ~]# docker inspect 4e870027f9c4

[root@k8s1 ~]# docker inspect -f {{.State.Pid}} 4e870027f9c4
16255

[root@k8s1 ~]# nsenter --target 16255 --mount --uts --ipc --net --pid
root@4e870027f9c4:/#
```

#### attach

```
[root@k8s1 ~]# docker attach 44fc0f0582d9
```

> 但在，使用该命令有一个问题。当多个窗口同时使用该命令进入该容器时，所有的窗口都会同步显示。如果有一个窗口阻塞了，那么其他窗口也无法再进行操作。
>
> 因为这个原因，所以docker attach命令不太适合于生产环境，平时自己开发应用时可以使用该命令

#### port

```
docker run -d -P --name nginx1 nginx           #映射容器所有暴露端口至随机本地端口
docker port nginx1                             #查看容器的端口映射关系
80/tcp -> 0.0.0.0:49153
80/tcp -> :::49153

iptables -t nat -vnL                           #自动生成Iptables规则
iptables -S -t nat


#指定端口映射
docker run -d --name nginx2 -p 80 nginx      #容器80端口映射宿主机本地随机端口

docker run -d --name nginx3 -p 81:80 nginx   #容器80端口映射到宿主机本地端口81

docker run -d --name nginx4 -p 192.168.100.201:82:80 nginx   #宿主机本地IP:宿主机本地端口:容器端口

docker run -d --name nginx5 -p 192.168.100.201::80 nginx     #宿主机本地IP:宿主机本地随机端口:容器端口，默认从32768开始

docker run -d --name nginx6 -p 192.168.100.201:83:80/udp nginx  #宿主机本机ip:宿主机本地端口:容器端口/协议，默认为tcp协议

docker run -d --name nginx7 -p 8088:80/tcp -p 8443:443/tcp -p 53:53/udp nginx
   #一次性映射多个端口+协议
```

### 2.3.6 传递运行命令

```
docker run -d alpine tail -f /etc/hosts
```

### 2.3.7 容器内部的hosts文件

```
#容器会自动将容器的ID加入自已的/etc/hosts文件中，并解析成容器的IP

docker run -it --rm --add-host www.wang.org:6.6.6.6 --add-host www.dayu.org:8.8.8.8 busybox     #修改容器的 hosts文件
```

### 2.3.8 指定容器DNS

```shell
容器的dns服务器，默认采用宿主机的dns地址，可以用下面方式指定其它的DNS地址
-将dns地址配置在宿主机
-在容器启动时加选项--dns=x.x.x.x
-在/etc/docker/daemon.json文件中指定


#容器的DNS默认从宿主机的DNS获取
[root@DY-Ubuntu-01 ~]#systemd-resolve --status |grep-A1-i"DNS server"
CurrentDNSServer:192.168.100.1
DNSServers:192.168.100.1
[root@DY-Ubuntu-01 ~]#docker run -it --rm --name centos1 centos       
[root@019dd9a4ba35 /]# egrep -v "^#|^$" /etc/resolv.conf 
nameserver192.168.100.1


#指定DNS地址
[root@DY-Ubuntu-01 ~]#docker run -it --rm --name centos2 --dns 1.1.1.1 --dns 6.6.6.6 --dns 8.8.8.8 centos bash          
[root@d7ddcff827ba /]# egrep -v "^#|^$" /etc/resolv.conf
nameserver1.1.1.1
nameserver6.6.6.6
nameserver8.8.8.8


#指定domain名
[root@DY-Ubuntu-01 ~]#docker run -it --rm --name centos3 --dns 6.6.6.6 --dns 8.8.8.8 --dns-searc wang.org --dns-search wang.com busybox                 
/# egrep -v "^#|^$" /etc/resolv.conf
searchwang.orgwang.com
nameserver6.6.6.6
nameserver8.8.8.8


#配置文件指定DNS和搜索domain名
[root@DY-Ubuntu-01 ~]#vim /etc/docker/daemon.json
    {
"registry-mirrors": ["https://pgavrk5n.mirror.aliyuncs.com"],
"storage-driver":"overlay2",
"dns": [ "114.114.114.114","119.29.29.29"],
"dns-search": [ "wangxiaochun.com","wang.org"]
    }
[root@DY-Ubuntu-01 ~]#docker run -it --rm centos bash
[root@f35bfa417d29 /]# cat /etc/resolv.conf 
searchwangxiaochun.comwang.org
nameserver114.114.114.114
nameserver119.29.29.29

#用--dns指定优先级更高
[root@DY-Ubuntu-01 ~]#docker run -it --rm --dns 6.6.6.6 --dns 8.8.8.8 centos bash
[root@c6c43766b04e /]# cat /etc/resolv.conf 
searchwangxiaochun.comwang.org
nameserver6.6.6.6
nameserver8.8.8.8
```

### 2.3.9 修改容器

```
对某一个容器做了修改之后（通过在容器中运行某一个命令），可以把对容器的修改保存下来，这样下次可以从保存后的最新状态运行该容器。
 commit  基于已有镜像的容器再生成一个新的镜像
     # docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
     -m,--message=""  提交信息，为镜像描述内容
     -a,--author=""   作者信息
     -p,--pause=true  提交时暂停容器运行
     My_Container:1  是提交的镜像名称和版本
# docker commit -m "Centos7 x64 First Image" -a "Loren" 33d619155d03 My_centos7:1
```

### 2.3.10 容器中执行命令

```bash
# 显示一个运行的容器里面的进程信息 
$docker top Name/ID 

# 从容器里面拷贝文件/目录到本地一个路径 
$docker cp Name:/container_path to_path 
$docker cp ID:/container_path to_path 

###显示容器CPU、内存的等状态
[root@k8s1 ~]# docker stats nginx
```

### 2.3.11 修改容器名字

```bash
[root@k8s1 ~]# docker rename container_id_old container_new
```

### 2.3.12 查看容器资源

```
#选项只输出当前的状态
docker stats --no-stream


#json形式
docker stats --no-stream --format \
    "{\"container\":\"{{ .Container }}\",\"memory\":{\"raw\":\"{{ .MemUsage }}\",\"percent\":\"{{ .MemPerc }}\"},\"cpu\":\"{{ .CPUPerc }}\"}"
```

# 1.4 修改存储路径

* 查看docker存储路径

```
docker info |grep Dir
```

* 关闭docker 服务

```
systemctl stop docker
```

/etc/docker/daemon.json ，没有自己创建

```
{
  "data-root": "/www/docker"
}
```

或者

```
[root@k8s1 ~]# vim /usr/lib/systemd/system/docker.service
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --graph=/path

 --graph=/path

# systemctl daemon-reload
# systemctl start docker
```

> 保存重启

# 1.5配置文件

#docker配置文件

```
{
"graph": "/data/docker",          #数据目录
"storage-driver": " overlay2",   #存储引擎
"insecure-registries": ["registry.access.redhat.com"," quary.io"]    #私有仓库
"registry-mirrors": ["https://q"]        #镜像加速
"bip": "172.7.5.1/24",                     #docker网络（面试题—如何永久配置docker网络地址，就是在daemon.json 里面配置"bip"字段）
"exec-opts": ["native.cgroupdriver=systemd"],        #启动时候的额外参数(驱动)
"live-restore": true           #当docker容器引擎挂掉的时候，使用docker跑起来的容器还能运行（分离)
}
docker容器网络生产经验
docker 的网络建议和宿主机的IP“对照”
比如宿主机10.2.5.6容器的地址就可以修改为172.5.6.1，这样方便在故障发生时，更容易定位故障节点位置
```

# 1.6 镜像加速

[阿里镜像加速配置](https://help.aliyun.com/document_detail/60750.html?spm=a2c4g.11186623.6.559.3db39456zcOTBb)
