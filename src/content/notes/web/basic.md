---
title: MVC 架构
description: >-
  CSRF（Cross Site Request
  Forgery，跨站请求伪造）是一种常见的Web安全威胁，攻击者诱使用户在不知情的情况下以已认证用户的身份执行非预期的操作
date: '2025-05-26'
area: Web
tags: []
language: zh-CN
draft: false
---
CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种常见的Web安全威胁，攻击者诱使用户在不知情的情况下以已认证用户的身份执行非预期的操作


# MVC 架构

Dao 层： 数据对象转换，与数据交互

Model 层： 模型定义， 主要是结构体定义

Controller 层： 业务控制层，一些数据处理的Handler  都在该层

View 视图层： 前后端分离，这层一般都有前端的MVVM 替换
