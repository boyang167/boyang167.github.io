---
title: Java
description: 1. Dockerfile文件
date: '2025-05-24'
area: SRE
tags: []
language: zh-CN
series: docker
order: 9
draft: false
---
# Java

## 1. Dockerfile文件

**dockerfile**

```
FROM alpine:3.17
CMD ["/bin/sh"]
MAINTAINER GLJ
ENV TIME_ZONE="Asia/Shanghai"
ENV ALPINE_GLIBC_PACKAGE_VERSION="2.34-r0"

# Install glibc
COPY locale.md glibc-$ALPINE_GLIBC_PACKAGE_VERSION.apk glibc-bin-$ALPINE_GLIBC_PACKAGE_VERSION.apk glibc-i18n-$ALPINE_GLIBC_PACKAGE_VERSION.apk ./
COPY sgerrand.rsa.pub /etc/apk/keys/sgerrand.rsa.pub
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories \
    && apk add --no-cache ca-certificates libstdc++ fontconfig tzdata \
    && apk add --update ttf-dejavu \
    && fc-cache --force \
    && cp /usr/share/zoneinfo/$TIME_ZONE /etc/localtime \
    && echo $TIME_ZONE > /etc/timezone \
    && apk del tzdata \
    && mv /etc/nsswitch.conf /etc/nsswitch.conf.bak \
    && apk add --no-cache --force-overwrite glibc-$ALPINE_GLIBC_PACKAGE_VERSION.apk glibc-bin-$ALPINE_GLIBC_PACKAGE_VERSION.apk glibc-i18n-$ALPINE_GLIBC_PACKAGE_VERSION.apk \
    && mv /etc/nsswitch.conf.bak /etc/nsswitch.conf \
    && cat locale.md | tr -d '\r' | xargs -i /usr/glibc-compat/bin/localedef -i {} -f UTF-8 {}.UTF-8 \
    && rm -f glibc-$ALPINE_GLIBC_PACKAGE_VERSION.apk glibc-bin-$ALPINE_GLIBC_PACKAGE_VERSION.apk glibc-i18n-$ALPINE_GLIBC_PACKAGE_VERSION.apk locale.md \
    && rm -rf /var/cache/apk/* \
    && addgroup -g 2888 apps \
    && adduser -u 2888 -G apps -h /home/apps -D apps

# Support Chinese
ENV LANG=zh_CN.UTF-8
ENV LANGUAGE=zh_CN.UTF-8

# Install JDK1.8
ADD jdk-8u341-linux-x64.tar.gz /usr/local/jdk
ENV JAVA_HOME=/usr/local/jdk/jdk1.8.0_341
ENV JRE_HOME=$JAVA_HOME/jre
ENV CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
ENV PATH=$JAVA_HOME/bin:$PATH
```

* 构建镜像

```bash
docker build -t base-jdk8:v1
```

2. 第二种方式

**dockerfile**

```
# 基于alpine-glibc:alpine-3.17_glibc-2.34构建
FROM frolvlad/alpine-glibc:alpine-3.17_glibc-2.34
MAINTAINER GLJ

# Install JDK1.8
ADD jdk-8u341-linux-x64.tar.gz /usr/local/jdk
ENV JAVA_HOME=/usr/local/jdk/jdk1.8.0_341
ENV JRE_HOME ${JAVA_HOME}/jre
ENV CLASSPATH .:${JAVA_HOME}/lib:${JRE_HOME}/lib
ENV PATH=$JAVA_HOME/bin:$PATH
ENV TIME_ZONE="Asia/Shanghai"

# 安装 JRE
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories \
    && apk add --no-cache libstdc++ fontconfig tzdata \
    && apk add --update ttf-dejavu \
    && fc-cache --force \
    && cp /usr/share/zoneinfo/$TIME_ZONE /etc/localtime \
    && echo $TIME_ZONE > /etc/timezone \
    && apk del tzdata \
    && rm -rf /var/cache/apk/* \
    && addgroup -g 2888 apps \
    && adduser -u 2888 -G apps -h /home/apps -D apps
```

## 3. 镜像漏扫验证

使用第三方，一定的进行镜像扫描

## 4. java案例

**dockerfile**

```
FROM base-jdk8:v1
USER gzapps
COPY --chown=apps:apps app.jar /home/apps/app.jar

# env for application
ENV PORT=""
ENV JAVA_OPTS=""
ENV AGENT_ARGS=""

EXPOSE $PORT
WORKDIR /home/gzapps

ENTRYPOINT ["/bin/bash","-c","java ${AGENT_ARGS} ${JAVA_OPTS} -jar app.jar"]
#ENTRYPOINT exec java -Djava.security.egd=file:/dev/./urandom -jar -Xms512m -Xmx512m -Xmn200M app.jar > app.jar.log
```

---

## 5. 使用jlink构建自定义 JRE 镜像

以用来打包Java应用的基础镜像有几种，包括：

* JDK Alpine基础镜像：这些镜像体积较小，但不适合所有应用，因此可能会面临一些库的兼容性问题。
* JDK Slim基础镜像：这些镜像基于Debian或Ubuntu，相较于完整的JDK镜像来说体积较小，但仍然比较大。
* JDK完整基础镜像：这些镜像体积较大，包含运行应用所需的所有模块和依赖项。

❌ 注意

不能使用JRE镜像而使用JDK镜像,从Java 11开始，JRE不再可用

为了对比大小，我们采用openjdk:17-jdk-slim，eclipse-temurin:17-jdk-alpine

```yaml
FROM openjdk:17-jdk-slim

# 设置容器中的工作目录
WORKDIR /app

# 创建用户
RUN addgroup --system spring && adduser --system spring --ingroup spring

# 切换到用户
USER spring:spring

COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

```yaml
FROM eclipse-temurin:17-jdk-alpine

ARG APPLICATION_USER=spring
# 创建一个用户来运行应用，不以root用户运行
RUN addgroup --system $APPLICATION_USER && adduser --system $APPLICATION_USER --ingroup $APPLICATION_USER

# 创建应用目录
RUN mkdir /app && chown -R $APPLICATION_USER /app

# 设置运行应用的用户
USER $APPLICATION_USER

# 将jar文件复制到容器中
COPY --chown=$APPLICATION_USER:$APPLICATION_USER target/*.jar /app/app.jar

# 设置工作目录
WORKDIR /app

# 暴露端口
EXPOSE 8080

# 运行应用
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

* 完整案例

```yaml
# 第一阶段，构建自定义 JRE
FROM eclipse-temurin:17-jdk-alpine AS jre-builder

RUN mkdir /opt/app
COPY . /opt/app

WORKDIR /opt/app

ENV MAVEN_VERSION 3.5.4
ENV MAVEN_HOME /usr/lib/mvn
ENV PATH $MAVEN_HOME/bin:$PATH

RUN apk update && \
apk add --no-cache tar binutils

RUN wget http://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz && \
tar -zxvf apache-maven-$MAVEN_VERSION-bin.tar.gz && \
rm apache-maven-$MAVEN_VERSION-bin.tar.gz && \
mv apache-maven-$MAVEN_VERSION /usr/lib/mvn

RUN mvn package -DskipTests
RUN jar xvf target/spring-error-handling-rfc-9457-0.0.1-SNAPSHOT.jar
RUN jdeps --ignore-missing-deps -q  \
--recursive  \
--multi-release 17  \
--print-module-deps  \
--class-path 'BOOT-INF/lib/*'  \
target/spring-error-handling-rfc-9457-0.0.1-SNAPSHOT.jar > modules.txt

# 构建小型 JRE 镜像，--add-modules ALL-MODULE-PATH
RUN $JAVA_HOME/bin/jlink \
--verbose \
--add-modules $(cat modules.txt) \
--strip-debug \
--no-man-pages \
--no-header-files \
--compress=2 \
--output /optimized-jdk-17

# 第二阶段，使用自定义 JRE 并构建应用镜像
FROM alpine:latest
ENV JAVA_HOME=/opt/jdk/jdk-17
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# 从基础镜像复制 JRE
COPY --from=jre-builder /optimized-jdk-17 $JAVA_HOME

# 添加应用用户
ARG APPLICATION_USER=spring

# 创建用户以运行应用程序，不以 root 身份运行
RUN addgroup --system $APPLICATION_USER &&  adduser --system $APPLICATION_USER --ingroup $APPLICATION_USER

# 创建应用程序目录
RUN mkdir /app && chown -R $APPLICATION_USER /app

COPY --chown=$APPLICATION_USER:$APPLICATION_USER target/*.jar /app/app.jar

WORKDIR /app

USER $APPLICATION_USER

EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/app/app.jar" ]
```

## 6. Cgroups v1 和Cgroups v2

当你在物理机或者虚拟机上配置
 JVM 参数时，JVM会默认使用主机上1/4的内存作为堆内存，你也可以选择使用-Xmx/-Xms 来指定 Java
堆内存大小。在容器化环境中，每个容器实例的内存大小由Cgroups配置决定，而低版本JVM对Cgroups的支持是不太友好的。

### 6.1 v1

JDK 1.8.0_131(包含)之前的版本，不指定参数情况下，无法识别Cgroups内存限制，使用主机1/4的内存作为最大堆内存

```bash
docker run -m 512Mi openjdk:8u121 java  -XshowSettings:vm -version VM
VM settings:  
Max. Heap Size (Estimated): 1.56G  
Ergonomics Machine Class: server  
Using VM: OpenJDK 64-Bit Server VM
openjdk version "1.8.0_121"
OpenJDK Runtime Environment (build 1.8.0_121-8u121-b13-1~bpo8+1-b13)
OpenJDK 64-Bit Server VM (build 25.121-b13, mixed mode)


#指定xms
docker run -m 512Mi openjdk:8u121 java -Xms512m -Xmx512m -XshowSettings:vm -version VM
```

在jdk 1.8.0_131版本开始，加入了两个新参数 `-XX:+UnlockExperimentalVMOptions`和 `-XX:+UseCGroupMemoryLimitForHeap`来动态感知容器的Cgroups内存限制，最大堆内存为Cgroups内存限制的1/4

```bash
docker run -m 512Mi openjdk:8u131 java -XX:+UnlockExperimentalVMOptions  -XX:+UseCGroupMemoryLimitForHeap -XshowSettings:vm -version VM
```

新参数 `-XX:+UnlockExperimentalVMOptions`和 `-XX:+UseCGroupMemoryLimitForHeap`虽然能动态感知Cgroups内存限制，但是却只能使用1/4，无法修改。此时可以使用另外两个参数 `-XX:MaxRAMFraction`和 `-XX:MinRAMFraction`， **参数值必须为整数** ，取值参考如下表格：

| MaxRAMFraction/MinRAMFraction值 | Cgroups内存限制百分比 |
| ------------------------------- | --------------------- |
| 1                               | 90%                   |
| 2                               | 50%                   |
| 3                               | 33%                   |
| 4                               | 25%                   |

```bash
docker run -m 512Mi openjdk:8u131 java -XX:+UnlockExperimentalVMOptions  -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=2 -XshowSettings:vm -version VM
```

使用jdk 1.8.0_191版本镜像启动容器，不指定参数，jvm能动态感知Cgroups内存限制，最大堆内存为Cgroups内存限制的1/4

```bash
docker run -m 512Mi openjdk:8u191-alpine java  -XshowSettings:vm -version VM
```

指定参数，使用 `-Xms`和 `-Xmx`指定初始堆内存和最大堆内存

```bash
docker run -m 512Mi openjdk:8u191-alpine java -Xms512m -Xmx512m -XshowSettings:vm -version VM
```

jdk 1.8.0_191版本开始，`-XX:MaxRAMFraction`和 `-XX:MinRAMFraction`被弃用，使用 `MaxRAMPercentage`和 `MinRAMPercentage`来修改堆内存在Cgroups内存限制的占比，**参数值是Double类型必须带小数点**

```
docker run -m 512Mi openjdk:8u191-alpine java -XX:MaxRAMPercentage=50.0 -XX:MinRAMPercentage=50.0 -XshowSettings:vm -version VM
```

* `Xms`和 `Xmx`能适应所有JDK版本，但不能动态感知容器的Cgroups限制，且参数优先级最高，与其他参数一起配置时，其他参数不生效。
* `-XX:+UnlockExperimentalVMOptions`和 `-XX:+UseCGroupMemoryLimitForHeap`在1.8.0_131版本开始启用，能动态感知容器的Cgroups限制，但最大堆内存只能使用容器Cgroups内存限制的1/4。
* `-XX:MaxRAMFraction`和 `-XX:MinRAMFraction`在1.8.0_131版本开始启用，可以修改堆内存占容器Cgroups内存限制的百分比，但百分比的值不能自由指定(比如不能指定40%)，在1.8.0_191版本开始弃用。
* `MaxRAMPercentage`和 `MinRAMPercentage`在1.8.0_191版本开始启用，可以自定义修改堆内存占容器Cgroups内存限制的百分比。

### 6.2 v2

jdk需要1.8.0_372、11.0.16及更高版本才能动态感知Cgroups的内存限制

总结：

1.使用容器感知的 JDK 版本。对于使用 Cgroup V1 的集群，需要升级至 1.8.0_191以及更高版本；对于使用 Cgroup V2 的集群，需要升级至 1.8.0_372、11.0.16及更高版本。

2.由于Java应用使用的总内存不仅仅只有堆内存，还有堆外内存和直接内存。所以设置容器内存上限时必须大于堆内存，应该按照
 Java 进程使用的内存量上浮 20%～30% 设置容器内存 limit。如果初次运行程序，并不了解其实际内存使用量，可以先设置一个较大的
limit 让程序运行一段时间，根据监控获取实际平均使用值对容器内存 limit 进行调整。

3.如果在容器内仅运行一个Java 应用程序，则将初始堆大小与最大堆大小最好配置相等。如果不相等，JVM会根据堆内存使用量在Xms与Xmx之间动态修改堆内存大小，导致额外的系统开销和频繁的垃圾回收。

4.使用 `-XX:+HeapDumpOnOutOfMemoryError`和 `-XX:HeapDumpPath`参数，在JVM发生OOM时，自动生成dump文件。dump文件路径最好是持久化挂载路径避免容器重启dump文件丢失。

# go

## 1.1基本dockerfile

276MB

**bash**

```
FROMgolang:1.23.1-alpine
WORKDIR/app
COPYgo.*./
RUNgomoddownload
COPY..
RUNgobuild-omain.
CMD ["./main"]
```

## 1.2 多阶段镜像

通过使用多阶段映像，我们可以分离编译和执行阶段，这有助于从最终映像中排除不必要的文件（如 Go 构建工具）

**bash**

```
FROMgolang:1.23.1-alpineASbuilder
WORKDIR/app
COPYgo.*./
RUNgomoddownload && gomodverify
COPY..
RUNgobuild-omain.
FROMgolang:1.23.1-alpine
COPY--from=builder/app/
CMD ["./main"]
```

### 优化

我们优化构建阶段以生成更轻量的二进制文件

CGO_ENABLED=0：禁用对 C 库的依赖，允许我们创建静态二进制文件。

GOARCH=amd64 和 GOOS=linux：指定我们正在为 Linux amd64 架构构建。

scratch：使用临时映像，即一个不包含任何内容（没有操作系统，没有库）的空镜像，这可以通过静态二进制文件实现。

**bash**

```
FROMgolang:1.23.1-alpineASbuilder
WORKDIR/app
COPYgo.*./
RUNgomoddownload && gomodverify
COPY..
RUNCGO_ENABLED=0GOARCH=amd64GOOS=linuxgobuild-omain-a--trimpath--ldflags="-s -w"--installsuffixcgo
FROMscratch
COPY--from=builder/app/
CMD ["./main"]
```

## 1.3 用UPX进行二进制压缩

对二进制进行压缩

**bash**

```
FROMgolang:1.23.1-alpineASbuilder
RUNapkadd--no-cacheupx
WORKDIR/app
COPYgo.*./
RUNgomoddownload && gomodverify
COPY..
RUNCGO_ENABLED=0GOARCH=amd64GOOS=linuxgobuild-omain-a--trimpath--ldflags="-s -w"--installsuffixcgo
RUNupx--ultra-brute-qqmain && upx--tmain
FROMscratch
COPY--from=builder/app/
CMD ["./main"]
```

[https://cloud.tencent.com/developer/article/2242361](https://cloud.tencent.com/developer/article/2242361)

[https://cloud.tencent.com/developer/article/2242354](https://cloud.tencent.com/developer/article/2242354)
