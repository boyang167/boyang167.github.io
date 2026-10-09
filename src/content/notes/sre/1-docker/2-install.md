---
title: 1.安装
description: '官方，https://docs.docker.com/engine/install/centos/'
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 2
draft: false
---
# 1.安装

官方，[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

## 1.1yum方式

```shell
#安装依赖
yum install device-mapper-persistent-data lvm2 bash-completion -y

#安装具体版本
yum install docker-ce-20.10.15 -y

#或者通过下面脚本进行安装
curl -fsSL get.docker.com -o get-docker.sh
sh get-docker.sh --mirror Aliyun
```

## 1.2修改配置文件

```shell
#创建docker目录
mkdir /etc/docker

cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": [
  	"native.cgroupdriver=systemd"
  ],
  "max-concurrent-downloads": 10,
  "max-concurrent-uploads": 5,
  "live-restore":true,
  "log-driver": "json-file",
  "log-opts": {
  	"max-size": "100m",
	"max-file":"5"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
  	"overlay2.override_kernel_check=true"
  ],
  "registry-mirrors" : [
  ],
  "data-root": "/data/docker"
}
EOF
```

## 1.3添加用户(可选)

```shell
useradd dev
usermod -aG docker dev
newgrp docker
```

## 1.4启动

```shell
systemctl daemon-reload
systemctl enable --now docker
```

## 1.5 国内加速

```yaml
{
"registry-mirrors": [
	  "https://docker.anyhub.us.kg",
	  "https://dockerhub.icu",
	  "https://docker.awsl9527.cn",
	  "https://gcr.chenby.cn",
	  "https://k8s.chenby.cn",
	  "https://docker.chenby.cn"
  ]
}
```

# 2. aws

[https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html)

* To install Docker on Amazon Linux 2 or Amazon Linux 2023

1. Update the installed packages and package cache on your instance.

* ```
  $ sudo yum update -y
  ```
* Install the most recent Docker Community Edition package.
  * For Amazon Linux 2, run the following:
* ```
  $ sudo amazon-linux-extras install docker
  ```
* For Amazon Linux 2023, run the following:
* * ```
    $ sudo yum install -y docker
    ```
* Start the Docker service.
* ```
  $ sudo service docker start
  ```
* Add the `ec2-user` to the `docker` group so that you can run Docker commands without using  **sudo** .

1. ```
   $ sudo usermod -aG docker ec2-user
   ```

## 2.1 docker-25以上

### 1.配置yum源

```

```

### 2.安装

**bash**

```
yuminstalldocker-ce-27.3.1docker-ce-cli-27.3.1containerd.iodocker-buildx-plugindocker-compose-plugin
```

# 3. RockLinux

## 3.1 卸载

```
 dnf remove podman # 或者 sudo yum remove podman
```

## 3.2 删除残留文件

```
rm -rf /etc/containers /etc/registries.conf /etc/containers/policy.json /etc/containers/storage.conf ~/.config/containers ~/.local/share/containers
```

## 3.3 卸载旧版docker

```
dnf remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```

## 3.4 添加源

vim /etc/yum.repos.d/docker.repo

```bash
[docker-ce-stable]
name=DockerCEStable- $basearch
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-stable-debuginfo]
name=DockerCEStable-Debuginfo $basearch
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/debug-$basearch/stable
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-stable-source]
name=DockerCEStable-Sources
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/source/stable
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-test]
name=DockerCETest- $basearch
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/$basearch/test
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-test-debuginfo]
name=DockerCETest-Debuginfo $basearch
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/debug-$basearch/test
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-test-source]
name=DockerCETest-Sources
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/source/test
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-nightly]
name=DockerCENightly- $basearch
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/$basearch/nightly
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-nightly-debuginfo]
name=DockerCENightly-Debuginfo $basearch
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/debug-$basearch/nightly
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg

[docker-ce-nightly-source]
name=DockerCENightly-Sources
baseurl=https://mirror.nju.edu.cn/docker-ce/linux/rhel/$releasever/source/nightly
enabled=0
gpgcheck=1
gpgkey=https://mirror.nju.edu.cn/docker-ce/linux/rhel/gpg
```

* 清理


```bash
yum clean all && yum make cache
```

## 3.5 安装

```bash
dnf install -y docker-ce docker-ce-cli containerd.io
```

# 4. aliyun

## 4.1 创建repo

vi /etc/yum.repos.d/docker.repo

```bash
[docker-ce-stable]
name=DockerCEStable- $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-stable-debuginfo]
name=DockerCEStable-Debuginfo $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/debug-$basearch/stable
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-stable-source]
name=DockerCEStable-Sources
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/source/stable
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-test]
name=DockerCETest- $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/$basearch/test
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-test-debuginfo]
name=DockerCETest-Debuginfo $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/debug-$basearch/test
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-test-source]
name=DockerCETest-Sources
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/source/test
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-nightly]
name=DockerCENightly- $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/$basearch/nightly
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-nightly-debuginfo]
name=DockerCENightly-Debuginfo $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/debug-$basearch/nightly
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-nightly-source]
name=DockerCENightly-Sources
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$releasever/source/nightly
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
```

* 安装

```bash
yum install docker-ce*
```

* 启动

```
systemctl enable --now docker
```

* 问题，查看依赖

```
systemctl list-dependencies docker.service
```
