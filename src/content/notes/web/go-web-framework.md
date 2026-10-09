---
title: 目录结构设计
description: markdown project/ │ ├── api/ API 层
date: '2025-06-01'
area: Web
tags: []
language: zh-CN
draft: false
---
# 目录结构设计

```markdown
project/
│
├── api/               # API 层

，定义路由和接口
│   ├── v1/
│   └── v2/
│
├── cmd/               # 启动入口
│   └── main.go
│
├── config/            # 配置文件
│   └── config.yaml
│
├── internal/          # 内部核心代码
│   ├── controllers/   # 控制器，负责处理请求
│   ├── services/      # 业务逻辑


│   ├── models/        # 数据模型层


│   ├── repositories/  # 数据访问层


│   └── middlewares/   # 中间件


│
├── pkg/               # 独立封装的公共库
│   └── logger/
│
├── docs/              # 项目文档
│
├── scripts/           # 脚本文件（如部署、数据迁移）
│
├── tests/             # 测试用例
│
└── go.mod             # 模块管理文件
```

* **controllers/**：用来接收请求，返回响应，绝不写业务逻辑。
* **services/**：业务逻辑处理的地方。
* **models/**：定义数据库表结构或数据结构体。
* **repositories/**：专门操作数据库或存储的模块。
* **middlewares/**：[Gin 框架](https://zhida.zhihu.com/search?content_id=699896646&content_type=Answer&match_order=1&q=Gin+%E6%A1%86%E6%9E%B6&zhida_source=entity)


![1748753971569](/knowledge-assets/web/image/go-web-framework/1748753971569.png)

对于简洁架构来说分为了四层：

* Entities：实体
* Usecase：表达应用业务规则，对应的是应用层，它封装和实现系统的所有用例；
* Interface Adapters：这一层的软件基本都是一些适配器，主要用于将用例和实体中的数据转换为外部系统如数据库或Web使用的数据；
* Framework & Driver：最外面一圈通常是由一些框架和工具组成，如数据库Database, Web框架等

层与层之间通过接口交互，如果要用 service 调用 repo 层，那么应该调用 repo 的接口

![1748755150157](/knowledge-assets/web/image/go-web-framework/1748755150157.png)



# Gin-Vue-Admin

Go的Web框架大致可以分为这么两类：

1. Router框架
2. MVC类框架

## 使用需要组件

* [X] viper
* [X] zap
* [X] gorm (必须选择以下任意一个)
  * clickhouse
  * mssql
  * mysql
  * oracle
  * postgres
  * sqlite
  * tidb
* [X] redis (可选)
* [X] jwt

## 优化

* [X] request/model/response 职责分明
  * [X] request 用于接收参数 不应该含有gorm标签
* [X] 代码生成器 使用embed代替频繁读写磁盘io
* [X] 使用 `gen` 代替 `gorm` 更加安全, 代码结构更清晰
* [X] 舍弃 `enter` 设计
* [X] 验证码持久化成全局变量, 不需要验证码请求都去读取配置创建实例
* [X] 去掉对gkit库依赖
* [X] 验证码可选redis或者本地sync.Map, 包括验证码和ip的请求次数

## 移除功能

* [X] 角色管理 => 资源权限
* [X] 客户列表(资源示例)
* [X] 服务器状态
* [X] 公告管理[示例]
* [X] 表单生成器
* [X] 表格模板
* [X] 断点续传
* [X] 初始化数据库

## TODO

* [ ] 参数校验 使用 `go-playground/validator` 替换 gva自己实现的验证器
* [ ] 监控core/gin/plugin.go 文件有更新则热重启项目
* [X] AutoCode 代码生成器=>创建&&预览
  * [X] [auto_code_clickhouse.go]
  * [X] [auto_code_mysql.go]
  * [X] [auto_code_postgres.go]
  * [X] [auto_code_mssql.go]
  * [X] [auto_code_oracle.go]
  * [X] [auto_code_sqlite.go]
  * [X] [auto_code_tidb.go]
* [X] AutoCodeHistory 代码生成器=>历史记录
* [ ] AutoCodePlugin 代码生成器=>插件
* [X] AutoCodeTemplate 代码生成器=>模版
* [ ] 模版新增mongodb支持
* [X] plugin/gva/plugin/template 插件模版 gen改造
* [X] 初始化数据

## 使用说明

### shadow纯后端脚手架

cmd/gva/* => shadow/cmd/gva/*
server/core/plugin_admin.go => shadow/core/plugin_admin.go
server/plugin/gva/* => shadow/plugin/gva/*

### web

只需要修改web/src/utils/request.js

<details data-line="65" class="md-editor-code" open=""><summary class="md-editor-code-head"><div class="md-editor-code-flag"><span></span><span></span><span></span></div><div class="md-editor-code-action"><span class="md-editor-code-lang">js</span><span class="md-editor-copy-button" data-tips="复制代码">复制代码</span><span class="md-editor-collapse-tips"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-left md-editor-icon"><circle cx="12" cy="12" r="10"></circle><path d="m14 16-4-4 4-4"></path></svg></span></div></summary>

```js
baseURL: import.meta.env.VITE_BASE_API,
```

</details>

修改为

<details data-line="69" class="md-editor-code" open=""><summary class="md-editor-code-head"><div class="md-editor-code-flag"><span></span><span></span><span></span></div><div class="md-editor-code-action"><span class="md-editor-code-lang">js</span><span class="md-editor-copy-button" data-tips="复制代码">复制代码</span><span class="md-editor-collapse-tips"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-left md-editor-icon"><circle cx="12" cy="12" r="10"></circle><path d="m14 16-4-4 4-4"></path></svg></span></div></summary>

```js
baseURL: import.meta.env.VITE_BASE_API + '/gva',
```

</details>

## 如果使用原gva数据可以在cmd/gva/configs/gva.xxx.yaml, Prefix设置为'gva'.
