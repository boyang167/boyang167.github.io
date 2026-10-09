---
title: 1.镜像管理
description: 1.0 查看版本
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 3
draft: false
---
# 1.镜像管理

## 1.0 查看版本

```
[root@k8s1 ~]#  docker version

[root@k8s1 ~]#  docker -v
```

[root@k8s1 ~]# docker info

```bash
Client:
Context:default
DebugMode:false#client 端是否开启 debug

Server:
Containers:0#当前主机运行的容器总数
Running:0#有几个容器是正在运行的
Paused:0#有几个容器是暂停的
Stopped:0#有几个容器是停止的
Images:0#当前服务器的镜像数
ServerVersion:20.10.19#服务端版本
StorageDriver:overlay2#正在使用的存储引擎
BackingFilesystem:xfs#后端文件系统，即服务器的磁盘文件系统
Supportsd_type:true#是否支持 d_type
NativeOverlayDiff:true#是否支持差异数据存储
userxattr:false
LoggingDriver:json-file#日志类型
CgroupDriver:cgroupfs#Cgroups 类型
CgroupVersion:1
Plugins:#插件
Volume:local#卷
Network:bridgehostipvlanmacvlannulloverlay# overlay 跨主机通信
Log:awslogsfluentdgcplogsgelfjournaldjson-filelocallogentriessplunksyslog# 日志类型
Swarm:inactive#是否支持 swarm
Runtimes:runcio.containerd.runc.v2io.containerd.runtime.v1.linux#已安装的容器运行时
DefaultRuntime:runc#默认使用的容器运行时
InitBinary:docker-init#初始化容器的守护进程，即 pid 为 1 的进程
containerdversion:9cd3357b7fd7218e4aec3eae239db1f68a5a6ec6#版本
runcversion:v1.1.4-0-g5fd4c4d1#runc 版本
initversion:de40ad0#init 版本
SecurityOptions:#安全选项
apparmor#安全模块，https://docs.docker.com/engine/security/apparmor/
seccomp#安全计算模块，即制容器操作，https://docs.docker.com/engine/security/seccomp
Profile:default#默认的配置文件
KernelVersion:5.4.0-126-generic#宿主机内核版本
OperatingSystem:Ubuntu20.04.4LTS#宿主机操作系统
OSType:linux#宿主机操作系统类型
Architecture:x86_64#宿主机架构
CPUs:2#宿主机 CPU 数量
TotalMemory:3.84GiB#宿主机总内存
Name:DY-Ubuntu-01#宿主机 hostname
ID:YZQ6:756A:YPQR:XKA7:POII:EQ6Z:KUPN:BHPK:Q6QK:GYCX:56RA:PWJY#宿主机 ID
DockerRootDir:/var/lib/docker#宿主机关于docker数据的保存目录
DebugMode:false#server 端是否开启 debug
Registry:https://index.docker.io/v1/#仓库路径
Labels:
Experimental:false#是否测试版
InsecureRegistries:
127.0.0.0/8#非安全的镜像仓库
RegistryMirrors:
https://pgavrk5n.mirror.aliyuncs.com/#镜像仓库
LiveRestoreEnabled:false#是否开启活动重启 (重启docker-daemon 不关闭容器 )
ProductLicense:CommunityEngine
WARNING:Noswaplimitsupport#系统警告信息 (没有开启 swap 资源限制 )
```

## 1.1查看镜像

```bash
docker images|docker image ls;

[root@node1 ~]# docker images
REPOSITORYTAGIMAGEIDCREATEDSIZE

REPOSITORY#镜像所属的仓库名称
TAG#镜像版本号（标识符），默认为latest
IMAGEID#镜像唯一ID标识,如果ID相同,说明是同一个镜像有多个名称
CREATED#镜像在仓库中被创建时间
VIRTUALSIZE#镜像的大小
```

### 查看镜像id

语法，docker help images

```bash
[root@appman containers]# docker help images;

Usage:dockerimages [OPTIONS] [REPOSITORY[:TAG]]

Listimages

Options:
-a,--allShowallimages (default hidesintermediateimages)
--digestsShowdigests
-f,--filterfilterFilteroutputbasedonconditionsprovided
--formatstringPretty-printimagesusingaGotemplate
--no-truncDon't truncate output
  -q, --quiet           Only show image IDs

[root@node1 ~]# docker images -q              #查看镜像id
c059bfaa849c
feb5d9fea6a5
[root@node1 ~]# docker images --no-trunc      #显示完整的ImageID
REPOSITORY    TAG       IMAGE ID                                                                  CREATED         SIZE
alpine        latest    sha256:c059bfaa849c4d8e4aecaeb3a10c2d9b3d85f5165c66ad3a4d937758128c4d18   10 months ago   5.59MB
hello-world   latest    sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412   12 months ago   13.3kB

[root@node1 ~]# docker image inspect alpine    #查看指定镜像的详细信息
```

### 查看镜像详细信息

```
#查看镜像详细信息
docker inspect nginx
```

## 1.2 检索镜像

```bash
[root@docker ~]# docker search nginx

docker search -f=stars=100 nginx #搜索点赞大于100的nginx镜像

docker search --limit 3 nginx#搜索三个结果

docker image history nginx#查看镜像分层历史
```

## 1.3 拉取镜像

```bash
docker pull nginx
```

```bash
#格式：docker pull 仓库名称[:标签]
#如果下载镜像时不指定标签，则默认会下载仓库中最新版本的镜像，即选择标签为 latest 标签

[root@docker ~]# docker pull nginx

[root@node1 ~]# docker run -it -d --name alpine-1 --rm alpine     #后台交互运行一个名称为alpine-1的alpine容器，停止容器后删除容器
[root@node1 ~]# docker exec -it alpine-1 /bin/sh                  #进入alpine-1容器，指定bash类型为sh
/# vi /etc/apk/repositories                                      #修改源替换成阿里源
https://mirrors.aliyun.com/alpine/v3.15/main
https://mirrors.aliyun.com/alpine/v3.15/community

/# apk update                                                    #更新源
/# apk add vim                                                  #安装软件
/# apk del openssh                                       #删除软件
/# apk info nginx                                        #显示软件的详细信息
/# apk manifest nginx                                           #显示校验
# Debian(ubuntu)系统建议安装的基础包
# apt update                              #安装软件前需要先更新索引
# apt install procps                      #提供top,ps,free等命令
# apt install psmisc                    #提供pstree,killall等命令
# apt install iputils-ping                  #提供ping命令
# apt install net-tools                     #提供netstat网络工具等
# apt install iproute2                      #提供ip,ss网络工具等
```

## 1.4 上传镜像

```bash
#配置tag
docker tag nginx:latest hsuing/nginx:latest

docker login

docker push hsuing/nginx:latest
```

## 1.5 保存镜像

```bash
docker save [image] -o FILE /

docker save [image] > FILE

docker save nginx:latest > nginx.tar
```

## 1.6 镜像导入

```bash
docker load -i FILE

docker load -i nginx.tar
```

#### save

保存镜像到一个tar包; -o, --output="" Write to an file

docker save -o save_name image_name

```bash
#查看
[root@k8s1 ~]# docker images;
REPOSITORYTAGIMAGEIDCREATEDSIZE
nginxlatest62d49f9bab678daysago133MB

#保存
[root@k8s1 ~]# docker save -o nginx_save.tar nginx
[root@k8s1 ~]# ls
nginx_save.tar
```

#### load 载入

```bash
#save 导入
[root@k8s1 ~]# docker load -i nginx_save.tar
7e718b9c0c8c:Loadinglayer72.52MB/72.52MB
4dc529e519c4:Loadinglayer64.81MB/64.81MB
23c959acc3d0:Loadinglayer3.072kB/3.072kB
15aac1be5f02:Loadinglayer4.096kB/4.096kB
974e9faf62f1:Loadinglayer3.584kB/3.584kB
64ee8c6d0de0:Loadinglayer7.168kB/7.168kB
Loadedimage:nginx:latest

或者
[root@k8s1 ~]# docker load < nginx_save.tar
```

> **# 加载一个tar包格式的镜像; -i, --input="" Read from a tar archive file**
>
> **< 等于 参数 -i**
>
> load 导入的是元数据信息，包含标签

#### export

```bash
#export  和save 的区别

[root@k8s1 ~]# docker help save

Usage:dockersave [OPTIONS] IMAGE [IMAGE...]

Saveoneormoreimagestoatararchive (streamed toSTDOUTbydefault)

Options:
-o,--outputstringWritetoafile,insteadofSTDOUT

[root@k8s1 ~]# docker help export

Usage:dockerexport [OPTIONS] CONTAINER

Exportacontainer's filesystem as a tar archive

Options:
  -o, --output string   Write to a file, instead of STDOUT
```

* 导出单个镜像

```bash
#方法1
[root@node1 ~]# docker save -o alpine.tar alpine  
#方法2
[root@node1 ~]# docker save alpine > alpine1.tar
```

* 导出多个镜像至一个文件

```bash
#导出多个镜像至一个文件
#方法1
[root@node1 ~]# docker save -o all1.tar alpine hello-world
#方法2
[root@node1 ~]# docker save alpine hello-world -o all.tar
#方法3
[root@node1 ~]# docker save alpine hello-world > all2.tar
```

* 导出所有镜像至一个文件

```bash
#导出所有镜像至一个文件
#方法1
[root@node1 ~]# docker save `docker images |awk 'NR>1{print $1":"$2}'`-oall4.tar#导出所有镜像到一个打包文件，此方法导入后可以看REPOSITORY和TAG
#方法2
[root@node1 ~]# docker image save `docker image ls --format "{{.Repository}}:{{.Tag}}"`-oall5.tar
#将所有镜像导入到一个文件中,此方法导入后可以看REPOSITORY和TA
```

* 导出所有镜像至不同的文件中

```bash
#导出所有镜像至不同的文件中
#方法1
[root@node1 ~]# docker images |awk'NR!=1{print $1,$2}'|whilereadrepotag ;do docker save ${repo}:${tag} -o ${repo}-${tag}.tar; done#导出所有镜像至不同的文件中

#方法2
[root@node1 ~]# for i in`docker images --format "{{.Repository}}:{{.Tag}}"`; dodockersave $i -o`echo$i|cut-d:-f1`.tar; done#导出所有镜像至不同的文件中
```

export 是运行之后的导出

```bash
[root@k8s1 ~]# docker ps -a
CONTAINERIDIMAGECOMMANDCREATEDSTATUSPORTSNAMES
a6ad15f24f82nginx"/docker-entrypoint.…"33secondsagoUp31seconds0.0.0.0:80->80/tcp,:::80->80/tcpnginx-server

#docker export 容器名字  > name_export.tar
[root@k8s1 ~]# docker export a6 > nginx_export.tar
```

#### import

```
[root@k8s1 ~]# cat nginx_export.tar |dockerimport-nginx
sha256:4bb1f91f1eaf739837e3a9259d5634188ec44c98b18c74c3b52c22af54d0e118
# 或者在导入的时候指定tag
catnginx_export.tar|dockerimport-han/nginx:7.2


#在启动nginx
[root@k8s1 ~]# docker images;
REPOSITORYTAGIMAGEIDCREATEDSIZE
nginxlatest4bb1f91f1eafAboutaminuteago131MB
[root@k8s1 ~]# docker run -d --name nginx-server --rm  -p 80:80 nginx 
docker:Errorresponsefromdaemon:Nocommandspecified.
```

> import 导入的时候不能用原来的启动方式启动

> [!WARNING]
>
> **注：**
>
>  **用户既可以使用docker load来导入镜像存储文件到本地镜像库，**
>
>  **也可以使用docker import来导入一个容器快照到本地镜像库。(这个体积更小)**
>
> **两者的区别在于**
>
>  **容器快照文件将丢失所有的历史记录和元数据信息（即仅保存容器当时的快照状态），容器快照文件导入时可以重新指定标签等元数据信息。**
>
>  **镜像存储文件将保存完整记录，体积也大。**
>
> **export是当前的状态，docker save 是针对镜像images。**
>
> **docker images --tree 看到他的历史记录。Docker的文件系统AUFS，一种“增量文件系统”，用户所做修改以增量的方式保存，所以才能看到这些历史的增量。**
>
> **推荐使用export**

## 1.7 查看镜像历史

```bash
[root@appman ~]# docker history ubuntu
IMAGECREATEDCREATEDBYSIZECOMMENT
01f29b8728273weeksago/bin/sh-c#(nop)  CMD ["/bin/bash"]            0B      
<missing>      3 weeks ago   /bin/sh -c #(nop) ADD file:bb1fa1d9d012ae826…   77.8MB  
<missing>      3 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B      
<missing>      3 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B      
<missing>      3 weeks ago   /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B      
<missing>      3 weeks ago   /bin/sh -c #(nop)  ARG RELEASE                  0B
```

* 脚本形式查查

```bash
#!/bin/bash
case"$OSTYPE"in
    linux*)
dockerhistory--no-trunc--format"{{.CreatedBy}}"$1|# extract information from layers
tac|# reverse the file
sed's,^\(|3.*\)\?/bin/\(ba\)\?sh -c,RUN,'|# change /bin/(ba)?sh calls to RUN
sed's,^RUN #(nop) *,,'|# remove RUN #(nop) calls for ENV,LABEL...
sed's,  *&&  *, \\\n \&\& ,g'# pretty print multi command lines following Docker best practices
    ;;
    darwin*)
dockerhistory--no-trunc--format"{{.CreatedBy}}"$1|# extract information from layers
tail-r|# reverse the file
sed-E's,^(\|3.*)?/bin/(ba)?sh -c,RUN,'|# change /bin/(ba)?sh calls to RUN
sed's,^RUN #(nop) *,,'|# remove RUN #(nop) calls for ENV,LABEL...
sed$'s,  *&&  *, \\\ \\\n \&\& ,g'# pretty print multi command lines following Docker best practices
    ;;
*)
echo"unknown OSTYPE: $OSTYPE"
    ;;
esac
```

## 1.8 删除镜像

```bash
docker rmi [image_name]

docker image prune
	-清理不再使用的无标签镜像、悬挂镜像层以及未使用的缓存
	-它会删除没有标签的临时镜像和镜像层，从而释放磁盘空间

#dangling images表示TAG为<none>的镜像
[root@DY-Ubuntu-01 ~]#docker system prune
WARNING!Thiswillremove:
-allstoppedcontainers
-allnetworksnotusedbyatleastonecontainer
-alldanglingimages
-alldanglingbuildcache

Areyousureyouwanttocontinue? [y/N] y
Totalreclaimedspace:0B

[root@DY-Ubuntu-01 ~]#docker system prune -f -a            #清除不再使用的镜像


[root@DY-Ubuntu-01 ~]#docker rmi nginx
[root@DY-Ubuntu-01 ~]#docker rmi -f hello-world     #强制删除正在使用的镜像，也会删除对应的容器
[root@DY-Ubuntu-01 ~]#docker rmi nginx httpd        #删除多个镜像

-----
[root@node1 ~]# docker image prune            #清理dangling虚无镜像（没被标记且没被其它任何镜像引用的镜像）
WARNING!Thiswillremovealldanglingimages.
Areyousureyouwanttocontinue? [y/N] y
Totalreclaimedspace:0B

[root@node1 ~]# docker image prune -a -f      #清理dangling虚无镜像以及不再使用的镜像
DeletedImages:
untagged:hello-world:latest
untagged:hello-world@sha256:2498fce14358aa50ead0cc6c19990fc6ff866ce72aeb5546e1d59caac3d0d60f
deleted:sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412
deleted:sha256:e07ee1baac5fae6a26f30cabfe54a36d3402f96afda318fe0a96cec4ca393359
deleted:sha256:780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5


[root@k8s1 ~]# docker rmi  image_id
#或者
[root@k8s1 ~]# docker rmi  -f image_id
-f--->强制删除

#强制删除全部镜像
[root@k8s1 ~]# docker rmi -f $(docker images -q)


#删除悬空 的镜像
dockerrmi$(docker images |grep "^<none>" |awk '{print $3}')
dockerrmi$(docker images -qf dangling=true)
```
