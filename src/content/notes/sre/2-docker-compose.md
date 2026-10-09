---
title: 1.Docker-compose
description: 1.1 介绍
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
order: 2
draft: false
---
# 1.Docker-compose

## 1.1 介绍

docker Compose是一个用来定义和运行复杂应用的Docker工具。一个使用Docker容器的应用，通常由多个容器组成。使用Docker Compose不再需要使用shell脚本来启动容器。

Compose 通过一个配置文件来管理多个Docker容器，在配置文件中，所有的容器通过services来定义，然后使用docker-compose脚本来启动，停止和重启应用，和应用中的服务以及所有依赖服务的容器，非常适合组合使用多个容器进行开发的场景。

## 1.1 是如何工作？

Docker-compose使用Yaml文件来管理容器服务。YAML模板文件的组成包含， [services](https://docs.docker.com/reference/compose-file/services/)， [networks](https://docs.docker.com/reference/compose-file/networks/)， [volumes](https://docs.docker.com/reference/compose-file/volumes/)， [configs](https://docs.docker.com/reference/compose-file/configs/)， [secret](https://docs.docker.com/reference/compose-file/secrets/)

默认使用 `compose.yml`或者 `compose.yaml`来启动服务,也支持 `docker-compose.yaml`

## 1.2 为什么使用它？

可以简化应用程序的部署和管理，有以下几点

* 简化的控制:Docker Compose允许您在单个YAML文件中定义和管理多容器应用程序。这简化了协调和协调各种服务的复杂任务,从而使管理和复制应用程序环境变得更加容易。
* 高效的协作:Docker Compose配置文件易于共享,从而促进了开发人员,运营团队和其他利益相关者之间的协作。这种协作方法可实现更顺畅的工作流程,更快的问题解决方案并提高整体效率。
* 快速应用程序开发:组成缓存用于创建容器的配置。重新启动未更改的服务时,Compose会重新使用现有容器。重新使用容器意味着您可以非常快速地更改环境。
* 跨环境的可移植性:Compose支持Compose文件中的变量。您可以使用这些变量为不同的环境或不同的用户自定义构图。
* 广泛的社区和支持:Docker Compose受益于充满活力和活跃的社区,这意味着丰富的资源,教程和支持。这个社区驱动的生态系统有助于Docker Compose的不断改进,并帮助用户有效地解决问题。

## 1.3 发展历史

![1748075537190](/knowledge-assets/sre/image/2-docker-compose/1748075537190.png)

# Docker-compose部署

## 1.1 单独安装

 **推荐此方式** ，由于此方式是二进制包，直接下载放到/usr/local/bin/即可

```bash
curl -SL https://github.com/docker/compose/releases/download/v2.30.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose

#或者自动根据系统下载
curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')" /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

#或者下载最新
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)
mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
chmod -v +x /usr/local/bin/docker-compose
```

💡 说明

注意版本兼容性

docker --version

docker-compose --version

## 1.2 安装插件

[官当](https://docs.docker.com/compose/install/linux/)

> docker1.24开始支持插件形式

```bash
yum update

yum install docker-compose-plugin

# 安装完成后查看版本号
docker compose version
```

## 1.3 卸载

[官当](https://docs.docker.com/compose/install/uninstall/)

* 对于插件方式

```bash
yum remove docker-compose-plugin
```

* 对于二进制方式

```bash
#查看路径
docker info --format '{{range .ClientInfo.Plugins}}{{if eq .Name "compose"}}{{.Path}}{{end}}{{end}}'

rm $DOCKER_CONFIG/cli-plugins/docker-compose
```

# compose模板文件组成

顶级层次，由6部分组成

## 1.1 version

填写版本号，一般不用写

## 1.2 services

定义服务名字

## 1.3 networks

定义网络

## 1.4 volumes

定义存储

## 1.5 configs

## 1.6 secrets

# 2. compose语法

用空格来控制格式，空出3个空格

## 2.1 services

[官当](https://docs.docker.com/reference/compose-file/services/)

### image

```yaml
services:
  web:
    image: hello-world
```

在 services 标签下的第二级标签是 web，这个名字是用户自己自定义，它就是服务名称。 image 则是指定服务的镜像名称或镜像 ID。如果镜像在本地不存在，Compose 将会尝试拉取这个镜像

### container_name

```yaml
services:
  web:
    image: hello-world
    container_name: vector
```

### hostname

```yaml
services:
  web:
    image: hello-world
    container_name: vector
    hostname: vector
```

### restart

描述：启动策略

`restart` defines the policy that the platform applies on container termination.

* `no`: The default restart policy. It does not restart the container under any circumstances.
* `always`: The policy always restarts the container until its removal.
* `on-failure[:max-retries]`:
  The policy restarts the container if the exit code indicates an error.
  Optionally, limit the number of restart retries the Docker daemon
  attempts.
* `unless-stopped`: The policy restarts the container irrespective of the exit code but stops restarting when the service is stopped or removed.


```yaml
services:
  web:
    image: hello-world
    container_name: vector
    hostname: vector
    restart: always
```

### ports

描述：启动映射外部端口

```yaml
services:
  web:
    image: hello-world
    container_name: vector
    hostname: vector
    restart: always
    ports:
      - 8686:8686
```

> ports 其它写法

```yaml
ports:
  - "3000"
  - "3000-3005"
  - "8000:8000"
  - "9090-9091:8080-8081"
  - "49100:22"
  - "8000-9000:80"
  - "127.0.0.1:8001:8001"
  - "127.0.0.1:5000-5010:5000-5010"
  - "6060:6060/udp"
```

### volumes

```yaml
services:
  web:
    image: hello-world
    container_name: vector
    hostname: vector
    restart: always
    ports:
      - 8686:8686
    volumes:
      - /var/log/nginx:/nginx_logs  # 这是需要采集的日志的路径需要挂载到容器内
```

# compse创建服务

## 1.1 create

描述：只是创建一个服务，并不会启动容器

语法：

```
docker compose --help
```

| Description | Creates containers for a service                 |
| ----------- | ------------------------------------------------ |
| Usage       | `docker compose create [OPTIONS] [SERVICE...]` |

```bash
docker compose create--help
```

| Option               | Default    | Description                                                                                    |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `--build`          |            | Build images before starting containers                                                        |
| `--force-recreate` |            | Recreate containers even if their configuration and image haven't changed                      |
| `--no-build`       |            | Don't build an image, even if it's policy                                                      |
| `--no-recreate`    |            | If containers already exist, don't recreate them. Incompatible with --force-recreate.          |
| `--pull`           | `policy` | Pull image before running ("always"                                                            |
| `--quiet-pull`     |            | Pull without printing progress information                                                     |
| `--remove-orphans` |            | Remove containers for services not defined in the Compose file                                 |
| `--scale`          |            | Scale SERVICE to NUM instances. Overrides the `scale`setting in the Compose file if present. |

## 1.2 run

描述：运行一次性命令

| Description | Run a one-off command on a service                           |
| ----------- | ------------------------------------------------------------ |
| Usage       | `docker compose run [OPTIONS] SERVICE [COMMAND] [ARGS...]` |

| Option                  | Default  | Description                                                                      |
| ----------------------- | -------- | -------------------------------------------------------------------------------- |
| `--build`             |          | Build image before starting container                                            |
| `--cap-add`           |          | Add Linux capabilities                                                           |
| `--cap-drop`          |          | Drop Linux capabilities                                                          |
| `-d, --detach`        |          | Run container in background and print container ID                               |
| `--entrypoint`        |          | Override the entrypoint of the image                                             |
| `-e, --env`           |          | Set environment variables                                                        |
| `-i, --interactive`   | `true` | Keep STDIN open even if not attached                                             |
| `-l, --label`         |          | Add or override a label                                                          |
| `--name`              |          | Assign a name to the container                                                   |
| `-T, --no-TTY`        | `true` | Disable pseudo-TTY allocation (default: auto-detected)                           |
| `--no-deps`           |          | Don't start linked services                                                      |
| `-p, --publish`       |          | Publish a container's port(s) to the host                                        |
| `--quiet-pull`        |          | Pull without printing progress information                                       |
| `--remove-orphans`    |          | Remove containers for services not defined in the Compose file                   |
| `--rm`                |          | Automatically remove the container when it exits                                 |
| `-P, --service-ports` |          | Run command with all service's ports enabled and mapped to the host              |
| `--use-aliases`       |          | Use the service's network useAliases in the network(s) the container connects to |
| `-u, --user`          |          | Run as specified username or uid                                                 |
| `-v, --volume`        |          | Bind mount a volume                                                              |
| `-w, --workdir`       |          | Working directory inside the container                                           |

比如：


```bash
docker compose run web bash

bash-->执行你所运行的命令
```

## 1.3 up

描述：这个会创建并启动服务。这个对已经存在的服务会重新停止并创建。

| Description | Create and start containers                  |
| ----------- | -------------------------------------------- |
| Usage       | `docker compose up [OPTIONS] [SERVICE...]` |

| Option                                                                   | Default    | Description                                                                                             |
| ------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------- |
| `--abort-on-container-exit`                                            |            | Stops all containers if any container was stopped. Incompatible with -d                                 |
| `--abort-on-container-failure`                                         |            | Stops all containers if any container exited with failure. Incompatible with -d                         |
| `--always-recreate-deps`                                               |            | Recreate dependent containers. Incompatible with --no-recreate.                                         |
| `--attach`                                                             |            | Restrict attaching to the specified services. Incompatible with --attach-dependencies.                  |
| `--attach-dependencies`                                                |            | Automatically attach to log output of dependent services                                                |
| `--build`                                                              |            | Build images before starting containers                                                                 |
| `-d, --detach`                                                         |            | Detached mode: Run containers in the background                                                         |
| `--exit-code-from`                                                     |            | Return the exit code of the selected service container. Implies --abort-on-container-exit               |
| `--force-recreate`                                                     |            | Recreate containers even if their configuration and image haven't changed                               |
| `--menu`                                                               |            | Enable                                                                                                  |
| interactive shortcuts when running attached. Incompatible with           |            |                                                                                                         |
| --detach. Can also be enable/disable by setting COMPOSE_MENU environment |            |                                                                                                         |
| var.                                                                     |            |                                                                                                         |
| `--no-attach`                                                          |            | Do not attach (stream logs) to the specified services                                                   |
| `--no-build`                                                           |            | Don't build an image, even if it's policy                                                               |
| `--no-color`                                                           |            | Produce monochrome output                                                                               |
| `--no-deps`                                                            |            | Don't start linked services                                                                             |
| `--no-log-prefix`                                                      |            | Don't print prefix in logs                                                                              |
| `--no-recreate`                                                        |            | If containers already exist, don't recreate them. Incompatible with --force-recreate.                   |
| `--no-start`                                                           |            | Don't start the services after creating them                                                            |
| `--pull`                                                               | `policy` | Pull image before running ("always"                                                                     |
| `--quiet-pull`                                                         |            | Pull without printing progress information                                                              |
| `--remove-orphans`                                                     |            | Remove containers for services not defined in the Compose file                                          |
| `-V, --renew-anon-volumes`                                             |            | Recreate anonymous volumes instead of retrieving data from the previous containers                      |
| `--scale`                                                              |            | Scale SERVICE to NUM instances. Overrides the `scale`setting in the Compose file if present.          |
| `-t, --timeout`                                                        |            | Use this timeout in seconds for container shutdown when attached or when containers are already running |
| `--timestamps`                                                         |            | Show timestamps                                                                                         |
| `--wait`                                                               |            | Wait for services to be running                                                                         |
| `--wait-timeout`                                                       |            | Maximum duration to wait for the project to be running                                                  |
| `-w, --watch`                                                          |            | Watch source code and rebuild/refresh containers when files are updated.                                |

# 2. compose启动服务

## 2.1 start

描述：这个是启动已经存在的服务

| Description | Start services                        |
| ----------- | ------------------------------------- |
| Usage       | `docker compose start [SERVICE...]` |

# 3. compose关闭服务

## 3.1 stop

描述：停止运行容器并不是删除。

| Description | Stop services                                  |
| ----------- | ---------------------------------------------- |
| Usage       | `docker compose stop [OPTIONS] [SERVICE...]` |

| Option            | Default | Description                           |
| ----------------- | ------- | ------------------------------------- |
| `-t, --timeout` |         | Specify a shutdown timeout in seconds |

## 3.2 kill

描述：强制停止服务

| Description | Force stop service containers                    |
| ----------- | ------------------------------------------------ |
| Usage       | `docker compose kill [OPTIONS] [SERVICE...]`、 |

| Option               | Default     | Description                                                    |
| -------------------- | ----------- | -------------------------------------------------------------- |
| `--remove-orphans` |             | Remove containers for services not defined in the Compose file |
| `-s, --signal`     | `SIGKILL` | SIGNAL to send to the container                                |

**bash**

```
dockercomposekill-sSIGINT
```

# 4. compose删除服务

## 4.1 down

| Description | Stop and remove containers, networks         |
| ----------- | -------------------------------------------- |
| Usage       | `docker compose down [OPTIONS] [SERVICES]` |

| Option               | Default | Description                                                                                                             |
| -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `--remove-orphans` |         | Remove containers for services not defined in the Compose file                                                          |
| `--rmi`            |         | Remove images used by services. "local" remove only images that don't have a custom tag ("local"                        |
| `-t, --timeout`    |         | Specify a shutdown timeout in seconds                                                                                   |
| `-v, --volumes`    |         | Remove named volumes declared in the "volumes" section of the Compose file and anonymous volumes attached to containers |

## 4.2 rm

描述：删除已经停止的服务

| Description | Removes stopped service containers           |
| ----------- | -------------------------------------------- |
| Usage       | `docker compose rm [OPTIONS] [SERVICE...]` |

| Option            | Default | Description                                         |
| ----------------- | ------- | --------------------------------------------------- |
| `-f, --force`   |         | Don't ask to confirm removal                        |
| `-s, --stop`    |         | Stop the containers, if required, before removing   |
| `-v, --volumes` |         | Remove any anonymous volumes attached to containers |

# 5. compose查看

## 5.1 ps

描述：列出容器

| Description | List containers                              |
| ----------- | -------------------------------------------- |
| Usage       | `docker compose ps [OPTIONS] [SERVICE...]` |

| Option                                                                                                                                                                                                 | Default   | Description                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| `-a, --all`                                                                                                                                                                                          |           | Show all stopped containers (including those created by the run command) |
| [`--filter`](https://docs.docker.com/reference/cli/docker/compose/ps/#filter)                                                                                                                           |           | Filter services by a property (supported filters: status)                |
| [`--format`](https://docs.docker.com/reference/cli/docker/compose/ps/#format)                                                                                                                           | `table` | Format                                                                   |
| output using a custom template: 'table': Print output in table format                                                                                                                                  |           |                                                                          |
| with column headers (default) 'table TEMPLATE': Print output in table                                                                                                                                  |           |                                                                          |
| format using the given Go template 'json': Print in JSON format                                                                                                                                        |           |                                                                          |
| 'TEMPLATE': Print output using the given Go template. Refer to[https://docs.docker.com/go/formatting/](https://docs.docker.com/go/formatting/)for more information about formatting output with templates |           |                                                                          |
| `--no-trunc`                                                                                                                                                                                         |           | Don't truncate output                                                    |
| `--orphans`                                                                                                                                                                                          | `true`  | Include orphaned services (not declared by project)                      |
| `-q, --quiet`                                                                                                                                                                                        |           | Only display IDs                                                         |
| `--services`                                                                                                                                                                                         |           | Display services                                                         |
| [`--status`](https://docs.docker.com/reference/cli/docker/compose/ps/#status)                                                                                                                           |           | Filter services by status. Values: [paused                               |

**bash**

```
dockercomposeps--formatjson|jq.
[
  {
"ID": "1553b0236cf4d2715845f053a4ee97042c4f9a2ef655731ee34f1f7940eaa41a",
"Name": "example-bar-1",
"Command": "/docker-entrypoint.sh nginx -g 'daemon off;'",
"Project": "example",
"Service": "bar",
"State": "exited",
"Health": "",
"ExitCode": 0,
"Publishers": null
  },
  {
"ID": "f02a4efaabb67416e1ff127d51c4b5578634a0ad5743bd65225ff7d1909a3fa0",
"Name": "example-foo-1",
"Command": "/docker-entrypoint.sh nginx -g 'daemon off;'",
"Project": "example",
"Service": "foo",
"State": "running",
"Health": "",
"ExitCode": 0,
"Publishers": [
      {
"URL": "0.0.0.0",
"TargetPort": 80,
"PublishedPort": 8080,
"Protocol": "tcp"
      }
    ]
  }
]
```

## 5.2 ls

描述：列出正在运行的项目

| Description | List running compose projects   |
| ----------- | ------------------------------- |
| Usage       | `docker compose ls [OPTIONS]` |

| Option          | Default   | Description                                |
| --------------- | --------- | ------------------------------------------ |
| `-a, --all`   |           | Show all stopped Compose projects          |
| `--filter`    |           | Filter output based on conditions provided |
| `--format`    | `table` | Format the output. Values: [table          |
| `-q, --quiet` |           | Only display IDs                           |

## 5.3 logs

描述：查看服务日志

| Description | View output from containers                    |
| ----------- | ---------------------------------------------- |
| Usage       | `docker compose logs [OPTIONS] [SERVICE...]` |

| Option               | Default | Description                                                                                    |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `-f, --follow`     |         | Follow log output                                                                              |
| `--index`          |         | index of the container if service has multiple replicas                                        |
| `--no-color`       |         | Produce monochrome output                                                                      |
| `--no-log-prefix`  |         | Don't print prefix in logs                                                                     |
| `--since`          |         | Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)    |
| `-n, --tail`       | `all` | Number of lines to show from the end of the logs for each container                            |
| `-t, --timestamps` |         | Show timestamps                                                                                |
| `--until`          |         | Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes) |

## 5.4 images

描述：查看镜像

| Description | List images used by the created containers       |
| ----------- | ------------------------------------------------ |
| Usage       | `docker compose images [OPTIONS] [SERVICE...]` |

| Option          | Default   | Description                       |
| --------------- | --------- | --------------------------------- |
| `--format`    | `table` | Format the output. Values: [table |
| `-q, --quiet` |           | Only display IDs                  |

## 5.5 version

描述：查看版本

| Description | Show the Docker Compose version information |
| ----------- | ------------------------------------------- |
| Usage       | `docker compose version [OPTIONS]`        |

| Option           | Default | Description                         |
| ---------------- | ------- | ----------------------------------- |
| `-f, --format` |         | Format the output. Values: [pretty  |
| `--short`      |         | Shows only Compose's version number |


```bash
docker compose version
```
