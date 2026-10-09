---
title: 1. 什么是Dockerfile
description: >-
  Dockerfile使用DSL(域特定语言)并包含用于生成Docker映像的指令。Dockerfile将定义快速生成镜像的流程。创建应用程序时，您应该按顺序创建Dockerfile，因为Docker守护进程从上到下运行所有指令.
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 8
draft: false
---
# 1. 什么是Dockerfile

Dockerfile使用DSL(域特定语言)并包含用于生成Docker映像的指令。Dockerfile将定义快速生成镜像的流程。创建应用程序时，您应该按顺序创建Dockerfile，因为Docker守护进程从上到下运行所有指令.

![image-20240619094634927](https://nnaigos.oss-cn-hangzhou.aliyuncs.com/imgs/202406190946737.png)

# 2. Dockerfile基本组成

[官当](https://docs.docker.com/reference/dockerfile/)

## 2.1 基本结构

Dockerfile 由一行行命令语句组成，并且支持以 `#` 开头的注释行。

Dockerfile 分为四部分：`基础镜像信息`、`维护者信息`、`镜像操作指令`和 `容器启动时执行指令`

## 2.2 指令

| Instruction                                                                        | Description                                                    |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`ADD`](https://docs.docker.com/reference/dockerfile/#add)                          | Add local or remote files and directories.能解压               |
| [`ARG`](https://docs.docker.com/reference/dockerfile/#arg)                          | Use build-time variables.                                      |
| [`CMD`](https://docs.docker.com/reference/dockerfile/#cmd)                          | Specify default commands.                                      |
| [`COPY`](https://docs.docker.com/reference/dockerfile/#copy)                        | 复制文件或者目录                                               |
| [`ENTRYPOINT`](https://docs.docker.com/reference/dockerfile/#entrypoint)            | Specify default executable.                                    |
| [`ENV`](https://docs.docker.com/reference/dockerfile/#env)                          | 指定一个环境变量，会被后续 `RUN`指令使用，并在容器运行时保持 |
| [`EXPOSE`](https://docs.docker.com/reference/dockerfile/#expose)                    | 服务端容器暴露的端口号                                         |
| [`FROM`](https://docs.docker.com/reference/dockerfile/#from)                        | Create a new build stage from a base image.                    |
| [`HEALTHCHECK`](https://docs.docker.com/reference/dockerfile/#healthcheck)          | Check a container's health on startup.                         |
| [`LABEL`](https://docs.docker.com/reference/dockerfile/#label)                      | Add metadata to an image.                                      |
| [`MAINTAINER`](https://docs.docker.com/reference/dockerfile/#maintainer-deprecated) | 指定维护者信息                                                 |
| [`ONBUILD`](https://docs.docker.com/reference/dockerfile/#onbuild)                  | Specify instructions for when the image is used in a build.    |
| [`RUN`](https://docs.docker.com/reference/dockerfile/#run)                          | Execute build commands.                                        |
| [`SHELL`](https://docs.docker.com/reference/dockerfile/#shell)                      | Set the default shell of an image.                             |
| [`STOPSIGNAL`](https://docs.docker.com/reference/dockerfile/#stopsignal)            | Specify the system call signal for exiting a container.        |
| [`USER`](https://docs.docker.com/reference/dockerfile/#user)                        | Set user and group ID.                                         |
| [`VOLUME`](https://docs.docker.com/reference/dockerfile/#volume)                    | Create volume mounts.                                          |
| [`WORKDIR`](https://docs.docker.com/reference/dockerfile/#workdir)                  | Change working directory.                                      |

### FROM

* 语法

```
FROM <image>:<tag>
```

### LABEL

`LABEL`一般用来添加镜像的 “元数据” ，没有实际作用。常用于声明镜像作者，`licensce`等信息，写法为 `<key>=<value>`，语法为

```
LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

* 查看

```
# docker image inspect --format='' myimage
{
  "com.example.vendor": "ACME Incorporated",
  "com.example.label-with-value": "foo",
  "version": "1.0",
  "description": "This text illustrates that label-values can span multiple lines."
}
```

### WORKDIR

格式为 `WORKDIR /path/to/workdir`。

为后续的 `RUN`、`CMD`、`ENTRYPOINT` 指令配置工作目录。

可以使用多个 `WORKDIR` 指令，后续命令如果参数是相对路径，则会基于之前命令指定的路径。例如

```yaml
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```

则最终路径为 `/a/b/c`

### ENV

格式为 `ENV <key> <value>`。 指定一个环境变量，会被后续 `RUN` 指令使用，并在容器运行时保持。

```bash
ENV PG_MAJOR 9.3
ENV PG_VERSION 9.3.4
RUN curl -SL http://example.com/postgres-$PG_VERSION.tar.xz | tar -xJC /usr/src/postgress && …
ENV PATH /usr/local/postgres-$PG_MAJOR/bin:$PATH
```

### ADD

* 语法

```
ADD [--chown=<user>:<group>] <src>... <dest>
ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]
```

该命令将复制指定的 `<src>` 到容器中的 `<dest>`。 其中 `<src>` 可以是Dockerfile所在目录的一个相对路径；也可以是一个 URL；还可以是一个 tar 文件（自动解压为目录）

### COPY

* 语法

```
COPY [--chown=<user>:<group>] <src>... <dest>
COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]
```

复制本地主机的 `<src>`（为 Dockerfile 所在目录的相对路径）到容器中的 `<dest>`。

当使用本地目录为源目录时，推荐使用 `COPY`

### RUN

* 在 `RUN`指令执行过程中，产生的中间镜像会被当做缓存在下一次构建时使用，如果不想使用缓存，使其失效，可以在 `build`时添加 `--no-cache`
* 尽量把所有的 `RUN`指令写到一起，如果是多条 `shell`命令，可以不用每条命令都添加 `RUN`，更好的做法是通过 `\`换行，通过 `&&`连接多个指令，这样对构建生成的镜像的大小优化是很有帮助的，语法为

```
RUN set -x && \
    yum install -y epel-release \
    make \
    gcc \
    gcc-c++
```

### EXPOSE

EXPOSE `指令声明了容器在运行时监听指定的网络端口，可以指定端口是监听`TCP `还是`UDP `，默认为`TCP

`EXPOSE`指令实际上并不发布端口，即端口限制，它的作用仅仅是作为构建映像的人和运行容器的人之间的一种文档，关于要发布哪些端口。当运行容器时，要实际发布端口，使用 `docker`运行中的-`p`参数来发布和映射一个或多个端口，或者直接使用 `-P`来自动随机映射 `EXPOSE`声明的端口

```
EXPOSE <port> [<port>/<protocol>...]
```

### CMD

支持三种格式

* `CMD ["executable","param1","param2"]` 使用 `exec` 执行，推荐方式；
* `CMD command param1 param2` 在 `/bin/sh` 中执行，提供给需要交互的应用；
* `CMD ["param1","param2"]` 提供给 `ENTRYPOINT` 的默认参数；

指定启动容器时执行的命令，每个 Dockerfile 只能有一条 `CMD` 命令。如果指定了多条命令，只有最后一条会被执行。

如果用户启动容器时候指定了运行的命令，则会覆盖掉 `CMD` 指定的命令

### ENTRYPOINT

两种格式：

* `ENTRYPOINT ["executable", "param1", "param2"]` # exec格式,推荐使用
* `ENTRYPOINT command param1 param2`（shell中执行）。

配置容器启动后执行的命令，并且不可被 `docker run` 提供的参数覆盖。

每个 Dockerfile 中只能有一个 `ENTRYPOINT`，当指定多个时，只有最后一个起效

这两种不同的格式有一个很大的区别在于：`exec`格式可以接受参数，而 `shell`格式是会忽略参数的。`shell`格式相当于在前面还要再添加 `/bin/sh -c`，所以app启动的进程ID不是1。

### 覆盖 `Entrypoint`与 `Cmd`

如果要覆盖默认的 `Entrypoint`与 `Cmd`，需要遵循如下规则：

* 如果在容器配置中没有设置 `command` 或者 `args`，那么将使用 `Docker`镜像自带的命令及其参数
* 如果在容器配置中只设置了 `command` 但是没有设置 `args`，那么容器启动时只会执行该命令， `Docker`镜像中自带的命令及其参数会被忽略
* 如果在容器配置中只设置了 `args`，那么 `Docker`镜像中自带的命令会使用该新参数作为其执行时的参数
* 如果在容器配置中同时设置了 `command` 与 `args`，那么 `Docker`镜像中自带的命令及其参数会被忽略。 容器启动时只会执行配置中设置的命令，并使用配置中设置的参数作为命令的参数

| 镜像 Entrypoint | 镜像 Cmd      | 容器 command | 容器 args     | 命令执行           |
| --------------- | ------------- | ------------ | ------------- | ------------------ |
| `[/ep-1]`     | `[foo bar]` |              |               | `[ep-1 foo bar]` |
| `[/ep-1]`     | `[foo bar]` | `[/ep-2]`  |               | `[ep-2]`         |
| `[/ep-1]`     | `[foo bar]` |              | `[zoo boo]` | `[ep-1 zoo boo]` |
| `[/ep-1]`     | `[foo bar]` | `[/ep-2]`  | `[zoo boo]` | `[ep-2 zoo boo]` |

## 2.3 镜像启动

编写完成 Dockerfile 之后，可以通过 `docker build` 命令来创建镜像。

基本的格式为 `docker build [选项] 路径`，该命令将读取指定路径下（包括子目录）的 Dockerfile，并将该路径下所有内容发送给 Docker 服务端，由服务端来创建镜像。因此一般建议放置 Dockerfile 的目录为空目录。也可以通过 `.dockerignore` 文件（每一行添加一条匹配模式）来让 Docker 忽略路径下的目录和文件。

```
docker build -t images:v1 .
```

❌ 注意

exec 格式的 ENTRYPOINT 或 CMD 就是它们实际在 docker 镜像中的样子，可用 docker inspect image 查看

`exec 格式是一种数组形式`，该格式的 ENTRYPOINT 能接收 CMD 或 dock run image 后的参数作为附加参数，相当于是往这个数组中附加元素。

ENTRYPOINT ["echo", "Hello"]

docker run test World and China

输出

Hello World and China

shell 格式可用变量而 exec 格式不一定行

```
ENTRYPOINT java $JAVA_OPTS -jar /app.jar

docker run -e JAVA_OPTS="-Xms2G" test
```

exec 格式的写法

```
ENTRYPOINT ["java", "$JAVA_OPTS", "-jar", "/app.jar"]

docker run -e JAVA_OPTS="-Xms2G" test
Error: Could not find or load main class $JAVA_OPTS
```

```shell
FROM debian:11
ENV TIME_ZOME Asia/Shanghai
ENV LANG en_US.utf8
ENV DOTNET_ROOT /usr/local/dotnet
ENV PATH $PATH:$DOTNET_ROOT

ADD dotnet-sdk-8.0.100-linux-x64.tar.gz /usr/local/dotnet
ADD node-v16.20.2-linux-x64.tar.gz /usr/local

COPY ["sources.list", "/etc/apt"]

RUN echo "${TIME_ZOME}" > /etc/timezone && \
    ln -sf /usr/share/zoneinfo/${TIME_ZOME} /etc/localtime && \
    ln -sf /usr/local/node-v16.20.2-linux-x64/bin/node /usr/local/bin && \
    ln -sf /usr/local/node-v16.20.2-linux-x64/bin/npm /usr/local/bin && \
    apt update && \ 
    apt -y install net-tools libicu-dev && \
    apt clean
```

# 3. 自特点缺点

exec 格式要求一个坑一个参数，所以像上面见到的那样无法在中间动态插入参数，比如不能在中间某一个位置上写上 "-Xmx5G -Xms2G", 这分明是两个参数，只能在后面附加参数

shell 格式由于命令总是由 "/bin/sh -e" 启动的子进程，它不是 PID 1 超级进程，从而无法收到 Unix 的信号，自然不能收到从 `docker stop <container>` 发来的 `SIGTERM` 信号。

简述一下 `docker stop <container>`
 工作原理，它向容器中的 PID 为 1 进程发送 SIGTERM 信号，并给予 10 秒钟(可用参数 --time) 清理，超时才 -9
强杀，这样可以比较优雅的关闭容器。"/bin/sh -e" 是一个 PID 1 进程，它收到了 SIGTERM
却不会转发给它的子命令，这样就造成了 "/bin/sh -e" 收到 SIGTERM 未作响应被强杀，同时把它的子进程毫无征兆的干掉了。像在
Java 中用 `Runtime.addShutdownHook() `是捕获不到该信号的。

# 4. 增强型shell格式

这里补充一种 ENTRYPOINT 的声明格式，它实质是 shell 格式，为而把它单独列出来关键就在于 shell 的 `exec` 命令。此 `exec` 非前面 exec 格式中的 exec, 而是一个结结实实的 shell 命令。

> ENTRYPOINT exec command param1 param2 ...

比如：

> ENTRYPOINT exec java $JAVA_OPTS -jar /app.jar

它仍然是 shell 格式，所以 inspect 镜像后看到的 ENTRYPOINT 是

> ENTRYPOINT ["/bin/sh", "-c" "exec java $JAVA_OPTS -jar /app.jar"]

然而加了 `exec` 的绝妙之处在于：

shell
 的内建命令 exec 将并不启动新的shell，而是用要被执行命令替换当前的 shell 进程，并且将老进程的环境清理掉，exec
后的命令不再是 shell 的子进程序，而且 exec 命令后的其它命令将不再执行。从执行效果上可以看到 exec 会把当前的 shell
关闭掉，直接启动它后面的命令。

虽然它与之后的命令(如上 `exec java $JAVA_OPTS -jar /app.jar`）还是作为 "/bin/sh" 的第二个参数，但 `exec` 来了个金蝉脱壳，让这里的 `java` 进程得已作为一个 PID 1 的超级进程，进行使得这个 java 进程可以收到 SIGTERM 信号。或者理解 `exec` 为 "/bin/sh" 的子进程，但是借助于 `exec` 让它后面的进程启动在最顶端。

另外，由于通过 "/bin/sh" 的搭桥，命令中的变量(如 $JAVA_OPTS) 也会被正确解析，因此 `ENTRYPOINT exec command param1 param2 ...` 是被推荐的格式。

注意：exec 只会启动后面的第一个命令，`exec ls; top` 或 `exec ls && top` 只会执行 `ls` 命令

# 镜像构建篇

## 1.1 构建上下文

构建上下文 `build context`，“上下文” 意为和现在这个工作相关的周围环境。在 `docker`镜像的构建过程中有构建上下文 `build context`这一概念，通俗的来说就是指执行 `docker build`时当前的工作目录，不管构建时有没有用到当前目录下的某些文件及目录，默认情况下这个上下文中的文件及目录都会作为构建上下文内容发送给 `Docker Daemon`

当 `docker build`开始执行时，控制台会输出 `Sending build context to Docker daemon xxxMB`，这就表示将当前工作目录下的文件及目录都作为了构建上下文

前面提到可以在 `RUN`指令中添加 `--no-cache`不使用缓存，同样也可以在执行 `docker build`命令时添加该指令以在镜像构建时不使用缓存

## 1.2 忽略构建

和 `git`忽略文件 `.gitignore`一样的道理，在 `docker`构建镜像时也有 `.dockerignore`，可以用来排除当前工作目录下不需要加入到构建上下文 `build context`中的文件

例如，在构建 `npm`前端的镜像时项目时，在 `Dockerfile` 的同一个文件夹中创建一个 `.dockerignore` 文件，带有以下内容，这样在构建时就可以避免将本地模块以及调试日志被拷贝进入到 `Docker`镜像中

```
node_modules
npm-debug.log
```

## 1.3 多阶段构建

多阶段构建的应用场景及优势就是为了降低复杂性并减少依赖，避免镜像包含不必要的软件包

例如，应用程序的镜像中一般不需要安装开发调试软件包。如果需要从源码编译构建应用，最好的方式就是使用多阶段构建

简单来说，多阶段构建就是允许一个 `Dockerfile`中出现多条 `FROM`指令，只有最后一条 `FROM`指令中指定的基础镜像作为本次构建镜像的基础镜像，其它的阶段都可以认为是只为中间步骤

每一条 `FROM`指令都表示着多阶段构建过程中的一个构建阶段，后面的构建阶段可以拷贝利用前面构建阶段的产物

这里我列举一个编译构建 `npm`项目，利用多阶段构建最终把静态资源制作成 `nginx`镜像的 `Dockerfile`

```yaml
#### Stage 1: npm build
FROM node:12.4.0-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy the main application
COPY . ./

# Arguments

# Build the application
RUN npm run build

#### Stage 2: Serve the application from Nginx 
FROM nginx:latest

COPY --from=build /app/build /var/www

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 to the Docker host, so we can access it 
# from the outside.
EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
```

# Docker 镜像的大小减少

## 1.1基本dockerfile

276MB

```bash
FROM golang:1.23.1-alpine
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN go build -o main .
CMD ["./main"]
```

## 1.2 多阶段镜像

通过使用多阶段映像，我们可以分离编译和执行阶段，这有助于从最终映像中排除不必要的文件（如 Go 构建工具）

```bash
FROM golang:1.23.1-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download && go mod verify
COPY . .
RUN go build -o main .
FROM golang:1.23.1-alpine
COPY --from=builder /app /
CMD ["./main"]
```

### 优化

我们优化构建阶段以生成更轻量的二进制文件

CGO_ENABLED=0：禁用对 C 库的依赖，允许我们创建静态二进制文件。

GOARCH=amd64 和 GOOS=linux：指定我们正在为 Linux amd64 架构构建。

scratch：使用临时映像，即一个不包含任何内容（没有操作系统，没有库）的空镜像，这可以通过静态二进制文件实现。

```bash
FROM golang:1.23.1-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download && go mod verify
COPY . .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -o main -a --trimpath --ldflags="-s -w" --installsuffix cgo
FROM scratch
COPY --from=builder /app /
CMD ["./main"]
```

## 1.3 用UPX进行二进制压缩

对二进制进行压缩

```bash
FROM golang:1.23.1-alpine AS builder
RUN apk add --no-cache upx
WORKDIR /app
COPY go.* ./
RUN go mod download && go mod verify
COPY . .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -o main -a --trimpath --ldflags="-s -w" --installsuffix cgo
RUN upx --ultra-brute -qq main && upx --t main
FROM scratch
COPY --from=builder /app /
CMD ["./main"]
```

[https://cloud.tencent.com/developer/article/2242361](https://cloud.tencent.com/developer/article/2242361)

[https://cloud.tencent.com/developer/article/2242354](https://cloud.tencent.com/developer/article/2242354)

# .dockerignore

## 1.1 介绍

该 `.dockerignore`文件是隐藏文件也是一个工具，可以帮助你定义你真正需要的Docker  **构建上下文** 。使用此文件，你可以为这些文件和文件夹规则指定**忽略规则**和 **异常** ，这些**规则**和**异常**将不包含在 **构建上下文中** ，因此不会打包到存档中并上载到Docker服务器

## 1.2 语法

```bash
pattern:
{term}
术语：
'*'         匹配任何非分隔符字符序列
'？'        匹配任何单个非分隔符
'['['^'] {character-range}']'
字符类（必须是非空的）
c匹配字符c    （c！='*'，'？'，'\\'，'['）
'\\'    c匹配字符c

字符范围：
c匹配字符c    （c！='\\'，' - '，']'）
'\\'    c匹配字符c
lo' - 'hi匹配字符c for lo＆lt; = c＆lt; = hi

补充：
'**'    匹配任意数量的目录（包括零）
'！'     行开头！ （感叹号）可用于排除例外情况
以此字符开头的'＃'行将被忽略：将其用于评论
```
