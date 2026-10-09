---
title: 1. Registry
description: >-
  有时候使用 Docker Hub 这样的公共仓库可能不方便，用户可以创建一个本地仓库供私人使用。 docker
  registry是官方提供的工具，可以用于构建私有的镜像仓库。
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
order: 2
draft: false
---
# 1. Registry

* 有时候使用 Docker Hub 这样的公共仓库可能不方便，用户可以创建一个本地仓库供私人使用。
* docker-registry是官方提供的工具，可以用于构建私有的镜像仓库。

注：

* 随着docker使用的镜像越来越多，就需要有一个保存镜像的地方，这就是仓库。
* 目前常用的两种仓库：
  公共仓库和私有仓库。最方便的就是使用公共仓库上传和下载，
  下载公共仓库的镜像是不需要注册的，但是上传时，是需要注册的。
* 私有仓库最常用的就是registry、Harbor两种，那接下来详细介绍如何创建私有仓库。

# 2 Harbor

Harbor 主要包含以下组件：

* Proxy Cache：代理缓存，用于缓存 Docker Hub 的镜像，提高访问速度。
* Registry：镜像仓库，用于存储 Docker 镜像。
* Database：数据库，用于存储 Harbor 的元数据信息。
* Redis：缓存，用于存储 Harbor 的会话信息等。
* UI：Web 界面，用于管理 Harbor 服务。
* Log Collector：日志收集器，用于收集 Harbor 的日志信息并输出到指定的日志存储系统中。
* Notary：签名和验证服务，用于对镜像进行数字签名和验证。


## 1. 文档

官网：[https://goharbor.io/](https://goharbor.io/)

GitHub地址： [https://github.com/goharbor/harbor](https://github.com/goharbor/harbor)

官方安装文档： [https://goharbor.io/docs/2.4.0/install-config/](https://goharbor.io/docs/2.4.0/install-config/)

## 2 单节点安装

* 安装要求

依赖 Docker和Docker Compose

* 硬件需求

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| CPU      | 2 CPU   | 4 CPU       |
| Mem      | 4 GB    | 8 GB        |
| Disk     | 40 GB   | 160 GB      |

* # 软件需求

| Software       | Version                       | Description                                                                           |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------- |
| Docker engine  | Version 17.06.0-ce+ or higher |                                                                                       |
| Docker Compose | Version 1.18.0 or higher      | 安装文档参考：docker-compose容器编排                                                  |
| Openssl        | Latest is preferred           | Used to generate certificate and keys for Harbor yum install -y openssl openssl-devel |

* # 开放端口

| Port                                                                    | Protocol | Description                                                                                                        |
| ----------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| 443                                                                     | HTTPS    | Harbor portal and core API accept HTTPS requests on this port. You can change this port in the configuration file. |
| 4443                                                                    | HTTPS    | Connections                                                                                                        |
| to the Docker Content Trust service for Harbor. Only required if Notary |          |                                                                                                                    |
| is enabled. You can change this port in the configuration file.         |          |                                                                                                                    |
| 80                                                                      | HTTP     | Harbor portal and core API accept HTTP requests on this port. You can change this port in the configuration file.  |

### 1 下载

* docker-compose

[https://github.com/docker/compose/releases/](https://github.com/docker/compose/releases/)


```bash
 wget https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-linux-x86_64
 
 或者
 curl -L"https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname-s)-$(uname-m)"-o/usr/local/bin/docker-compose
```

* install

```bash
mv docker-compose-linux-x86_64/usr/local/sbin/docker-compose

#查看版本
docker-compose-v
```

* harbor

```bash
wget https://github.com/goharbor/harbor/releases/download/v2.7.3/harbor-offline-installer-v2.7.3.tgz
```

### 2 配置

* 修改配置文件

```bash
mv harbor.yml.tmpl harbor.yml
```


```yaml
hostname: hub.xxx.com# 修改域名

# 关闭http访问方式
http: 
#  # port for http, default is 80. If https enabled, this port will redirect to https port
port: 80

# https related config
#https:
# https port for harbor, default is 443
# port: 443
# The path of cert and key files for nginx
# certificate: /data/docker/harbor/cert/hub.guoliangjun.com.crt #取消注释，填写实际路径
# private_key: /data/docker/harbor/cert/hub.guoliangjun.com.key #取消注释，填写实际路径

harbor_admin_password: harbor123456# admin用户登入密码

database:
password: root123# 数据库密码
max_idle_conns: 100
max_open_conns: 900

# The default data volume
data_volume: /data/harbor#目录自己创建，根据实际情况填写
```

* 创建目录

```bash
mkdir/data/harbor
```

### 3 启动服务

```bash
#重新加载配置
sh./prepare

#安装
sh./install.sh
```

* 测试访问

[http://ip](http://ip)

用户名：admin

密码：看harbor_admin_password参数

### 4 配置仓库地址

* 01.添加docker仓库地址

```bash
vim /etc/docker/daemon.json

"insecure-registries": ["http://hub.xxx.com"]


#重启服务
systemctl daemon-reload && systemctl restart docker && systemctl status docker
```

* 02.证书添加docker仓库地址

参考，[https://goharbor.io/docs/2.6.0/install-config/configure-https/](https://goharbor.io/docs/2.6.0/install-config/configure-https/)

```bash
#要将harbor服务端生成的CA证书拷贝到每个远程客户机的"/etc/docker/certs.d/harbor服务器的域名或ip/"目录下

[root@localhost hub.xxx.com]# pwd
/etc/docker/certs.d/hub.xxx.com
[root@localhost hub.xxx.com]#
[root@localhost hub.xxx.com]# ls -l
总用量4
-rw-r--r--1rootroot204112月1422:36ca.crt
#重启服务
systemctl daemon-reload && systemctl restart docker && systemctl status docker
```

### 5 登录harbor

docker login -u 用户 -p 密码 服务器IP：端口

```bash
[root@localhost docker]# docker login -u admin -p Harbor12345 http://hub.xxx.com
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

* 重启harbor服务

```bash
cd /path/harbor/
docker-compose stop
systemctl stop docker
systemctl daemon-reload
systemctl start docker
docker-compose start
```

### 6 卸载

docker-compose down 或者：docker rm -f $(docker ps -aq)

## 3 k8s 安装

安装依赖:

* Kubernetes cluster 1.10+
* Helm 2.8.0+
* High available ingress controller (Harbor does not manage the external endpoint)
* High available PostgreSQL database (Harbor does not handle the deployment of HA of database)
* High available Redis (Harbor does not handle the deployment of HA of Redis)
* PVC that can be shared across nodes or external object storage

### 1.0 ssl 证书

### 1.1 helm install

#### 1.1.1 add 仓库

```bash
# 添加仓库
helm repo add harbor https://helm.goharbor.io

# 查看
[root@kube-master ~]# helm repo list
NAME      	URL
bitnami   	https://charts.bitnami.com/bitnami
openkruise	https://openkruise.github.io/charts
harbor    	https://helm.goharbor.io
```

配置文件

https://github.com/goharbor/harbor-helm/blob/master/values.yaml

几个重要的配置:

```yaml
expose:
  # 设置暴露服务的方式："ingress", "clusterIP", "nodePort" or "loadBalancer"
  type: ingress
  tls:
    # SSL
    enabled: true
    ...
  ingress:
    hosts:
      # Core 域名
      core: core.harbor.domain
      # Notary 域名
      notary: notary.harbor.domain
    ...
    # 一般就是 nginx
    className: ""
    ...

# 暴露给外部访问的域名
externalURL: https://core.harbor.domain
...
# 数据持久化
persistence:
  enabled: true
  resourcePolicy: "keep"
  persistentVolumeClaim:
    registry:
      # 因为需要高可用，一般需要使用支持 ReadWriteMany 存储
      storageClass: ""
      accessMode: ReadWriteMany
      size: 5Gi
    jobservice:
      jobLog:
        storageClass: ""
        accessMode: ReadWriteMany
        size: 1Gi
    database:
      storageClass: ""
      accessMode: ReadWriteMany
      size: 1Gi
    redis:
      storageClass: ""
      accessMode: ReadWriteOnce
      size: 1Gi
    trivy:
      storageClass: ""
      accessMode: ReadWriteOnce
  imageChartStorage:
    # 各种存储介质
    type: filesystem
    filesystem:
# 日志级别
logLevel: info
# 默认密码
harborAdminPassword: "Harbor12345"
# 服务部署，主要修改副本数
nginx:
portal:
core:
jobservice:
registry:
trivy:
notary:
# 数据库可以自带也可以用外部的
database:
# Redis 可以自带也可以用外部的
redis:
# 监控
exporter:
metrics:
```


#### 1.1.2 搜索chart

```bash
[root@kube-master ~]# helm search repo harbor -l |grepharbor/harbor|head-4
harbor/harbor 	1.15.0       	2.11.0     	Anopensourcetrustedcloudnativeregistryth...
harbor/harbor 	1.14.3       	2.10.3     	Anopensourcetrustedcloudnativeregistryth...
harbor/harbor 	1.14.2       	2.10.2     	Anopensourcetrustedcloudnativeregistryth...
harbor/harbor 	1.14.1       	2.10.1     	Anopensourcetrustedcloudnativeregistryth...
```

#### 1.1.3 下载

```bash
#不指定版本,则下载最新版本
helm fetch harbor/harbor --untar

#指定版本
helm pull harbor/harbor --version 2.11.0
```

#### 1.1.4 安装

* 创建namepase

```bash
kubectl create namespace kube-harbor
```

* 修改配置文件

vi values.yam

```yaml
#入口配置， 暴露服务的方式："ingress", "clusterIP", "nodePort" or "loadBalancer"
expose:
type: ingress
tls:
### 是否启用 https 协议
enabled: true
certSource: secret
auto:
# The common name used to generate the certificate, it's necessary
# when the type isn't "ingress"
commonName: "harbor.ikubernetes.net"
secret:
# The name of secret which contains keys named:
# "tls.crt" - the certificate
# "tls.key" - the private key
secretName: "harbor-tls"
# The name of secret which contains keys named:
# "tls.crt" - the certificate
# "tls.key" - the private key
# Only needed when the "expose.type" is "ingress".
notarySecretName: ""

## 如果Harbor部署在代理后，将其设置为代理的URL
externalURL: https://harbor.ikubernetes.net

### Harbor 各个组件的持久化配置，并将 storageClass 设置为集群默认的 storageClass
persistence:
enabled: true
# Setting it to "keep" to avoid removing PVCs during a helm delete
# operation. Leaving it empty will delete PVCs after the chart deleted
# (this does not apply for PVCs that are created for internal database
# and redis components, i.e. they are never deleted automatically)
resourcePolicy: "keep"
persistentVolumeClaim:
registry:
# Use the existing PVC which must be created manually before bound,
# and specify the "subPath" if the PVC is shared with other components
existingClaim: ""
# Specify the "storageClass" used to provision the volume. Or the default
# StorageClass will be used(the default).
# Set it to "-" to disable dynamic provisioning
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany# 因为需要高可用，一般需要使用支持 ReadWriteMany 存储
size: 100Gi
chartmuseum:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
jobservice:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
# If external database is used, the following settings for database will
# be ignored
database:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
# If external Redis is used, the following settings for Redis will
# be ignored
redis:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
trivy:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteOnce
size: 5Gi

### 默认用户名 admin 的密码配置，注意：密码中一定要包含大小写字母与数字
harborAdminPassword: "Hx123456"

### 设置日志级别
logLevel: info

#各个组件 CPU & Memory 资源相关配置
nginx:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 500m
portal:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 500m
core:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 1000m
jobservice:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 500m
registry:
replicas: 1
registry:
resources:
requests:
memory: 256Mi
cpu: 500m
controller:
resources:
requests:
memory: 256Mi
cpu: 500m
clair:
clair:
resources:
requests:
memory: 256Mi
cpu: 500m
adapter:
resources:
requests:
memory: 256Mi
cpu: 500m
notary:
server:
resources:
requests:
memory: 256Mi
cpu: 500m
signer:
resources:
requests:
memory: 256Mi
cpu: 500m
database:
replicas: 1
internal:
resources:
requests:
memory: 256Mi
cpu: 500m
redis:
replicas: 1
internal:
resources:
requests:
memory: 256Mi
cpu: 500m
trivy:
enabled: true
resources:
requests:
cpu: 200m
memory: 512Mi
limits:
cpu: 1000m
memory: 1024Mi

#开启 chartmuseum，使 Harbor 能够存储 Helm 的 chart
chartmuseum:
enabled: true
resources:
requests:
memory: 256Mi
cpu: 500m

imageChartStorage:
# Specify whether to disable `redirect` for images and chart storage, for
# backends which not supported it (such as using minio for `s3` storage type), please disable
# it. To disable redirects, simply set `disableredirect` to `true` instead.
# Refer to
# https://github.com/docker/distribution/blob/master/docs/configuration.md#redirect
# for the detail.
disableredirect: false
# Specify the "caBundleSecretName" if the storage service uses a self-signed certificate.
# The secret must contain keys named "ca.crt" which will be injected into the trust store
# of registry's and chartmuseum's containers.
# caBundleSecretName:

# Specify the type of storage: "filesystem", "azure", "gcs", "s3", "swift",
# "oss" and fill the information needed in the corresponding section. The type
# must be "filesystem" if you want to use persistent volumes for registry
# and chartmuseum
type: s3
s3:
region: cn-hangzhou-1
bucket: harbor
accesskey: VGZQY32LMFQOQPVNTDSJ
secretkey: YZMMYqoy1ypHaqGOUfwLvdAj9A731iDYDjYqwkU5
regionendpoint: http://172.16.7.1
#encrypt: false
#keyid: mykeyid
secure: false
#skipverify: false
#v4auth: true
#chunksize: "5242880"
#rootdirectory: /s3/object/name/prefix
#storageclass: STANDARD
#multipartcopychunksize: "33554432"
#multipartcopymaxconcurrency: 100
#multipartcopythresholdsize: "33554432"
```

* 安装

```bash
helm install harbor harbor/harbor -f harbor_values.yaml -n harbor
```

### 1.2 数据库在外部

```yaml
#入口配置， 暴露服务的方式："ingress", "clusterIP", "nodePort" or "loadBalancer"
expose:
type: ingress
tls:
### 是否启用 https 协议
enabled: true
certSource: secret
auto:
# The common name used to generate the certificate, it's necessary
# when the type isn't "ingress"
commonName: "harbor.ikubernetes.net"
secret:
# The name of secret which contains keys named:
# "tls.crt" - the certificate
# "tls.key" - the private key
secretName: "harbor-tls"
# The name of secret which contains keys named:
# "tls.crt" - the certificate
# "tls.key" - the private key
# Only needed when the "expose.type" is "ingress".
notarySecretName: ""

## 如果Harbor部署在代理后，将其设置为代理的URL
externalURL: https://harbor.ikubernetes.net

### Harbor 各个组件的持久化配置，并将 storageClass 设置为集群默认的 storageClass
persistence:
enabled: true
# Setting it to "keep" to avoid removing PVCs during a helm delete
# operation. Leaving it empty will delete PVCs after the chart deleted
# (this does not apply for PVCs that are created for internal database
# and redis components, i.e. they are never deleted automatically)
resourcePolicy: "keep"
persistentVolumeClaim:
registry:
# Use the existing PVC which must be created manually before bound,
# and specify the "subPath" if the PVC is shared with other components
existingClaim: ""
# Specify the "storageClass" used to provision the volume. Or the default
# StorageClass will be used(the default).
# Set it to "-" to disable dynamic provisioning
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany# 因为需要高可用，一般需要使用支持 ReadWriteMany 存储
size: 100Gi
chartmuseum:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
jobservice:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
# If external database is used, the following settings for database will
# be ignored
database:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
# If external Redis is used, the following settings for Redis will
# be ignored
redis:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteMany
size: 5Gi
trivy:
existingClaim: ""
storageClass: "csi-rbd-sc"
subPath: ""
accessMode: ReadWriteOnce
size: 5Gi

### 默认用户名 admin 的密码配置，注意：密码中一定要包含大小写字母与数字
harborAdminPassword: "Hx123456"

### 设置日志级别
logLevel: info

#各个组件 CPU & Memory 资源相关配置
nginx:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 500m
portal:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 500m
core:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 1000m
jobservice:
replicas: 1
resources:
requests:
memory: 256Mi
cpu: 500m
registry:
replicas: 1
registry:
resources:
requests:
memory: 256Mi
cpu: 500m
controller:
resources:
requests:
memory: 256Mi
cpu: 500m
clair:
clair:
resources:
requests:
memory: 256Mi
cpu: 500m
adapter:
resources:
requests:
memory: 256Mi
cpu: 500m
notary:
server:
resources:
requests:
memory: 256Mi
cpu: 500m
signer:
resources:
requests:
memory: 256Mi
cpu: 500m
database:
  type: external
  external:
    host: "172.139.20.188"
    port: "5432"
    username: "postgres"
    password: "123456"
    coreDatabase: "registry"
redis:
replicas: 1
internal:
resources:
requests:
memory: 256Mi
cpu: 500m
trivy:
enabled: true
resources:
requests:
cpu: 200m
memory: 512Mi
limits:
cpu: 1000m
memory: 1024Mi

#开启 chartmuseum，使 Harbor 能够存储 Helm 的 chart
chartmuseum:
enabled: true
resources:
requests:
memory: 256Mi
cpu: 500m

imageChartStorage:
# Specify whether to disable `redirect` for images and chart storage, for
# backends which not supported it (such as using minio for `s3` storage type), please disable
# it. To disable redirects, simply set `disableredirect` to `true` instead.
# Refer to
# https://github.com/docker/distribution/blob/master/docs/configuration.md#redirect
# for the detail.
disableredirect: false
# Specify the "caBundleSecretName" if the storage service uses a self-signed certificate.
# The secret must contain keys named "ca.crt" which will be injected into the trust store
# of registry's and chartmuseum's containers.
# caBundleSecretName:

# Specify the type of storage: "filesystem", "azure", "gcs", "s3", "swift",
# "oss" and fill the information needed in the corresponding section. The type
# must be "filesystem" if you want to use persistent volumes for registry
# and chartmuseum
type: s3
s3:
region: cn-hangzhou-1
bucket: harbor
accesskey: VGZQY32LMFQOQPVNTDSJ
secretkey: YZMMYqoy1ypHaqGOUfwLvdAj9A731iDYDjYqwkU5
regionendpoint: http://172.16.7.1
#encrypt: false
#keyid: mykeyid
secure: false
#skipverify: false
#v4auth: true
#chunksize: "5242880"
#rootdirectory: /s3/object/name/prefix
#storageclass: STANDARD
#multipartcopychunksize: "33554432"
#multipartcopymaxconcurrency: 100
#multipartcopythresholdsize: "33554432"
```


# Harbor 高可用架构

## 1 Habor主备

**主备Harbor互相镜像同步，搭配nginx作故障切换**

❌ 注意

* 主从Harbor不要开启https访问，https证书校验放在nginx层做
* harbor镜像同步支持pull和push两种方式，两种都配了，push是事件驱动，当有新镜像推到仓库中，会立刻向目标仓库同步，pull方式作为补偿，比如主harbor挂了五分钟，这五分钟内的镜像都推送到了从harbor中，当主harbor恢复后，这五分钟内产生的镜像会通过pull的方式同步到主harbor中

## 2 共享存储和共享数据库-推荐

官档,[https://goharbor.io/docs/1.10/install-config/harbor-ha-helm/](https://goharbor.io/docs/1.10/install-config/harbor-ha-helm/)

![Harbor High Availability with Helm](https://nnaigos.oss-cn-hangzhou.aliyuncs.com/imgs/202408081729833.png)



# 备份

```bash
#!/bin/bash
harborUsername='admin'
harborPassword='Harbor12345'
harborRegistry='registry.test.com'
harborBasicAuthToken=$(echo-n "${harborUsername}:${harborPassword}" |base64)
dockerlogin--username ${harborUsername} --password ${harborPassword} ${harborRegistry}
rm-fdist/images.list
rm-fdist/charts.list
# list projects
projs=`curl-s-k-H "Authorization: Basic ${harborBasicAuthToken}" "https://${harborRegistry}"'/api/projects?page=1&page_size=1000' |jq-r '.[] | "\(.project_id)=\(.name)"'`
for proj in ${projs[*]}; do
  projId=`echo$proj|cut-d '=' -f1`
  projName=`echo$proj|cut-d '=' -f2`
# list repos in one project
  repos=`curl-s-k-H "Authorization: Basic ${harborBasicAuthToken}" "https://${harborRegistry}"'/api/repositories?page=1&page_size=1000&project_id='"${projId}" |jq-r '.[] | "\(.id)=\(.name)"'`
for repo in ${repos[*]}; do
    repoId=`echo$repo|cut-d '=' -f1`
    repoName=`echo$repo|cut-d '=' -f2`
# list tags in one repo
    tags=`curl-s-k-H "Authorization: Basic ${harborBasicAuthToken}" "https://${harborRegistry}"'/api/repositories/'"${repoName}"'/tags?detail=1' |jq-r '.[].name'`
for tag in ${tags[*]}; do
#echo ${tag};
# pull image
dockerpull ${harborRegistry}/${repoName}:${tag}
# tag image
dockertag ${harborRegistry}/${repoName}:${tag} ${repoName}:${tag}
# save image
mkdir-p$(dirname dist/${repoName})
dockersave-odist/${repoName}:${tag}.tar  ${repoName}:${tag}
# record image to list file
echo"${repoName}:${tag}">>dist/images.list
done
done
# list charts in one project
  charts=`curl-s-k-H "Authorization: Basic ${harborBasicAuthToken}" "https://${harborRegistry}"'/api/chartrepo/'"${projName}"'/charts' |jq-r '.[].name'`
for chart in ${charts[*]}; do
#echo ${chart}
# list download urls in one chart
    durls=`curl-s-k-H "Authorization: Basic ${harborBasicAuthToken}" "https://${harborRegistry}"'/api/chartrepo/'"${projName}"'/charts/'"${chart}" |jq-r '.[].urls[0]'`
#echo ${durl[*]}
for durl in ${durls[*]}; do
#echo ${durl};
# download chart
mkdir-p$(dirname dist/${projName}/${durl})
curl-s-k-H"Authorization: Basic ${harborBasicAuthToken}"-odist/${projName}/${durl} "https://${harborRegistry}/chartrepo/${projName}/${durl}"
# record chart to list file
echo"${projName}/${durl}">>dist/charts.list

done
done
done
```

# 还原

```bash
#!/bin/bash
harborUsername='admin'
harborPassword='Harbor12345'
harborRegistry='registry.test.com'
harborBasicAuthToken=$(echo-n "${harborUsername}:${harborPassword}" |base64)
dockerlogin--username ${harborUsername} --password ${harborPassword} ${harborRegistry}
while IFS=""read-rimage|| [ -n"$image" ]
do
  projName=${image%%/*}
# echo ${projName}
# create harbor project
curl-k-XPOST-H"Authorization: Basic ${harborBasicAuthToken}""https://${harborRegistry}/api/projects"-H"accept: application/json"-H"Content-Type: application/json"-d'{ "project_name": "'"$projName"'", "metadata": { "public": "true" }}'
# load image
dockerload-idist/${image}.tar
# tag image
dockertag ${image} ${harborRegistry}/${image}
# push image
dockerpush ${harborRegistry}/${image}
done< dist/images.list
while IFS=""read-rchart|| [ -n"$chart" ]
do
  projName=${chart%%/*}
# echo ${projName}
# create harbor project
curl-k-XPOST-H"Authorization: Basic ${harborBasicAuthToken}""https://${harborRegistry}/api/projects"-H"accept: application/json"-H"Content-Type: application/json"-d'{ "project_name": "'"$projName"'", "metadata": { "public": "true" }}'
# upload chart
curl-s-k-H"Authorization: Basic ${harborBasicAuthToken}"-XPOST"https://${harborRegistry}/api/chartrepo/${projName}/charts"-H"accept: application/json"-H"Content-Type: multipart/form-data"-F"chart=@dist/${chart};type=application/gzip"
done< dist/charts.list
```
