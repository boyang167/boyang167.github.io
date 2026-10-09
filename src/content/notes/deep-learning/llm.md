---
title: Function call
description: llm+ call api
date: '2025-06-21'
area: Deep Learning
tags: []
language: zh-CN
draft: false
---
# Function call

llm+ call api

Function call 垂直调用方式，大大提高了AI agent 的开发门槛。大部分情况下只能通过Dify, Coze 这些平台来构建Agent。

![1749901681949](/knowledge-assets/deep-learning/image/llm/1749901681949.png)

# MCP： Model context Protocol

Aim:  通过LLM 使用外部的工具完成某个特定的任务

Define：

this is protocol is designed to change how ai models interact with external tools and data sources, aiming to resolve the complex problem of connecting multiple ai models with numnerous data sources and tools-a longstanding issue for enterprises and developers.

MCP 定义了应用程序和AI 模型之间交换上下文信息的方式，使开发者能够以一致的方式将各种数据源，工具和功能连接到Ai （一个中间协议层）

就像USB-C 让不同的设备能够通过相同的接口连接。

![1749901457584](/knowledge-assets/deep-learning/image/llm/1749901457584.png)

![1749901513656](/knowledge-assets/deep-learning/image/llm/1749901513656.png)

![1749901782269](/knowledge-assets/deep-learning/image/llm/1749901782269.png)

# MCP  architecture

client-server architecture (CS)

![1749902163798](/knowledge-assets/deep-learning/image/llm/1749902163798.png)

![1749902785342](/knowledge-assets/deep-learning/image/llm/1749902785342.png)



MCP 核心架构：

- MCP Hosts ：发起请求的 LLM 应用程序（例如 Claude Desktop、IDE 或 AI 工具）
- MCP  Clients ：在主机程序内部，与 MCP server 保持 1:1 的连接。
- MCP Servers ：为 MCP client 提供上下文、工具和 prompt 信息。
- Local Resources： 本地计算机中可供 MCP server 安全访问的资源（例如文件、数据库）
- Remote Resource： MCP server 可以连接到的远程资源（例如通过 API）。

![1750509124179](/knowledge-assets/deep-learning/image/llm/1750509124179.png)


MCP client 充当 LLM 和 MCP server 之间的桥梁，MCP client 的工作流程如下：

* MCP client 首先从 MCP server 获取可用的工具列表。
* 将用户的查询连同工具描述通过 function calling 一起发送给 LLM。
* LLM 决定是否需要使用工具以及使用哪些工具。
* 如果需要使用工具，MCP client 会通过 MCP server 执行相应的工具调用。
* 工具调用的结果会被发送回 LLM。
* LLM 基于所有信息生成自然语言响应。
* 最后将响应展示给用户。



https://www.bilibili.com/video/BV11MEHzwEp6?spm_id_from=333.788.videopod.sections&vd_source=ae11379595599a1cedeb268c109fc9bb

https://mcpmarket.cn/
