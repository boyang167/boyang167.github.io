---
title: 设计
description: 如何打造一个可用持续快速迭代的sass 系统
date: '2025-08-16'
area: Architecture
tags: []
language: zh-CN
draft: false
---
![1749267488894](/knowledge-assets/architecture/image/overall/1749267488894.png)

如何打造一个可用持续快速迭代的sass 系统

可靠的大型分布式系统

# 设计

OOP

Design  pattern

 SOLID

DO，BO，DTO，VO

3 层：

Presentation (表示层):  UI ,Controller ,BFF  (back end for front end )

application （业务逻辑层）： Service+validation/ CRUD

infra 数据访问层：DB ，Library

DDD  (Domain Driven Design)


# Command Query Responsibility Segregation (CQRS) 详解

## 传统CRUD vs CQRS

| 维度   | 传统CRUD         | CQRS               |
| ------ | ---------------- | ------------------ |
| 模型   | 单一模型处理读写 | 读写模型分离       |
| 复杂度 | 简单场景适用     | 复杂场景优势明显   |
| 性能   | 读写互相影响     | 读写可以独立优化   |
| 扩展性 | 扩展困难         | 易于单独扩展读或写 |

**DDD 核心思想是通过领域驱动设计方法定义领域模型，从而确定业务和应用边界，保证业务模型与代码模型的一致性** 。

![1755332970803](/knowledge-assets/architecture/image/overall/1755332970803.png)

![1755332987933](/knowledge-assets/architecture/image/overall/1755332987933.png)



Domain

Domain Model

Aggregate 

Enity

Value Object

Bounded context 








SER:

https://book.ikubernetes.net/guide/goProject

System-desgin-primer

https://geekdaxue.co/read/system-design-primer-zh_CN/README.md
