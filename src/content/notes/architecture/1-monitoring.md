---
title: Observability
description: OpenTelemetry可观测性的三个支柱：追踪、指标和日志
date: '2025-06-08'
area: Architecture
tags: []
language: zh-CN
order: 1
draft: false
---
# Observability

OpenTelemetry可观测性的三个支柱：追踪、指标和日志

* **分布式追踪**是一种跟踪服务请求在分布式系统中从开始到结束的方法。
* **指标**是对一段时间内活动的测量，以便了解系统或应用程序的性能。
* **日志**是系统或应用程序在特定时间点发生的事件的文本记录

![1749351573496](/knowledge-assets/architecture/image/overall/1749351573496.png)

传统可观测性方案的问题：

* 各家标准不统一（Prometheus、Jaeger、Zipkin、ELK 各搞各的），后期更换组件成本巨大。
* SDK 难以复用，语言多了埋点就变得混乱
* 很多工具不支持日志 + 指标 + 链路统一分析

![1749351620978](/knowledge-assets/architecture/image/overall/1749351620978.png)

OpenTelemetry 的优势是：

* 用一个统一协议打通链路、指标、日志三者
* 支持多语言自动埋点
* 和 Prometheus/Grafana/Jaeger 无缝对接

![1749351739957](/knowledge-assets/architecture/image/1-monitoring/1749351739957.png)

**OpenTelemetry 组件架构**

![1749351781445](/knowledge-assets/architecture/image/1-monitoring/1749351781445.png)

![1749351819528](/knowledge-assets/architecture/image/1-monitoring/1749351819528.png)

Trace  调用链

在OpenTracing标准中，调用链是多个Span组成的一个有向无环图（Directed Acyclic Graph，简称DAG），每一个Span代表调用链中被命名并计时的连续性执行片段。

Spans : 

一个链路由一个或多个 span 组成。第一个 span 被称为根 span，它代表了一个请求从开始到结束的全过程

瀑布图：

span 与span 父子关系

Trace： **表示一个完整的请求路径，包含多个 Span** 。

Span： **表示请求中的一个操作（如 HTTP 请求、数据库查询）** 


https://blog.csdn.net/inthat/article/details/124224595





https://www.zhihu.com/question/545762884/answer/3323681028



监控报警：

**监控错误 -> 搜集错误 -> 存储错误 -> 分析错误 -> 错误报警-> 定位错误 -> 解决错误**

* [Sentry](https://link.juejin.cn?target=https%3A%2F%2Fsentry.io%2Fwelcome%2F "https://sentry.io/welcome/")
* [BugSnag](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.bugsnag.com%2F "https://link.zhihu.com/?target=https%3A//www.bugsnag.com/")
* [RollBar](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Frollbar.com%2F "https://link.zhihu.com/?target=https%3A//rollbar.com/")
* [fundebug](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fwww.fundebug.com%2F "https://link.zhihu.com/?target=https%3A//www.fundebug.com/")
* [frontjs](https://link.juejin.cn/?target=https%3A%2F%2Ffrontjs.pgyer.com%2F "https://link.juejin.cn/?target=https%3A%2F%2Ffrontjs.pgyer.com%2F")
* [webfunny](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webfunny.cn%2Fpurchase.html "https://link.juejin.cn/?target=https%3A%2F%2Fwww.webfunny.cn%2Fpurchase.html")

## install

- docker pull docker-0.unsee.tech/redis
- docker pull docker-0.unsee.tech/postgres
- docker pull docker-0.unsee.tech/sentry

#docker run -d --name sentry-redis --restart=always redis:6.0

#docker run -d --name sentry-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=sentry --restart=always postgres:12

#docker run -it --rm -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-postgres:postgres --link sentry-redis:redis docker-0.unsee.tech/sentry upgrade

web服务

docker run -d -p 9000:9000 --name my-sentry -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-redis:redis --link sentry-postgres:postgres --restart=always docker-0.unsee.tech/sentry

cropn 服务

docker run -d --name sentry-cron -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-postgres:postgres --link sentry-redis:redis docker-0.unsee.tech/sentry run cron

work 服务

docker run -d --name sentry-worker-1 -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-postgres:postgres --link sentry-redis:redis docker-0.unsee.tech/sentry run worker

### web服务

docker run -d -p 9000:9000 --name my-sentry -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-redis:redis --link sentry-postgres:postgres --restart=always docker-0.unsee.tech/sentry

### cropn 服务

docker run -d --name sentry-cron -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-postgres:postgres --link sentry-redis:redis docker-0.unsee.tech/sentry run cron

### work 服务

docker run -d --name sentry-worker-1 -e SENTRY_SECRET_KEY='+raq9%xyd+&i)yn0yz_%d=lhqch-n%=v=0oap530!il+^3-)+1' --link sentry-postgres:postgres --link sentry-redis:redis docker-0.unsee.tech/sentry run worker

**启动**

docker network create sentry-network

docker run -d --name sentry-redis --network sentry-network docker-0.unsee.tech/redis

docker run -d --name sentry-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=sentry    --network sentry-network docker-0.unsee.tech/postgres

**生成唯一秘钥**

docker run --rm docker-0.unsee.tech/sentry config generate-secret-key

8j^)b_=*08l!fq810yoz1%xucmqkr8hs30bi4%ctzkl6ag#ss_   ###打印出secret-keys,这里最好复制一下，接下来会用到

**初始化以及创建Admin**

docker run -it --rm -e SENTRY_SECRET_KEY='8j^)b_=*08l!fq810yoz1%xucmqkr8hs30bi4%ctzkl6ag#ss_' --link sentry-postgres:postgres --link sentry-redis:redis docker-0.unsee.tech/sentry upgrade

**启动三个服务**

web服务
docker run -d -p 9000:9000 --name my-sentry -e SENTRY_SECRET_KEY='12345' --link sentry-redis:redis --link sentry-postgres:postgres --restart=always sentry

cropn 服务

docker run -d --name sentry-cron -e SENTRY_SECRET_KEY='12345' --link sentry-postgres:postgres --link sentry-redis:redis sentry run cron

work 服务

docker run -d --name sentry-worker-1 -e SENTRY_SECRET_KEY='12345' --link sentry-postgres:postgres --link sentry-redis:redis sentry run worker
