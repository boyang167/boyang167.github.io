---
title: 1. 日志驱动
description: >-
  Docker包括多种容器日志记录方式，这个机制又叫做logging drivers。logging driver经常在配置在Docker
  守护进程级别，默认的logging driver是json file. 还支持以下几种级别
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 6
draft: false
---
# 1. 日志驱动

Docker包括多种容器日志记录方式，这个机制又叫做logging drivers。logging driver经常在配置在Docker 守护进程级别，默认的logging driver是json-file. 还支持以下几种级别

| [Driver](https://docs.docker.com/engine/logging/configure/)                | Description                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `none`                                                                | No logs are available for the container and `docker logs`does not return any output.                       |
| [`local`](https://docs.docker.com/engine/logging/drivers/local/)         | Logs are stored in a custom format designed for minimal overhead.                                            |
| [`json-file`](https://docs.docker.com/engine/logging/drivers/json-file/) | The logs are formatted as JSON. The default logging driver for Docker.                                       |
| [`syslog`](https://docs.docker.com/engine/logging/drivers/syslog/)       | Writes logging messages to the `syslog`facility. The `syslog`daemon must be running on the host machine. |
| [`journald`](https://docs.docker.com/engine/logging/drivers/journald/)   | Writes log messages to `journald`. The `journald`daemon must be running on the host machine.             |
| [`gelf`](https://docs.docker.com/engine/logging/drivers/gelf/)           | Writes log messages to a Graylog Extended Log Format (GELF) endpoint such as Graylog or Logstash.            |
