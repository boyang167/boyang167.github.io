---
title: Flink
description: 'https://flink.apachse.org/downloads/'
date: '2025-04-13'
area: Big Data
tags: []
language: zh-CN
order: 2
draft: false
---
# Flink

https://flink.apachse.org/downloads/

https://archive.apache.org/dist/flink/flink-1.16.1/

https://mvnrepository.com/artifact/com.ververica/flink-sql-connector-mysql-cdc/2.3.0

https://github.com/shaofanzhang/flink-cdc-demo

![1742023861507](/knowledge-assets/big-data/image/2-flink/1742023861507.png)

**Client**:  提交job 的客服端

**JobManager**：  负责调度job, 并协调Task 做checkpoint ,

**TaskManager**: 在启动时候就设置好slot , 槽位数， 每个slot 启动1个task, task 为线程

Flink 的任务调度是多线程模型，

## 部署模式

### standalone :

feature:

1. 需求提前运行flink 集群， 部署简单，用于开发和测试
2. 集群在创建时，资源重量已经确定下来，后续提交作业。竞争集群资源
3. 作业资源隔离性差，作业相互影响，异常作业会拖垮整个flink 集群

### yarn

![1742028852058](/knowledge-assets/big-data/image/2-flink/1742028852058.png)

## Flink  on kubernets

![1742029710472](/knowledge-assets/big-data/image/2-flink/1742029710472.png)

在K8S 中有2种方式：

- standalone
- native

计算任务：

- Session : 先启动1个flink 集群，然后向该集群提交任务，所有的任务公用job manager, 任务提交速度快，适合频繁提交运行短的时间任务
- Per-job： 每提交1个任务，单独启动1个集群运行该任务，运行结束集群被删除，资源也被释放，适合长时间运行的大型任务

![1742026470872](/knowledge-assets/big-data/image/2-flink/1742026470872.png)

K8s 基本的架构，这是一个非常典型的 Master-Slave 的架构。

1. 在 Master 上，是由 Controller，API Server，Scheduler 以及包括做存储的 Etcd
   等构成。Etcd 可以算成 Master，也可以作为独立于 Master 之外的存储来对待。Master 的 Controller、API
   Server、Scheduler 都是单独的进程模式。这和 Yarn 有一些不同，Yarn 的整个 Master 是一个单进程的模式。K8s 的
   Master 还可以在多个 Master 之间完成自发的选举，然后由 active 状态的 Master 对外提供服务。
2. 在 Slave 上，它主要是包括 Kube proxy、Kubelet，以及 Docker 等相关的组件，每个 Node 上部署的相关组件都是类似的，通过它来管理上面运行的多个 Pod。
3. 根据不同用户的习惯，可以通过 UI 或者 CLI 的方式向 K8s 提交任务。用户可以通过 K8s 提供的 Dashboard Web UI 的方式将任务进行提交，也可以通过 Kubectl 命令行的方式进行提交。

![1742025106669](/knowledge-assets/big-data/image/2-flink/1742025106669.png)

![1742026561315](/knowledge-assets/big-data/image/2-flink/1742026561315.png)

Stream Graph -> Job Graph-> Execution Graph -> 物理执行图

![1742025158314](/knowledge-assets/big-data/image/2-flink/1742025158314.png)

* 第一层 StreamGraph 从 Source 节点开始，每一次 transform
  生成一个 StreamNode，两个 StreamNode 通过 StreamEdge 连接在一起,形成 StreamNode 和
  StreamEdge 构成的DAG。
* 第二层 JobGraph，依旧从 Source
  节点开始，然后去遍历寻找能够嵌到一起的 operator，如果能够嵌到一起则嵌到一起，不能嵌到一起的单独生成 jobVertex，通过
  JobEdge 链接上下游 JobVertex，最终形成 JobVertex 层面的 DAG。
* JobVertex
  DAG 提交到任务以后，从 Source 节点开始排序,根据 JobVertex 生成ExecutionJobVertex，根据
  jobVertex的IntermediateDataSet 构建 IntermediateResult，然后
  IntermediateResult 构建上下游的依赖关系，形成 ExecutionJobVertex 层面的 DAG 即
  ExecutionGraph。
* 最后通过 ExecutionGraph 层到物理执行层。

1. Session 模式：

![1742025450865](/knowledge-assets/big-data/image/2-flink/1742025450865.png)

多个 Job 提交共享同一个 JobManager
在 Flink Client 上生成 JobGraph

由Client提交，client做一些预备工作。

但是Cluster的实例已经被创建，是所有Job共享的。

一个Job导致的JobManager失败可能会导致所有的Job失败。

2. Pre-job:

![1742025815472](/knowledge-assets/big-data/image/2-flink/1742025815472.png)

为每次 Job 提交启动专用 JM，JM 将只执行此作业，然后退出。
在 Flink Client 上生成 JobGraph

可以理解为 Client 模式的Application Mode，

利用资源管理框架，例如Yarn，Mesos等，资源隔离性更强。

一个Job一个Cluster实例。

3. **.[Application 模式](https://zhida.zhihu.com/search?content_id=165880385&content_type=Article&match_order=1&q=Application+%E6%A8%A1%E5%BC%8F&zhida_source=entity)**

![1742025882072](/knowledge-assets/big-data/image/2-flink/1742025882072.png)

Flink提交的程序，被当做集群内部Application，不再需要Client端做繁重的准备工作

（例如执行main函数，生成JobGraph，下载依赖并分发到各个节点等）。

main函数被提交给JobManager执行。

一个Application一个Cluster实例。

![1742025979520](/knowledge-assets/big-data/image/2-flink/1742025979520.png)

- Standalone :

![1742027167992](/knowledge-assets/big-data/image/2-flink/1742027167992.png)

如图所示：

* 步骤1， 使用 Kubectl 或者 K8s 的 Dashboard 提交请求到 K8s Master。
* 步骤2， K8s Master 将创建 Flink Master Deployment、TaskManager
  Deployment、ConfigMap、SVC 的请求分发给 Slave 去创建这四个角色，创建完成后，这时 Flink
  Master、TaskManager 启动了。
* 步骤3， TaskManager 注册到 JobManager。在非 HA 的情况下，是通过内部 Service 注册到 JobManager。
* 至此，Flink 的 Sesion Cluster 已经创建起来。此时就可以提交任务了。
* 步骤4，在 Flink Cluster 上提交 Flink run 的命令，通过指定 Flink Master
  的地址，将相应任务提交上来，用户的 Jar 和 JobGrapth 会在 Flink Client 生成，通过 SVC 传给
  Dispatcher。
* 步骤5，Dispatcher 会发现有一个新的 Job 提交上来，这时会起一个新的 JobMaster，去运行这个 Job。
* 步骤6，JobMaster 会向 ResourceManager 申请资源，因为 Standalone 方式并不具备主动申请资源的能力，所以这个时候会直接返回，而且我们已经提前把 TaskManager 起好，并且已经注册回来了。
* 步骤7-8，这时 JobMaster 会把 Task 部署到相应的 TaskManager 上，整个任务运行的过程就完成了。

- Native kubernets Session:

![1742027259386](/knowledge-assets/big-data/image/2-flink/1742027259386.png)

首先 Session 的方式。

* 第一个阶段：启动 Session Cluster。Flink Client 内置了 K8s Client，告诉 K8s Master
  创建 Flink Master Deployment，ConfigMap，SVC。创建完成后，Master 就拉起来了。这时，Session
  就部署完成了，并没有维护任何 TaskManager。
* 第二个阶段：当用户提交 Job 时，可以通过 Flink Client 或者 Dashboard 的方式，然后通过 Service 到
  Dispatcher，Dispatcher 会产生一个 JobMaster。JobMaster 会向 K8sResourceManager
  申请资源。ResourceManager 会发现现在没有任何可用的资源，它就会继续向 K8s 的 Master
  去请求资源，请求资源之后将其发送回去，起新的 Taskmanager。Taskmanager 起来之后，再注册回来，此时的
  ResourceManager 再向它去申请 slot 提供给 JobMaster，最后由 JobMaster 将相应的 Task 部署到
  TaskManager 上。这样整个从 Session 的拉起到用户提交都完成了。
* 需注意的是，图中
  SVC 是一个 External Service。必须要保证 Client 通过 Service 可以访问到 Master。在很多 K8s
  集群里，K8s 和 Flink Client 是不在同一个网络环境的，这时候可以通过 LoadBalancer 的方式或者 NodePort
  的方式，使 Flink Client 可以访问到 Jobmanager Dispatcher，否则 Jar 包是无法提交的。

# Flink on K8s

2种部署方式：

1. standalone : 需要配合 kubectl + yaml 部署，Flink 无法感知 K8s 集群的存在，资源被动
2. native :  仅使用 flink 客户端 kubernetes-session.sh or flink run 部署，Flink 主动与 K8s 申请资源

![1742637142596](/knowledge-assets/big-data/image/2-flink/1742637142596.png)

kubectl auth can-i delte  pods  `<list|create|edit|delete> `

sudo yum install java-11-openjdk

https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.tar.gz

s

docker pull docker-0.unsee.tech/apache/flink:1.19.2-scala_2.12

# Flink Connector:

## mysql

1. 检查 Binlog 是否启用
   ```sql
   SHOW VARIABLES LIKE 'log_bin';
   ```
2. 检查binlog 格式

```sql
SHOW VARIABLES LIKE 'binlog_format';
```

3. update mysql config :

```shell
[mysqld]
log_bin = mysql-bin   # 设置 Binlog 的日志文件名前缀。
binlog_format = ROW  # 设置为 ROW，这是 Flink CDC 所需的格式。
server_id = 1 # 

# restart 
sudo systemctl restart mysql

# create cdc user 

CREATE USER 'flinkcdc'@'%' IDENTIFIED BY 'FlinkCDC_123456';

GRANT SELECT, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'flinkcdc' IDENTIFIED BY 'FlinkCDC_123456';
FLUSH PRIVILEGES;


```

4. download flink-sql-connector-mysql-cdc

[SQL Connector for MySQL CDC](https://mvnrepository.com/artifact/com.ververica/flink-sql-connector-mysql-cdc/2.3.0)

# install

提前安装好**Java 11**

```bash
    java -version
```

[下载](https://flink.apache.org/zh/downloads.html) release 1.20.1 并解压。

```bash
$ tar -xzf flink-1.20.1-bin-scala_2.12.tgz
$ cd flink-1.20.1-bin-scala_2.12
```

  步骤 2：启动集群

Flink 附带了一个 bash 脚本，可以用于启动本地集群。

```bash
$ ./bin/start-cluster.sh
Starting cluster.
Starting standalonesession daemon on host.
Starting taskexecutor daemon on host.
```

修改本地的 `~/.bash_profile` 文件，插入下面的 3 行内容（注意修改版本）然后运行 `source ~/.bash_profile` 来激活修改

```bash
alias start-flink='/root/workspace/softs/flink-1.20.1/bin/start-cluster.sh'
alias stop-flink='/root/workspace/softs/flink-1.20.1/bin/stop-cluster.sh'
alias flink='/root/workspace/softs/flink-1.20.1/bin/flink'
```

```yaml
services:
  zookeeper:
    image: docker-0.unsee.tech/zookeeper:3.6.2
    ports:
      - "2181:2181"                        ## 对外暴露的 zookeeper 端口号
    container_name: zookeeper
  kafka:
    image: docker-0.unsee.tech/wurstmeister/kafka:2.13-2.6.0
    volumes:
      - /etc/localtime:/etc/localtime      ## kafka 镜像和宿主机器之间时间保持一致
    ports:
      - "9092:9092"                        ## 对外暴露的 kafka 端口号
    depends_on:
      - zookeeper
    environment:
      KAFKA_ADVERTISED_HOST_NAME: localhost
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_PORT: 9092
      KAFKA_BROKER_ID: 1
      KAFKA_LOG_RETENTION_HOURS: 120
      KAFKA_MESSAGE_MAX_BYTES: 10000000
      KAFKA_REPLICA_FETCH_MAX_BYTES: 10000000
      KAFKA_GROUP_MAX_SESSION_TIMEOUT_MS: 60000
      KAFKA_NUM_PARTITIONS: 3
      KAFKA_DELETE_RETENTION_MS: 1000
      KAFKA_CREATE_TOPICS: "stream-in:1:1,stream-out:1:1"      ## 自动创建 topics
    container_name: kafka
  mysql1:
    image: docker-0.unsee.tech/mysql:8.0.22     # 5.7 版本本地连接不上
    command: [
        '--default-authentication-plugin=mysql_native_password',
        '--character-set-server=utf8mb4',
        '--collation-server=utf8mb4_unicode_ci',
        '--log-bin=mysql-bin',
    ]
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - ./examples/mysql:/docker-entrypoint-initdb.d
    container_name: mysql1
  mysql2:
    image: docker-0.unsee.tech/mysql:8.0.22         # 5.7 版本本地连接不上
    command: [
        '--default-authentication-plugin=mysql_native_password',
        '--character-set-server=utf8mb4',
        '--collation-server=utf8mb4_unicode_ci'
    ]
    ports:
      - 3307:3306                # 第二个数据库的端口是 3307
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - ./examples/mysql:/docker-entrypoint-initdb.d
    container_name: mysql2
  adminer:
    image:  docker-0.unsee.tech/adminer
    ports:
      - 8080:8080
    container_name: adminer
  redis:
    image: docker-0.unsee.tech/redis:6.0.9
    ports:
      - 6379:6379
    command:
      # 设置 redis 密码为 redis_password
      redis-server --requirepass redis_password --appendonly yes
    container_name: redis
  #  jobmanager:
  #    image: flink:1.11.2-scala_2.12-java8
  #    ports:
  #      - "8081:8081"
  #    command: jobmanager
  #    volumes:
  #      - ./examples:/opt/examples
  #    #    network_mode: flink-network
  #    environment:
  #      FLINK_PROPERTIES: "jobmanager.rpc.address: jobmanager"
  #    container_name: jobmanager
  #  taskmanager:
  #    image: flink:1.11.2-scala_2.12-java8
  #    volumes:
  #      - ./examples:/opt/examples
  #    depends_on:
  #      - jobmanager
  #    command: taskmanager
  #    scale: 1
  #    #    network_mode: flink-network
  #    environment:
  #      FLINK_PROPERTIES: "jobmanager.rpc.address: jobmanager"
  #    container_name: taskmanager
  #  kafka-manager: ## 开源的 kafka 集群管理工具，提供 web 界面
  #    image: sheepkiller/kafka-manager
  #    environment:
  #      ZK_HOSTS: 127.0.01:2181
  #      KAFKA_MANAGER_AUTH_ENABLED: "true"
  #      KAFKA_MANAGER_USERNAME: kafka_admin
  #      KAFKA_MANAGER_PASSWORD: kafka_admin
  #    ports:
  #      - "9001:9000"
  #    container_name: kafka-manager
  #  jobmanager:
  #    image: flink
  #    expose:
  #      - "6123"
  #    ports:
  #      - "8081:8081"
  #    command: jobmanager
  #    environment:
  #      - JOB_MANAGER_RPC_ADDRESS=jobmanager
  #    container_name: jobmanager
  #  taskmanager:
  #    image: flink
  #    expose:
  #      - "6121"
  #      - "6122"
  #    depends_on:
  #      - jobmanager
  #    command: taskmanager
  #    links:
  #      - "jobmanager:jobmanager"
  #    environment:
  #      - JOB_MANAGER_RPC_ADDRESS=jobmanager
  #    container_name: taskmanager
  #  elasticsearch:
  #    image: docker.elastic.co/elasticsearch/elasticsearch-oss:6.3.1
  #    environment:
  #      - cluster.name=docker-cluster
  #      - bootstrap.memory_lock=true
  #      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
  #      - discovery.type=single-node
  #    ports:
  #      - "9200:9200"
  #      - "9300:9300"
  #    ulimits:
  #      memlock:
  #        soft: -1
  #        hard: -1
  #      nofile:
  #        soft: 65536
  #        hard: 65536
  #    container_name: elasticsearch
  #  hive:
  #    image: bde2020/hive:latest
  #    depends_on:
  #      - jobmanager
  #    environment:
  #      FLINK_JOBMANAGER_HOST: jobmanager
  #    container_name: hive
  #  hive:
  #    image: ruili2/hive:latest
  #    depends_on:
  #      - jobmanager
  #    environment:
  #      FLINK_JOBMANAGER_HOST: jobmanager
  #    container_name: hive
  # networks:
  #   flink-network:
  #     name: flink-network
```

# Flink

State 存储方式

1. memeory state backend
   MemoryStateBackend 将工作状态数据保存在 taskmanager 的 java 内存中。key/value 状态和
   window 算子使用哈希表存储数值和触发器。进行快照时（checkpointing），生成的快照数据将和 checkpoint ACK
   消息一起发送给 jobmanager，jobmanager 将收到的所有快照保存在 java 内存中。
   MemoryStateBackend 现在被默认配置成异步的，这样避免阻塞主线程的 pipline 处理。
   MemoryStateBackend 的状态存取的速度都非常快，但是不适合在生产环境中使用。这是因为 MemoryStateBackend 有以下限制：

* 每个 state 的默认大小被限制为 5 MB（这个值可以通过 MemoryStateBackend 构造函数设置）
* 每个 task 的所有 state 数据 (一个 task 可能包含一个 pipline 中的多个 Operator) 大小不能超过 RPC 系统的帧大小(akka.framesize，默认 10MB)
* jobmanager 收到的 state 数据总和不能超过 jobmanager 内存

MemoryStateBackend 适合的场景：

* 本地开发和调试
* 状态很小的作业

![1742633400722](/knowledge-assets/big-data/image/2-flink/1742633400722.png)

当触发 savepoint 时，jobmanager 会把快照数据持久化到外部存储。

2. FsStateBackend

FsStateBackend 需要配置一个 checkpoint
路径，例如“hdfs://namenode:40010/flink/checkpoints” 或者
“file:///data/flink/checkpoints”，我们一般配置为 hdfs 目录
 FsStateBackend
将工作状态数据保存在 taskmanager 的 java 内存中。进行快照时，再将快照数据写入上面配置的路径，然后将写入的文件路径告知
jobmanager。jobmanager 中保存所有状态的元数据信息(在 HA 模式下，元数据会写入 checkpoint 目录)。
 FsStateBackend 默认使用异步方式进行快照，防止阻塞主线程的 pipline 处理。可以通过 FsStateBackend **构造函数**取消该模式

FsStateBackend 适合的场景：

* 大状态、长窗口、大键值（键或者值很大）状态的作业
* 适合高可用方案
  ![@FsStateBackend state 存储位置 | center](https://i-blog.csdnimg.cn/blog_migrate/60711a04871771ed7e296395075e27b0.png)

1. 全局配置状态的后端

state.backend: filesystem

state.checkpoints.dir: file:///opt/flink/data/checkpoints
state.savepoints.dir: file:///opt/flink/data/savepoints

Flink 开源项目管理：

[Zeppelin](https://zhida.zhihu.com/search?content_id=223598273&content_type=Article&match_order=1&q=Zeppelin&zhida_source=entity)

[StreamPark](https://link.zhihu.com/?target=https%3A//www.oomspot.com/post/apachestreampark-flinkkaifaliqi)

Flink + Dinky+ Doris+ DolphinScheduler

SeaTunnel

kubectl create namespace flink-session-cluster

kubectl create serviceaccount flink -n flink-session-cluster

kubectl create clusterrolebinding flink-role-binding-flink --clusterrole=edit --serviceaccount=flink-session-cluster:flink

./bin/kubernetes-session.sh
  -Dkubernetes.namespace=flink-session-cluster
  -Dkubernetes.jobmanager.service-account=flink
  -Dkubernetes.cluster-id=session001
  -Dtaskmanager.memory.process.size=8192m
  -Dkubernetes.taskmanager.cpu=1
  -Dtaskmanager.numberOfTaskSlots=4
  -Dresourcemanager.taskmanager-timeout=3600000

echo 'stop' |
  ./bin/kubernetes-session.sh
  -Dkubernetes.namespace=flink-session-cluster
  -Dkubernetes.cluster-id=session001
  -Dexecution.attached=true

```bash
./bin/kubernetes-session.sh
  -Dkubernetes.namespace=flink-session-cluster
  -Dkubernetes.jobmanager.service-account=flink
  -Dkubernetes.cluster-id=session001
  -Dtaskmanager.memory.process.size=2096m
  -Dkubernetes.taskmanager.cpu=0.5
  -Dtaskmanager.numberOfTaskSlots=2
  -Dresourcemanager.taskmanager-timeout=3600000
```

./bin/kubernetes-session.sh -Dkubernetes.namespace=flink-session-cluster -Dkubernetes.jobmanager.service-account=flink -Dkubernetes.cluster-id=session001 -Dtaskmanager.memory.process.size=2096m -Dkubernetes.taskmanager.cpu=0.5 -Dtaskmanager.numberOfTaskSlots=2 -Dresourcemanager.taskmanager-timeout=3600

https://developer.aliyun.com/article/883632

# Pyflink

- DataStream API
- Table API
- Event Time
- Watermark

# Reference

1. https://nightlies.apache.org/flink/flink-docs-stable/zh/
2. https://developer.aliyun.com/article/766710
3. https://developer.aliyun.com/article/883632state.checkpoints.dir: file:///opt/flink/data/checkpoints
4. https://blog.csdn.net/shirukai/article/details/109452700  flink on k8s
5. https://www.cnblogs.com/wan-ming-zhu/p/18050046 flink 基本介绍

state.savepoints.dir: file:///opt/flink/data/savepoints
