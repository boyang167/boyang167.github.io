---
title: 1. Docker介绍
description: Docker 公司位于旧金山，由法裔美籍开发者和企业家 Solumon Hykes 创立，其标志如下图所示。
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 1
draft: false
---
# 1. Docker介绍

Docker 公司位于旧金山，由法裔美籍开发者和企业家 Solumon Hykes 创立，其标志如下图所示。

![image-20240723101018173](https://nnaigos.oss-cn-hangzhou.aliyuncs.com/imgs/202407231010944.png)

> “Docker”一词来自英国口语，意为码头工人（Dock Worker），即从船上装卸货物的人

Docker 公司起初是一家名为 dotCloud 的平台即服务（Platform-as-a-Service, PaaS）提供商。

底层技术上，dotCloud 平台利用了 Linux 容器技术。为了方便创建和管理这些容器，dotCloud 开发了一套内部工具，之后被命名为“Docker”。Docker就是这样诞生的！

2013年，dotCloud 的 PaaS 业务并不景气，公司需要寻求新的突破。于是他们聘请了 Ben Golub 作为新的 CEO，将公司重命名为“Docker”，放弃dotCloud PaaS 平台

## 1.1 Docker Engine

Docker Engine是一个C/S架构的应用程序，主要包含下面几个组件；

* 常驻后台进程Dockerd
* 一个用来和Dockerd交互的REST API Server
* 命令行CLI接口，通过和REST API进行交互

![深入解析Docker 架构原理](https://nnaigos.oss-cn-hangzhou.aliyuncs.com/imgs/202407231028046.png)

## 1.2 Docker架构组成

![来自官方](https://nnaigos.oss-cn-hangzhou.aliyuncs.com/imgs/202407231023014.png)

| Docker 镜像(Images)    | Docker 镜像是用于创建 Docker 容器的模板。                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Docker 容器(Container) | 容器是独立运行的一个或一组应用。                                                                                                                                                                                                           |
| Docker 客户端(Client)  | Docker 客户端通过命令行或者其他工具使用 Docker API ([https://docs.docker.com/reference/api/docker_remote_api](https://docs.docker.com/reference/api/docker_remote_api?spm=a2cwt.28120018.313684.2.42861ee9T9bCzr)) 与 Docker 的守护进程通信。 |
| Docker 主机(Host)      | 一个物理或者虚拟的机器用于执行 Docker 守护进程和容器。                                                                                                                                                                                     |
| Docker 仓库(Registry)  | Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。Docker Hub([https://hub.docker.com](https://hub.docker.com/)) 提供了庞大的镜像集合供使用。                                                                                           |
| Docker Machine         | Docker Machine是一个简化Docker安装的命令行工具，通过一个简单的命令行即可在相应的平台上安装Docker，比如VirtualBox、 Digital Ocean、Microsoft Azure。                                                                                        |

# 2. Docker核心原理

## 2.1 Namespace简介

Namespace是内核的一个功能，用来给进程隔离一系列系统资源（视图隔离）。

## 2.2 cgroup简介

Linux Cgroup提供了对一组进程及将来子进程的资源限制的能力。资源包括：CPU、内存、存储、网络等。通过Cgroup可以限制某个进程的资源占用，并监控进程的统计信息。

# 3. Docker 容器与传统 VM 方式的区别

| 对比项                             | Docker 容器                                                                                                                         | 虚拟机                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 隔离性                             | 较弱的隔离                                                                                                                          | 强隔离                                                                                                        |
| 启动速度                           | 秒级                                                                                                                                | 分钟级                                                                                                        |
| 镜像大小                           | 一般为 `MB`                                                                                                                       | 一般为 `GB`                                                                                                 |
| 运行性能（与直接部署在机器上比较） | 接近原生（损耗小于 2%）                                                                                                             | 损耗小于 15%                                                                                                  |
| 镜像可移植性                       | 平台无关                                                                                                                            | 平台相关                                                                                                      |
| 系统支持量                         | 单机上支持上千个容器                                                                                                                | 一般几十个                                                                                                    |
| 安全性                             | 1. 容器内的用户从普通用户权限提升为 `root`权限，就直接具备了宿主机的 `root`权限。 2. 容器中没有硬件隔离，使得容器容易受到攻击。 | 1. 虚拟机租户 `root`权限和主机的 `root`虚拟机权限是分离的。 2. 硬件隔离技术：防止虚拟机突破和宿主机交互。 |

# 日志清理

```bash
#!/bin/bash
echo 'input log file  size '$1  
default=20  
if [ -n "$1" ]  
then  
  default=$1
fi

max=`expr 1024 \* $default`  
echo 'current set file size '$max  
for file in ` ls /data/docker_data/containers/*/*-json.log `  
do  
  #echo $file
  s=`du -k $file |awk '{print $1}'`
 # echo $s
  if [ $s -gt $max ]
  then
   echo 'remove'$file
   truncate -s 0 $file
   echo 'removed'$file
  fi
done
```
