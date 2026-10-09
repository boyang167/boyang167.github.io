---
title: Message Queue
description: RabbitMQ 是一种分布式消息中间件，消息中间件也称消息队列MQ
date: '2025-05-15'
area: Web
tags: []
language: zh-CN
series: middleware
order: 3
draft: false
---
# Message Queue

RabbitMQ 是一种分布式消息中间件，消息中间件也称消息队列MQ

1️⃣ **高并发的流量削峰**

2️⃣ **应用解耦**

3️⃣ **异步处理**

4️⃣ **分布式事务**

5️⃣ **数据分发**

网络协议的三要素

* **语法** ：语法是用户数据与控制信息的结构与格式，以及数据出现的顺序。
* **语义** ：语义是解控制信息每个部分的意义。它规定了需要发出何种控制信息以及完成的动作与做出什么样的响应。
* **时序** ：时序是对事件发生顺序的详细说明

```markdown
# 类比http请求协议
1. 语法：htp规定了请求报文和响应报文的格式
2. 语义：客户端主动发起请求称之为请求。（这是一种定义，同时你发起的是post/get请求）
3. 时序：一个请求对应个响应。（定先有请求在有响应，这个是时序）
```

而消息中间件采用的并不是http协议，而常见的消息中间件协议有：`OpenWire`、`AMQP`、`MQTT`、`Kafka`、`OpenMessage`协议

```markdown
面试题：为什么消息中间件不直接使用http协议呢？

    因为http请求报文头和响应报文头是比较复杂的，包含了cookie、数据的加密解密、状态码、晌应码等附加的功能，但是对于个消息而言，我们并不需要这么复杂，也没有这个必要性，它其实就是负责数据传递，存储，分发就够，要追求的是高性能。尽量简洁，快速。
    大部分情况下http大部分都是短链接，在实际的交互过程中，一个请求到响应很有可能会中断，中断以后就不会就行持久化，就会造成请求的丢失。这样就不利于消息中间件的业务场景，因为消息中间件可能是一个长期的获取消息的过程，出现问题和故障要对数据或消息就行持久化等，目的是为了保证消息和数据的高可靠和稳健的运行。
————————————————

                            BaretH
                      
原文链接：https://blog.csdn.net/qq_45173404/article/details/121687489
```


![1747318892117](/knowledge-assets/web/middleware/image/3-rabbitmq/1747318892117.png)

- publisher：生产者，也就是发送消息的一方 （发送给交换机）
- consumer：消费者，也就是消费消息的一方（和队列进行绑定(监听)）
- queue：队列，存储消息。生产者投递的消息会暂存在消息队列中，等待消费者处理
- exchange：交换机，负责消息路由。生产者发送的消息由交换机决定投递到哪个队列。
- 交换机只能路由消息，无法存储消息
  交换机只会路由消息给与其绑定的队列，因此队列必须与交换机绑定
- virtual host：虚拟主机，起到数据隔离的作用。每个虚拟主机相互独立，有各自的exchange、queue，因为RabiitMQ性能很强，单个项目使用会造成巨大的浪费，所以多个项目，实现一套MQ，virtual host就是为了不同交换机产生隔离（和容器概念一样）






MQ消息队列有如下几个角色：

1. `Producer`：消息生产者。负责产生和发送消息到 Broker
2. `Broker`：消息处理中心。负责消息存储、确认、重试等，一般其中会包含多个 queue
3. `Consumer`：消息消费者。负责从 Broker 中获取消息，并进行相应处理

![1747317715882](/knowledge-assets/web/middleware/image/3-rabbitmq/1747317715882.png)

p :  producer 生产者

queue :  

c :  consumer  消费者




![1747318391071](/knowledge-assets/web/middleware/image/3-rabbitmq/1747318391071.png)

Exchange :  交换机

1. Fanout exchange
2. Topic exchange
3. Header exchange
4. Direct Exchange
