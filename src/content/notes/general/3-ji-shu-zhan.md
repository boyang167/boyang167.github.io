---
title: 1-Nginx
description: 作用： http 代理 ，反向代理
date: '2025-04-13'
area: General
tags: []
language: zh-CN
order: 3
draft: false
---
# 1-Nginx

**作用： http 代理 ，反向代理**

正向代理： server-nginx

反向代理： nginx-server

**提供负载均衡： 内置策略和扩展策略**

**内置策略： 轮询，加权轮询 Ip hash**

**iphash: 对客服端的请求的ip进行hash操作，然后根据hash结果将同一个客服端的ip请求分发给同一台服务器处理，可以解决session不共享的问题**

**扩展策略** UWSGI

**wsgi (python web server gateway interface) Flask Django **

1. **WSGI 是一套接口标注协议*
