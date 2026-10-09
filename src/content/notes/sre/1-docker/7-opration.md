---
title: 1. 容器时区
description: 1.1 docker
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 7
draft: false
---
# 1. 容器时区

## 1.1 docker

```
docker run -p 3306:3306 --name mysql -v /etc/localtime:/etc/localtime
```

## 1.2 Dockerfile

```bash
# 方法1
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 使用软连接，并且将时区配置覆盖/etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TimeZone /etc/localtime && echo $TimeZone > /etc/timezone

# 方法2
# CentOS
RUN echo "Asia/shanghai" > /etc/timezone
# Ubuntu
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

## 1.3 docker-compose

```bash
#第一种方式(推荐)：
environment:
TZ:Asia/Shanghai

#第二种方式：
environment:
  SET_CONTAINER_TIMEZONE=true
  CONTAINER_TIMEZONE=Asia/Shanghai

#第三种方式：
volumes:
-/etc/timezone:/etc/timezone
-/etc/localtime:/etc/localtime
```
