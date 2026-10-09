---
title: 示例：处理数据倾斜
description: spark 运行模式
date: '2025-06-22'
area: Big Data
tags: []
language: zh-CN
order: 1
draft: false
---
## #spark 运行模式

- Local
- Cluster
  - Standalone
  - Yarn
  - Mesos
  - K8s

在分布式集群模式下，任何1个 spark 程序都由1个driver 和多个executor 进程构成

Driver:  驱动进程， 负责申请资源，解析代码,构建Job/Task, 分配调度Task,监控Task 运行，构建有向无环图DAG 

Executor: 执行进程，分布式启动在多台节点上，专门负责运行Driver 分配的Task 任务执行

--deploy-mode :  client | cluster 

![1750562433152](/knowledge-assets/big-data/image/1-spark/1750562433152.png)

spark on yarn 

spark standalone

spark-submit :

spark web-ui 日志：

总的集群日志：

- localhost:8080  集群信息
- localhose:4040 任务日志信息

![1750583112417](/knowledge-assets/big-data/image/1-spark/1750583112417.png)

架构层面：ClustermManager ,worker 

程序层面： Application , Driver ,Executor 

运行层面：  Job , Stage , Task 

Cluster Manager : 统称，分布式资源管理的主节点

- Standalone : Master

- Yarn : ResouceManager

Work : 统称： 

- standalone : worker
- Yarn : NodeManger

![1750583308488](/knowledge-assets/big-data/image/1-spark/1750583308488.png)

![1750583452098](/knowledge-assets/big-data/image/1-spark/1750583452098.png)


![1750583086456](/knowledge-assets/big-data/image/1-spark/1750583086456.png)



Job : 

Application -> 多个Job （DAG）->多个Stage (宽窄依赖切分)

每个job ： 都有个1个DAG ，一个Action 算子

RDD  5 个特征：

1. RDD 是逻辑， 每个RDD 在物理上都可以对应多个分区数据，每个分区的数据可以存储在不同的节点上
2. RDD  的Transformation 本质上是对RDD 所有的分区并行转换
3. RDD Lineage 血缘机制
   1. ![1750563473468](/knowledge-assets/big-data/image/1-spark/1750563473468.png)
4. （k,v） RADD ,  在shuffle 过程中可以自定义分区
5. 

![1750563614637](/knowledge-assets/big-data/image/1-spark/1750563614637.png)


## Create RDD (2 way)

1. 从1集合中创建

   ```python
   from pyspark.sql import SparkSession 
   spark = SparkSession.builder.appName("template").getOrCreate()
   data = [1,2,3]
   rdd = spark.parallelize(data,numSlices=2)
   rdd.foreach(lambda: x: print(x)))

   ```
2. 从外部系统： textFile, HDFS


RDD :

容错机制：

persist

checkpoint 

![1750580216128](/knowledge-assets/big-data/image/1-spark/1750580216128.png)

![1750580357066](/knowledge-assets/big-data/image/1-spark/1750580357066.png)



默认分区数：

![1750564369937](/knowledge-assets/big-data/image/1-spark/1750564369937.png)


## # spark

RDD(Resilient Distributed Dataset)叫做弹性分布式数据集，是 Spark 中最基本的数据抽象，代表一个不可变、可分区、里面的元素可并行计算的集合。

RDD单词拆解：

    Resilient ：它是弹性的，RDD 里面的中的数据可以保存在内存中或者磁盘里面；
    Distributed ： 它里面的元素是分布式存储的，可以用于分布式计算；
    Dataset: 它是一个集合，可以存放很多元素。

 **RDD 是一个数据集的表示，不仅表示了数据集，还表示了这个数据集从哪来，如何计算** ，主要属性包括：

* 分区列表
* 计算函数
* 依赖关系
* 分区函数(默认是 `hash`)
* 最佳位置

spark 可以计算，结构化，半结构化，非结构化

![1749999725437](/knowledge-assets/big-data/image/1-spark/1749999725437.png)

![1749999911574](/knowledge-assets/big-data/image/1-spark/1749999911574.png)

Application: Spark应用程序

指的是用户编写的Spark应用程序，包含了Driver功能代码和分布在集群中多个节点上运行的Executor代码。

![1750082501315](/knowledge-assets/big-data/image/1-spark/1750082501315.png)

Driver :

Spark中的Driver即运行上述Application的Main()函数并且创建SparkContext

其中创建SparkContext的目的是为了准备Spark应用程序的运行环境。

![1750082545297](/knowledge-assets/big-data/image/1-spark/1750082545297.png)

Cluster Manager : 资源管理器

指的是在集群上获取资源的外部服务，常用的有：Standalone，Spark原生的资源管理器，由Master负责资源的分配；Haddop
Yarn，由Yarn中的ResearchManager负责资源的分配；Messos，由Messos中的Messos Master负责资源管理。

Executor: 执行器

Application运行在Worker节点上的一个进程，该进程负责运行Task，并且负责将数据存在内存或者磁盘上，每个Application都有各自独立的一批Executor，如下图所示。

![1750082647941](/knowledge-assets/big-data/image/1-spark/1750082647941.png)

Worker：计算节点

集群中任何可以运行Application代码的节点，类似于Yarn中的NodeManager节点。在Standalone模式中指的就是通过Slave文件配置的Worker节点，在Spark
 on Yarn模式中指的就是NodeManager节点，在Spark on Messos模式中指的就是Messos
Slave节点，如下图所示。
![1750082736876](/knowledge-assets/big-data/image/1-spark/1750082736876.png)

DAGScheduler :

基于DAG划分Stage
并以TaskSet的形势提交Stage给TaskScheduler；负责将作业拆分成不同阶段的具有依赖关系的多批任务；最重要的任务之一就是：计算作业和任务的依赖关系，制定调度逻辑。在SparkContext初始化的过程中被实例化，一个SparkContext对应创建一个DAGScheduler。

![1750082822447](/knowledge-assets/big-data/image/1-spark/1750082822447.png)

TaskScheduler:

![1750082859520](/knowledge-assets/big-data/image/1-spark/1750082859520.png)

job :

由一个或多个调度阶段所组成的一次计算作业；包含多个Task组成的并行计算，往往由**Spark Action**催生，一个JOB包含多个RDD及作用于相应RDD上的各种Operation。如图所示。

![1750082900580](/knowledge-assets/big-data/image/1-spark/1750082900580.png)

## RDD 类型

### 1.普通类型：

 **特点** ：

* 每个元素是单一值（如 `int`、`str`）。
* 支持基本转换操作（如 `map`、`filter`、`flatMap`）

### **2. 键值对 RDD（Pair RDD）**

存储二元组 `(key, value)` 的 RDD，支持键值对特有的操作（如 `reduceByKey`、`join`）

### 共享变量

在默认情况下，当 Spark在集群的多个不同节点的多个任务上并行运行一个函数时，它会把函数中涉及到的每个变量，在每个任务上都生成一个副本。但是，有时候需要在多个任务之间共享变量，或者在任务(Task)和任务控制节点(DriverProgram)之间共享变量。

### 3.广播变量： broadcast variable

### 4.累加器： accumulator

一旦变量在driver 被创建，整个数据集就会在集群广播

让所有正在运行的计算任务以只读方式访问

![1750581188042](/knowledge-assets/big-data/image/1-spark/1750581188042.png)

### 5. 自定义 RDD

**选择合适的 RDD 类型**

* **普通 RDD** ：简单数据处理，无键值对操作。
* **Pair RDD** ：需要分组、聚合、连接等操作。
* **累加器** ：并行计数或求和。
* **广播变量** ：高效分发大对象到各节点。
* **自定义 RDD** ：特殊分区或计算需求。

## 分片

RDD（弹性分布式数据集）的分片（Partitioning）机制是实现分布式计算的核心，它决定了数据如何在集群中分布和并行处理

分片是 RDD 的逻辑分区，每个分片包含一部分数据，可在集群的不同节点上独立处理。分片是并行计算的基本单位。

1. **作用**
   * **数据分割** ：将大数据集拆分为小片段，便于分布式存储和处理。
   * **并行计算** ：每个分片可由不同的 Executor 并行处理，提升计算效率。
   * **故障恢复** ：RDD 的 Lineage 依赖允许在分片丢失时重新计算。

分片/分区的创建与控制：

- 从集合创建，从文件创建
- **转换操作中的分片**
  - **窄依赖操作** （如 `map`、`filter`）：保留原分片数和分区方式
  - **宽依赖操作** （如 `groupByKey`、`join`）：默认使用 `spark.sql.shuffle.partitions`（默认 200）

**手动调整分片数**

* **增加分片** ：`repartition(n)`（触发全量 Shuffle，开销大）。
* **减少分片** ：`coalesce(n)`（避免全量 Shuffle，优先使用）

分区policy：

1：**哈希分区（Hash Partitioning）**

* **适用场景** ：键值对 RDD（Pair RDD）的默认分区方式。
* **原理** ：根据键的哈希值将数据分配到不同分片

**范围分区（Range Partitioning）**

* **适用场景** ：需要按键的范围排序的数据（如数值范围）。

**自定义分区**

* **方式** ：继承 `Partitioner` 类，重写 `numPartitions` 和 `getPartition` 方法

**分片与性能优化**

1. **分片数与集群资源匹配**
   * 理想分片数为集群 CPU 核心数的 2~3 倍，避免分片过少（并行度不足）或过多（调度开销大）。

**减少 Shuffle 开销**

* 宽依赖操作（如 `groupByKey`）会触发 Shuffle，可通过 `reduceByKey` 预聚合减少数据传输。

  ```
  # 优化前：groupByKey + mapValues
  rdd.groupByKey().mapValues(sum)  # 先分组后聚合

  # 优化后：reduceByKey（本地预聚合）
  rdd.reduceByKey(lambda x, y: x + y)  # 减少 Shuffle 数据量
  ```

**数据倾斜处理**

* 对倾斜的键添加随机前缀，分散到多个分片，再聚合。

```pyspark
# 示例：处理数据倾斜
skewed_rdd = rdd.map(lambda x: (f"{random.randint(0, 10)}_{x[0]}", x[1]))
aggregated_rdd = skewed_rdd.reduceByKey(lambda x, y: x + y)
final_rdd = aggregated_rdd.map(lambda x: (x[0].split("_")[1], x[1]))
```

**分片的底层实现**

* **分区器（Partitioner）** ：决定键值对 RDD 的分片方式，支持 `HashPartitioner`、`RangePartitioner` 和自定义分区器。
* **依赖关系（Dependencies）** ：窄依赖（如 `map`）的子 RDD 分片与父 RDD 分片一一对应；宽依赖（如 `shuffle`）会创建新的分片。
* **任务调度** ：Spark 为每个分片创建一个任务（Task），分发到集群节点执行。

分片机制是 Spark 高效处理大数据的基础，通过合理设置分片数和选择分区策略，可显著提升并行计算效率。关键原则：

* **数据本地化** ：尽量让计算靠近数据存储位置。
* **避免过度 Shuffle** ：优先使用窄依赖操作。
* **匹配资源** ：分片数与集群资源成正比。

![1750080826479](/knowledge-assets/big-data/image/1-spark/1750080826479.png)

![1750080985679](/knowledge-assets/big-data/image/1-spark/1750080985679.png)

RDD lineage

窄依赖： 所有计算都在分区所在节点完成

宽依赖： 还叫shuffle 依赖

当RDD 中的某个分区出现故障，只需要按照依赖重新计算即可

RDD 的血统机制就是RDD 的容错机制 ，适当调用RDD 的checkpoint

Spark shuffle 实现方式有2种：

- Hash Shuffle
- sort-based shuffle

**核心算法：回溯算法**

**从后往前回溯/反向解析，遇到窄依赖加入本Stage，遇见宽依赖进行Stage切分。**

## https://www.bilibili.com/video/BV1Jq4y1z7VP?spm_id_from=333.788.player.switch&vd_source=ae11379595599a1cedeb268c109fc9bb&p=9

## Spark提供了6大组件：

* Spark Core
* Spark SQL
* Spark Streaming
* [Spark MLlib](https://zhida.zhihu.com/search?content_id=228788816&content_type=Article&match_order=1&q=Spark+MLlib&zhida_source=entity)
* [Spark GraphX](https://zhida.zhihu.com/search?content_id=228788816&content_type=Article&match_order=1&q=Spark+GraphX&zhida_source=entity)

![1749998302198](/knowledge-assets/big-data/image/1-spark/1749998302198.png)

Spark有完善的生态圈，如下：

    Spark Core：实现了 Spark 的基本功能，包含 RDD、任务调度、内存管理、错误恢复、与存储系统交互等模块。
    Spark SQL：Spark 用来操作结构化数据的程序包。通过 Spark SQL，我们可以使用 SQL 操作数据。
    Spark Streaming：Spark 提供的对实时数据进行流式计算的组件。提供了用来操作数据流的 API。
    Spark MLlib：提供常见的机器学习(ML)功能的程序库。包括分类、回归、聚类、协同过滤等，还提供了模型评估、数据导入等额外的支持功能。
    GraphX(图计算)：Spark 中用于图计算的 API，性能良好，拥有丰富的功能和运算符，能在海量数据上自如地运行复杂的图算法。
    集群管理器：Spark 设计为可以高效地在一个计算节点到数千个计算节点之间伸缩计算。
    Structured Streaming：处理结构化流,统一了离线和实时的 API。

## Master & worker :

在Spark中，Master是独立集群的控制者，而Worker是工作者。一个Spark独立集群需要启动一个Master和多个Worker。Worker就是物理节点，可以在上面启动Executor进程

## Executor :

Executor是一个执行Task的容器。实际上它是一组计算资源(cpu核心、memory)的集合。

**一个Worker节点可以有多个Executor。一个Executor可以运行多个Task**

executor创建成功后，在日志文件会显示如下信息： `INFO Executor: Starting executor ID [executorId] on host [executorHostname]`

## Job

一个Job包含多个RDD及作用于相应RDD上的各种操作， **每个Action的触发就会生成一个job** 。用户提交的Job会提交给DAGScheduler，Job会被分解成Stage，Stage会被细化成Task。

## **Task**

被发送到executor上的工作单元。每个Task负责计算一个分区的数据。

## **Stage**

在 Spark 中，一个作业（job）会被划分为多个阶段（stage）。 **同一个 Stage 可以有多个 Task 并行执行(task 数=分区数）** 。

阶段之间的划分是根据数据的依赖关系来确定的。当一个 RDD 的分区依赖于另一个 RDD 的分区时，这两个 RDD 就属于同一个阶段。当一个 RDD 的分区依赖于多个 RDD 的分区时，这些 RDD 就属于不同的阶段。

![1750253608538](/knowledge-assets/big-data/image/1-spark/1750253608538.png)

* 一个 Spark 程序可以有多个 DAG(有几个 Action，就有几个 DAG，上图最后只有一个 Action（图中未表现）,那么就是一个 DAG);
* 一个 DAG 可以有多个 Stage(根据宽依赖/shuffle 进行划分)；

Spark 会根据 shuffle/宽依赖使用回溯算法来对 DAG 进行 Stage 划分，从后往前，遇到宽依赖就断开，遇到窄依赖就把当前的 RDD 加入到当前的 stage/阶段中

## **Shuffle**

在 Spark 中，shuffle 是指在不同阶段之间重新分配数据的过程。它通常发生在需要对数据进行聚合或分组操作的时候，例如 reduceByKey 或 groupByKey 等操作。

在 shuffle 过程中，Spark 会将数据按照键值进行分区，并将属于同一分区的数据发送到同一个计算节点上。这样，每个计算节点就可以独立地处理属于它自己分区的数据。

在 MapReduce 框架中，Shuffle 阶段是连接 Map 与 Reduce 之间的桥梁， Map 阶段通过 Shuffle 过程将数据输出到 Reduce 阶段中。由于 Shuffle 涉及磁盘的读写和网络 I/O，因此 Shuffle 性能的高低直接影响整个程序的性能。Spark 也有 Map 阶段和 Reduce 阶段，因此也会出现Shuffle。

> Shuffle的本质就是数据重组分发的过程。

**Spark Shuffle 分为两种：**

* 一种是基于 Hash 的 Shuffle；
* 另一种是基于 Sort 的 Shuffle。

Shuffle也是Spark中最昂贵的操作之一，它不仅会带来网络IO，还会引发磁盘IO、数据序列化/反序列化、JVM垃圾回收等操作，因此其性能往往决定着Spark作业的整体性能

![1750583569807](/knowledge-assets/big-data/image/1-spark/1750583569807.png)




RDD是“Resilient Distributed Dataset”的缩写，从全称就可以了解到RDD的一些典型特性：

* **Resilient（弹性）** ：RDD之间会形成有向无环图（DAG），如果RDD丢失了或者失效了，可以从父RDD重新计算得到。即容错性。
* **Distributed（分布式）** ：RDD的数据是以逻辑分区的形式分布在集群的不同节点的。
* **Dataset（数据集）** ：即RDD存储的数据记录，可以从外部数据生成RDD，例如Json文件，CSV文件，文本文件，数据库等。

RDD 的算子分为两类:

* **Transformation转换操作** :返回一个新的 RDD
* **Action动作操作** :返回值不是 RDD(无返回值或返回其他的)

注意:

    RDD 不实际存储真正要计算的数据，而是记录了数据的位置在哪里，数据的转换关系(调用了什么方法，传入什么函数)。
    RDD 中的所有转换都是惰性求值/延迟执行的，也就是说并不会直接计算。只有当发生一个要求返回结果给 Driver 的 Action动作时，这些转换才会真正运行。
    之所以使用惰性求值/延迟执行，是因为这样可以在 Action 时对 RDD 操作形成 DAG有向无环图进行 Stage 的划分和并行优化，这种设计让 Spark 更加有效率地运行。

## DAG

有向无环图，其实说白了就是RDD之间的依赖关系图。

* **开始** ：通过 SparkContext 创建的 RDD；
* **结束** ：触发 Action，一旦触发 Action 就形成了一个完整的 DAG（ **有几个 Action，就有几个 DAG** ）。

## 基本算子

```bash
map :  一一映射  对每一条数据执行
mapValues :
mapPartitions: 一一映射,对每个分区 
mapPatitionWithIndex

zip  分区数量必须一致，每个分区的元素也必须一致   a ,b ->（a, b）
zipWithIndex 

groupByKey 
默认的分区器 ：  key hashcode % 分区数
数据重新分发 ： shuffle 
reduceByKey
分区类聚合  
能使用reduceByKey 就不用groupByKey  

foreach  一一映射 ， 没有返回值 ， 常见的打印  每次迭代一个元素  
foreachPartition 

sortByKey   产生 job
zipWithIndex  产生 job
take 产生 job
reduct 元素并归 ， 没有顺序
coutByKey    某个元素的key 的个数
collectAsMAp  ： 用于[k,v] rdd , 以map 集合返回
take()
first()
top()  返回前n 个
takeOrdered(n) 

```

## RDD的高级应用

```
1：RDD 的缓存和持久化 
默认情况下， 每一个action 操作 ， 都会重新计算上面的转换RDD （重新计算）
如果能把该RDD的结果缓存下来， 那么基于该RDD的操作，就不需要从头计算 
cache() (StoregeLevel )  缓存
persisit(StoregeLevel.MeMORY_AND_DISK) 持久化
执行完业务逻辑，可以手动释放
unpersisit()

2：RDD 的checkpoint 容错方案 
把rdd 中的数据 ，写到分布式文件系统中
sc.setCheckpointDir('hdfs://ip:port/dir')
rdd.checkpoint   
1:是lazy 算子  ，当触发action算子的时候， 才执行，产生2个job,第一个job
是 执行业务逻辑， 第二个job 执行写入到数据到hdfs
2: 当对某一个rdd 执行checkpoint 之后， 该RDD原有的父依赖关系被删除 ，取而代之是checkpointRDD
3: 以后对该RDD所有的操作，依赖关系从CheckpointRDD开始，真正的数据从hdfs 读取

在特别复杂的业务逻辑中，才会用 

3： RDD 中的共享变量（广播变量 ， 累计器） 广播大变量  在driver端一个副本 

RDD的内存管理方法：
spark1.x 静态内存管理 （各个模块的占比是固定的 ，容易造成不均衡 淘汰）
spark2.x 统一的内存管理  

内存的组成部分：
总的内存 = 系统预留内存（300M） + 可用内存
可用内存  = 统一内存（0.6） + 其他（0.4）
统一内存 = 存储内存(storege)（0.5） + 执行内存 (executiom)（0.5）

Storege 存储内存 ：
缓存RDD ,展开partition ,存放Direct task result ，存放广播变量 ，在spark Streaming reciver 模式中， 存放每个batch 的blocks
execution 执行内存：
用于shuffle , join , sort ,aggregation(聚合) ，buffer等操作
其他：
spark : 内部的元数据 ， OOM错误 ， 

默认配置参数， spark.memory.fraction = 0.6
 spark.memory.storageFraction=0.5
 

Torrent 比特洪流技术
广播变量实现类 ： TorrentBroadcast 
利用广播变量， 能保证一个executor的所有task 共用一份反序列化的数据
减少数据的反序列化和GC
使用：
    diver 端广播  blockManagerMaster 
    executor 使用  blockManager 
注意使用： 
1除了RDD 不能被广播， 其他的类 、集合。对象都可以被广播
2： 被广播数据， 可以在任意的executor 中通过value调用
3： 广播变量是只读的，不能被修改 
4： 最大的功能是，就是保证一个executor中所有的task共用一份数据 ，提升效率 


4： 累加器
在driver端定义一个类加器
全局的 可以通过Web 监控界面查看 
acc = sc.LongAccumulator('variable_acc')

总结：
1在driver端定义累加器
2在任意的函数中，executor中通过add方法调用
3累加器是全局(application为单位)的累加 
4在driver端 ，通过value 方法获取值
5在程序的监控界面，通过累加器的名称来获取值
```

**Action 动作算子** ：

![1749998728856](/knowledge-assets/big-data/image/1-spark/1749998728856.png)

**统计操作** ：

![1749998754560](/knowledge-assets/big-data/image/1-spark/1749998754560.png)

* **窄依赖** ：父 RDD 的一个分区只会被子 RDD 的一个分区依赖；
* **宽依赖** ：父 RDD 的一个分区会被子 RDD 的多个分区依赖(涉及到 shuffle)。

## spark 的序列化

```
spark 中使用的序列化机制 默认是java 序列化 javaSerializer
内存中对象  序列化 二进制文件  网络传输 反序列化

KryoSerializer  : 占用内存少，速度快， 需要注册

1： spark standalone HA  （high avaliable ） 高可用  7 * 24  (集群) 
 单点故障  核心节点
 standlone master worker
 master alive  master standby(热备)
zookeeper 管理节点 高可用 
2： spark on yarn  standalone 两套不同的集群

yarn 集群  
客服端提交任务  1台（满足条件  ，spark 安装包 ， hadoop 的配置 （hdfs  +yarn）） 连接到hadoop集群 

yarn 集群：
ResourceManager 
NodeManager
1: 修改 ${hadoop}/etc/hadoop/capacity-scheduler.xml 中的资源调度

2： yarn.site.xml


spark 的客服端配置 
1：jdk
vim ${spark_home}/conf/spark-env.sh
2: hadoop_conf_dir  /yarn_conf_dir # hadoop的配置文件路径 

spark-submit --master yarn --deploy-model client/cluster 

两种部署模式区别 ：
cluster : Driver 运行在集群中的某一个节点 ， Driver 可以容错 ，提交任务，就可以退出
client :  Driver 运行在客服端 
```

## UDF自定义函数

```
第1种方式
# 定义自定义函数
 def fun_name():
 pass
# 注册自定义函数
udf1 = functions.udf(fun_name, FloatType()
# 使用自定义函数
dataframe = dataframe.withColumn(col, udf1(col))
第2种方式
注册udf，在sql中使用
spark.udf.register("udf1", fun_name,StringType()) 
dataframe = dataframe.withColumn(col, udf1(col))
第3种方式 注解形式更方便
@udf(returnType=StringType()) 
def fun_name():
 pass
df.withColumn("Cureated Name", convertCase(col("Name"))).show(truncate=False)

pandas_udf函数支持定义三种类型的函数，分别为SCALAR、GROUP_MAP、GROUP_AGG，在pyspark.sql.function.PandasUDFType 中做了定义

from pyspark.sql.functions import pandas_udf, PandasUDFType
由于数据中某些字段包含 json 数据，因此直接使用 DataFrame 进行读取会出现分割错误，所以如果要创建 DataFrame，需要先直接读取文件生成 RDD，再将 RDD 转为 DataFrame。过程中，使用 python3 中的 csv 模块对数据进行解析和转换。

https://zhuanlan.zhihu.com/p/349664650
RDD：代表一个不可变的，可分区的，可被并行操作的数据元素集合
在进行spark 运算时，spark会创建一个DAG（有向无环图）来优化计算效率，并且在执行actions动作之前，spark绝不会开始实际的任务执行
transformation操作
action: 操作：
最起码有三种方式可以用于创建rdd：
可以从文本文件中读取从collections对象中创建（比如一串数字，字符，pairs），通过SparkContext.parallelize()从其他rdd中通过map,filter等函数创建
map()
mapValues() # 作用于键值对
reduceByKey( lambda x, y: x+y)

reduceByKey()
combineBykey()
groupBykey()
aggregateByKey()
sortByKey() 

```

```
cp ./conf/spark-env.sh.template ./conf/spark-env.sh
export SPARK_DIST_CLASSPATH=$(/home/hadoop/softs/hadoop/bin/hadoop classpath)

export SPARK_HOME=/home/hadoop/softs/spark
export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME


# 安装pyspark
pip install -U -i https://pypi.tuna.tsinghua.edu.cn/simple pyspark
pip install pyspark -i https://pypi.doubanio.com/simple/

export SPARK_HOME=/home/hadoop/softs/spark
export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME

export PYSPARK_PYTHON=/root/anaconda3/bin/python
export PYSPARK_DRIVER_PYTHON=/root/anaconda3/bin/python

https://www.bilibili.com/video/BV1j4411u7hT?p=6&spm_id_from=pageDriver

spark core 
spark sql
spark streaming 
spark MLlib
图计算 GraphX 

spark + yarm + hdfs  
spark + mysql redis kafka zookeeper 

部署模式：

local 
至少2台
standalone 自带集群模式
yarm   集群模式
mesos  集群模式 

master  worker 
1：配置主节点 到从节点免登录 
2： 关闭防火墙  （大数据都是内网集群）
service iptables status
serverice iptables stop
chkconfig iptables off
3: IP 和hostname 映射关系
ip hostname

spark 目录：
bin   可执行的脚步
conf   配置文件
jars   依赖jar 包
sbin   集群管理命令

修改配置文件：
spark-env.sh
export JAVA_HOME=
export SPARK_MASTER_HoST=hdp-01
export SPARK_MASTER_PORT=7077
7077: 是spark 内部通信端口  worker向master 连接端口
8088： web 访问master 的端口  
slaves.sh
hdp-02/ip  所有的从节点 
# 分发安装包
for i in 2 3 4;
do scp -r spark(安装包)/ hdp-0$i:$PWD ; done 
# 启动
start-master.sh
start-slavers.sh
start-all.sh
# 日志问题
spark-home/logs
master 启动命令 
java -cp *** **.class 参数列表
netstat -natpl | grep 1608
在spark  hadoop  都有start-all.sh 
 /etc/profile  谁先加载 ，谁生效 ，  或者改名 

 启动后 : 
 master 地址：  spark://hdp-01:7077 
work 占用资源： 
cores  : 当前机器
memory  ： 当前机器 内存-1g

# spark 提交任务
客服端：
1必须安装spark 安装包 spark-submit
2必须连接到master
spark 提交给maset ,在集群执行

spark-shell : 交互式命令行
spark-submit : 标准的提交命令
spark-submit 选项 jar包 参数列表
--master   yarm spark://host:port local  默认local   local[*] 可以指定核
--class  主方法所在类
--deploy-model  driver 位置  driver的位置
clinet  : driver 运行在客服端
cluster : driver 在集群中的某一台 
jar 架包
在写spark 程序的时候必须有sparkContext
在集群模式下， 不能读取本地的文件 一般读取hdfs 文件 
1: master 先启动 ，检查超时的worker
2： worker 启动 向 master 注册 ， 资源信息 （memory ,core）
3: master 保存worker的相关信息
4： master 向worker 发送注册成功的消息
5： worker 启动定时任务， 报活  ，发送心跳
5: master 修改worker的最后一次心跳时间

1:客户端请求application 
2:master 进行资源分配
   打散策略
  每一个空闲的worker 来参与运行任务，向worker 发送指令 ，启动executor
3: driver :
解析业务逻辑功能
切分阶段 stage
创建task ,条件task  （task 执行的最小单位）
4: excutor 向driver 注册 ，并通信


```

```
常驻进程：
master ： 集群的管理者， 管理worker , 负责客服端的任务请求调度
worker : 向master 通信 ，管理自己的executor
任务执行时：
在哪里提交，在哪里产生 sparksubmit 进程
coarseGrainedExecutorBackend 提供干活的资源 简称executor 所有的task
driver程序： 主控程序 ， 解析业务逻辑代码， 切分阶段stage 创建task 提交task 到executor执行

可以指定资源分配：
--executor-cores  每一个executors（work） 占用的cores
--executor-memory    每一个executors 占用的memory
--total-executor-cores  application 能使用的最多cores数

work  : 启动
    
在提交spark 任务，反射执行自定义main方法
1： 客服端提交 spark-submit 选项 jar包 参数列表
2: 调用spark-class 脚本 通过exec 执行启动一个main方法
3： SparkSubmit.main 反射执行一个类 wordCount.main 
4: new SparkContext 
    创建3个核心的对象 TaskScheduler , DAGScheduler ,SchedulerBackend
SchedulerBackend : coarseGrainedExecutorBackend , StandaloneSchedulerBackend
```

## 基本使用

### RDD:

```
分为两类算法：
Transfomer : 转换算子 lazy  产生一个新的rdd
map fliter flatMap goupBykey reduceBykey aggregateByKey ,union ,join ,coalesce
action :    执行 (写文件 ， ) 返回结果给驱动程序 ，或写入文件系统
reduce ,collect ,count  ,first ,take ,countByKey , foreach 

产生job 

Application ->job（DAG）->Stage -> task 
RDD: 弹性分布式数据集合  resillebt distributed dataset（不可变得 ，只读的）
弹性： 容错能力 
分布式： 以分区为单位 ，运行在不同的节点上

1: rdd 的创建：
集合并行化
读取外部系统文件  sc.textFilxt(path)
转换算子
2:  rdd 的分区  默认分区数量 = application 使用的cores 数量
 每一个rdd 都有分区 。 rdd.size 分区的数量
partition :  
hdfs :   分区数量 = 读取hdfs 文件的block 快的数量


RDD依赖关系  父到子
宽依赖  有shuffle操作
窄依赖 
划分阶段
从计算过程：
ont-to-one  所有作业可以流水线  pipeline 速度快 窄依赖
宽依赖必须拿到所有分区的数据才能计算，速度慢
容错： 窄依赖 好 宽依赖差

基于以上2点， 用dependency , 用于封装两种不同的依赖关系  ，然后搞出stage阶段
把所有的窄依赖放在一个阶段中 

窄依赖算子：
map flatMap filter 不会改变分区数量
union coalesce   增加  减少分区数量
所有的窄依赖算子rdd 都在一个阶段中 stage
（一旦遇到宽依赖 ，就切分stage）
宽依赖算子: shuffle 一对多的关系  : 有几个算子 就切分多个阶段
groupByKey  reduceByKey distinct 

Stage ： spark 中对所有的窄依赖的封装 ，提供的一个抽象类
Stage： ResultStage ： 只有一个 ， 就是最后一个stage
ShuffleMapStage :  0 到多个

Stage 是有起始边界：
ShuffleMapStage： 起点  job 中的第一个RDD
终点： shuffle Write
ResultStage:  起点: Shffle Read 
终点： job 中最后一个RDD 
job的起始位置：
当触发action 算法的时候，产生job  ， job终止位置 ,就是action算子对应的RDD

DAG ： 有向五环图
有向： 数据的流向， RDD的依赖方向
无环 ： 不是闭环
图：  点 RDD  线 rdd 之间的依赖关系 

1Driver 
在解析业务逻辑代码的时候 ，完成DAG的构建，当触发action 算子的时候，DAG构建完成
2DAGSchedule
基于DAG,切分stage ，创建task ，提交stage
3Taskschedule
调度Task ，提交task 给executor 执行 
```

### 基本算子

```
map :  一一映射  对每一条数据执行
mapValues :
mapPartitions: 一一映射,对每个分区 
mapPatitionWithIndex

zip  分区数量必须一致，每个分区的元素也必须一致   a ,b ->（a, b）
zipWithIndex 

groupByKey 
默认的分区器 ：  key hashcode % 分区数
数据重新分发 ： shuffle 
reduceByKey
分区类聚合 
能使用reduceByKey 就不用groupByKey 

foreach  一一映射 ， 没有返回值 ， 常见的打印  每次迭代一个元素 
foreachPartition 

sortByKey   产生 job
zipWithIndex  产生 job
take 产生 job
reduct 元素并归 ， 没有顺序
coutByKey    某个元素的key 的个数
collectAsMAp  ： 用于[k,v] rdd , 以map 集合返回
take()
first()
top()  返回前n 个
takeOrdered(n) 
```

### RDD的高级应用

```
1：RDD 的缓存和持久化 
默认情况下， 每一个action 操作 ， 都会重新计算上面的转换RDD （重新计算）
如果能把该RDD的结果缓存下来， 那么基于该RDD的操作，就不需要从头计算 
cache() (StoregeLevel )  缓存
persisit(StoregeLevel.MeMORY_AND_DISK) 持久化
执行完业务逻辑，可以手动释放
unpersisit()

2：RDD 的checkpoint 容错方案 
把rdd 中的数据 ，写到分布式文件系统中
sc.setCheckpointDir('hdfs://ip:port/dir')
rdd.checkpoint   
1:是lazy 算子  ，当触发action算子的时候， 才执行，产生2个job,第一个job
是 执行业务逻辑， 第二个job 执行写入到数据到hdfs
2: 当对某一个rdd 执行checkpoint 之后， 该RDD原有的父依赖关系被删除 ，取而代之是checkpointRDD
3: 以后对该RDD所有的操作，依赖关系从CheckpointRDD开始，真正的数据从hdfs 读取

在特别复杂的业务逻辑中，才会用 

3： RDD 中的共享变量（广播变量 ， 累计器） 广播大变量  在driver端一个副本 

RDD的内存管理方法：
spark1.x 静态内存管理 （各个模块的占比是固定的 ，容易造成不均衡 淘汰）
spark2.x 统一的内存管理  

内存的组成部分：
总的内存 = 系统预留内存（300M） + 可用内存
可用内存  = 统一内存（0.6） + 其他（0.4）
统一内存 = 存储内存(storege)（0.5） + 执行内存 (executiom)（0.5）

Storege 存储内存 ：
缓存RDD ,展开partition ,存放Direct task result ，存放广播变量 ，在spark Streaming reciver 模式中， 存放每个batch 的blocks
execution 执行内存：
用于shuffle , join , sort ,aggregation(聚合) ，buffer等操作
其他：
spark : 内部的元数据 ， OOM错误 ， 

默认配置参数， spark.memory.fraction = 0.6
 spark.memory.storageFraction=0.5
 

Torrent 比特洪流技术
广播变量实现类 ： TorrentBroadcast 
利用广播变量， 能保证一个executor的所有task 共用一份反序列化的数据
减少数据的反序列化和GC
使用：
    diver 端广播  blockManagerMaster 
    executor 使用  blockManager 
注意使用： 
1除了RDD 不能被广播， 其他的类 、集合。对象都可以被广播
2： 被广播数据， 可以在任意的executor 中通过value调用
3： 广播变量是只读的，不能被修改 
4： 最大的功能是，就是保证一个executor中所有的task共用一份数据 ，提升效率 


4： 累加器
在driver端定义一个类加器
全局的 可以通过Web 监控界面查看 
acc = sc.LongAccumulator('variable_acc')

总结：
1在driver端定义累加器
2在任意的函数中，executor中通过add方法调用
3累加器是全局(application为单位)的累加 
4在driver端 ，通过value 方法获取值
5在程序的监控界面，通过累加器的名称来获取值

```

**spark 序列化**

```
spark 中使用的序列化机制 默认是java 序列化 javaSerializer
内存中对象  序列化 二进制文件  网络传输 反序列化

KryoSerializer  : 占用内存少，速度快， 需要注册

1： spark standalone HA  （high avaliable ） 高可用  7 * 24  (集群) 
 单点故障  核心节点
 standlone master worker
 master alive  master standby(热备)
zookeeper 管理节点 高可用 
2： spark on yarn  standalone 两套不同的集群

yarn 集群  
客服端提交任务  1台（满足条件  ，spark 安装包 ， hadoop 的配置 （hdfs  +yarn）） 连接到hadoop集群 

yarn 集群：
ResourceManager 
NodeManager
1: 修改 ${hadoop}/etc/hadoop/capacity-scheduler.xml 中的资源调度

2： yarn.site.xml


spark 的客服端配置 
1：jdk
vim ${spark_home}/conf/spark-env.sh
2: hadoop_conf_dir  /yarn_conf_dir # hadoop的配置文件路径 

spark-submit --master yarn --deploy-model client/cluster 

两种部署模式区别 ：
cluster : Driver 运行在集群中的某一个节点 ， Driver 可以容错 ，提交任务，就可以退出
client :  Driver 运行在客服端 
```

### UDF 自定义函数

```
第1种方式
# 定义自定义函数
 def fun_name():
 pass
# 注册自定义函数
udf1 = functions.udf(fun_name, FloatType()
# 使用自定义函数
dataframe = dataframe.withColumn(col, udf1(col))
第2种方式
注册udf，在sql中使用
spark.udf.register("udf1", fun_name,StringType()) 
dataframe = dataframe.withColumn(col, udf1(col))
第3种方式 注解形式更方便
@udf(returnType=StringType()) 
def fun_name():
 pass
df.withColumn("Cureated Name", convertCase(col("Name"))).show(truncate=False)

pandas_udf函数支持定义三种类型的函数，分别为SCALAR、GROUP_MAP、GROUP_AGG，在pyspark.sql.function.PandasUDFType 中做了定义

from pyspark.sql.functions import pandas_udf, PandasUDFType
```

**由于数据中某些字段包含 json 数据，因此直接使用 DataFrame 进行读取会出现分割错误，所以如果要创建 DataFrame，需要先直接读取文件生成 RDD，再将 RDD 转为 DataFrame。过程中，使用 python3 中的 csv 模块对数据进行解析和转换。**

```
df.printSchema()
df.withColumn()
df.withColumnRenamed()
df.sort(col_name1.asc() , col_name.desc())
df.gropuby().agg(sum(), ave(),..).where( col('name')> 100)  # agg 可以同时使用多个聚合函数
df.filter() # 选择 select
df.filter("city == 'beijing' and ctr > 0.2").show() 支持字符串 
dropna() 删除空行
explode（col_name） # 该行拆成多行

DataFrame 的函数
Action 操作
1、 collect() ,返回值是一个数组，返回dataframe集合所有的行
2、 collectAsList() 返回值是一个java类型的数组，返回dataframe集合所有的行
3、 count() 返回一个number类型的，返回dataframe集合的行数
4、 describe(cols: String*) 返回一个通过数学计算的类表值(count, mean, stddev, min, and max)，这个可以传多个参数，中间用逗号分隔，如果有字段为空，那么不参与运算，只这对数值类型的字段。例如df.describe("age", "height").show()
5、 first() 返回第一行 ，类型是row类型
6、 head() 返回第一行 ，类型是row类型
7、 head(n:Int)返回n行  ，类型是row 类型
8、 show()返回dataframe集合的值 默认是20行，返回类型是unit
9、 show(n:Int)返回n行，，返回值类型是unit
10、 table(n:Int) 返回n行  ，类型是row 类型

dataframe的基本操作
1、 cache()同步数据的内存
2、 columns 返回一个string类型的数组，返回值是所有列的名字
3、 dtypes返回一个string类型的二维数组，返回值是所有列的名字以及类型
4、 explan()打印执行计划  物理的
5、 explain(n:Boolean) 输入值为 false 或者true ，返回值是unit  默认是false ，如果输入true 将会打印 逻辑的和物理的
6、 isLocal 返回值是Boolean类型，如果允许模式是local返回true 否则返回false
7、 persist(newlevel:StorageLevel) 返回一个dataframe.this.type 输入存储模型类型
8、 printSchema() 打印出字段名称和类型 按照树状结构来打印
9、 registerTempTable(tablename:String) 返回Unit ，将df的对象只放在一张表里面，这个表随着对象的删除而删除了
10、 schema 返回structType 类型，将字段名称和类型按照结构体类型返回
11、 toDF()返回一个新的dataframe类型的
12、 toDF(colnames：String*)将参数中的几个字段返回一个新的dataframe类型的，
13、 unpersist() 返回dataframe.this.type 类型，去除模式中的数据
14、 unpersist(blocking:Boolean)返回dataframe.this.type类型 true 和unpersist是一样的作用false 是去除RDD

集成查询：
1、 agg(expers:column*) 返回dataframe类型 ，同数学计算求值
df.agg(max("age"), avg("salary"))
df.groupBy().agg(max("age"), avg("salary"))
2、 agg(exprs: Map[String, String])  返回dataframe类型 ，同数学计算求值 map类型的
df.agg(Map("age" -> "max", "salary" -> "avg"))
df.groupBy().agg(Map("age" -> "max", "salary" -> "avg"))
3、 agg(aggExpr: (String, String), aggExprs: (String, String)*)  返回dataframe类型 ，同数学计算求值
df.agg(Map("age" -> "max", "salary" -> "avg"))
df.groupBy().agg(Map("age" -> "max", "salary" -> "avg"))
4、 apply(colName: String) 返回column类型，捕获输入进去列的对象
5、 as(alias: String) 返回一个新的dataframe类型，就是原来的一个别名
6、 col(colName: String)  返回column类型，捕获输入进去列的对象
7、 cube(col1: String, cols: String*) 返回一个GroupedData类型，根据某些字段来汇总
8、 distinct 去重 返回一个dataframe类型
9、 drop(col: Column) 删除某列 返回dataframe类型
10、 dropDuplicates(colNames: Array[String]) 删除相同的列 返回一个dataframe
11、 except(other: DataFrame) 返回一个dataframe，返回在当前集合存在的在其他集合不存在的
12、 explode[A, B](inputColumn: String, outputColumn: String)(f: (A) ⇒ TraversableOnce[B])(implicit arg0: scala.reflect.api.JavaUniverse.TypeTag[B]) 返回值是dataframe类型，这个 将一个字段进行更多行的拆分
df.explode("name","names") {name :String=> name.split(" ")}.show();
将name字段根据空格来拆分，拆分的字段放在names里面
13、 filter(conditionExpr: String): 刷选部分数据，返回dataframe类型 df.filter("age>10").show();  df.filter(df("age")>10).show();   df.where(df("age")>10).show(); 都可以
14、 groupBy(col1: String, cols: String*) 根据某写字段来汇总返回groupedate类型   df.groupBy("age").agg(Map("age" ->"count")).show();df.groupBy("age").avg().show();都可以
15、 intersect(other: DataFrame) 返回一个dataframe，在2个dataframe都存在的元素
16、 join(right: DataFrame, joinExprs: Column, joinType: String)
一个是关联的dataframe，第二个关联的条件，第三个关联的类型：inner, outer, left_outer, right_outer, leftsemi
df.join(ds,df("name")===ds("name") and  df("age")===ds("age"),"outer").show();
17、 limit(n: Int) 返回dataframe类型  去n 条数据出来
18、 na: DataFrameNaFunctions ，可以调用dataframenafunctions的功能区做过滤 df.na.drop().show(); 删除为空的行
19、 orderBy(sortExprs: Column*) 做alise排序
20、 select(cols:string*) dataframe 做字段的刷选 df.select($"colA", $"colB" + 1)
21、 selectExpr(exprs: String*) 做字段的刷选 df.selectExpr("name","name as names","upper(name)","age+1").show();
22、 sort(sortExprs: Column*) 排序 df.sort(df("age").desc).show(); 默认是asc
23、 unionAll(other:Dataframe) 合并 df.unionAll(ds).show();
24、 withColumnRenamed(existingName: String, newName: String) 修改列表 df.withColumnRenamed("name","names").show();
25、 withColumn(colName: String, col: Column) 增加一列 df.withColumn("aa",df("name")).show();
pyspark.sql.functions里有许多常用的函数，可以满足日常绝大多数的数据处理需求
df.show()  df.count()  df.printSchema() df.columns df.dtypes
df.select()
df.age.alias('new_name','name')
df.filter() #筛选
F.lit() 增加常数列
df.drop_duplicates()
df.distinct()
df.drop('id') # 删除列
df.dropna(subset=['age', 'name'])  # 传入一个list，删除指定字段中存在缺失的记录
df.fillna({'age':10,'name':'abc'})  # 传一个dict进去，对指定的字段填充
df.groupby('name').agg(F.max(df['age']))
df.select(F.max(df.age))
df.select(F.min(df.age))
df.select(F.avg(df.age)) # 也可以用mean，一样的效果
df.select(F.countDistinct(df.age)) # 去重后统计
df.select(F.count(df.age)) # 直接统计，经试验，这个函数会去掉缺失值会再统计

from pyspark.sql import Window
df.withColumn("row_number", F.row_number().over(Window.partitionBy("a","b","c","d").orderBy("time"))).show() # row_number()函数
```

```
key  v 
rdd2 =rdd1.map(lambda v: (v.genre, int(v.num_of_sales))).reduceByKey(lambda x, y: x + y).collect()  # collect 返回的是 []
json.dumps(rdd2)
# 注意reducebykey  x,y : x+y    都是 value 

# 两个列求和 
 keyv-> []
rdd.map(lambda v: (int(v.year_of_pub),  [ int(v.num_of_tracks), 1] ))\
.reduceByKey(lambda x, y: [x[0] + y[0], x[1] + y[1]]).sortByKey()
 = res = [k ,v]
list(map(lambda v: v[0], result))
list(map(lambda v: v[1][0], result))
list(map(lambda v: v[1][1], result))

 key ()  元组v 
rdd.map(lambda v: ( (v.genre, int(v.year_of_pub)), int(v.num_of_sales)))\
.reduceByKey(lambda x, y: x + y).sortByKey().collect()

#多列 聚合操作  
rdd.map(lambda v: (v.genre, (float(v.rolling_stone_critic), float(v.mtv_critic), float(v.music_maniac_critic), 1)))\
.reduceByKey(lambda x, y : (x[0] + y[0], x[1] + y[1], x[2] + y[2], x[3] + y[3]))\
.map(lambda v: (v[0], v[1][0]/v[1][3], v[1][1]/v[1][3], v[1][2]/v[1][3])).collect()

```

### spark sql

```
import pyspark.sql.functions as f
f.split(df['categories'], ',') # f
1: withColumn()
使用带有列的PySpark更改列DataType df.withColumn(x, df[x].cast('int'))
更新现有列的值  df.withColumn( "newDate",split(df['Date'], " ")[0] ).drop("Date")
从现有的创建新列
2:重命名列名
df.withColumnRenamed()  df = df.withColumnRenamed('old_name','new_name')
df.drop()
# 创建临时表
3df.createOrReplaceTempView('table_name')

4:explode 将列数据展开
[a,b,[1,2]]
[a,b,1]
[a,b,2]

5：from pyspark.sql.functions import regexp_replace
df.withColumn('address', regexp_replace('address', 'Rd', 'Road')) \
  .show(truncate=False)
6： 写在本地
df.write.parquet("file:///home/hadoop/wangyingmin/yelp-etl/business_etl", mode="overwrite")
df.write.json(path, model)
df = spark.read.parquet(data_path).cache()

def read_json(file_path):
    json_path_names = os.listdir(file_path)
    data = []
    for idx in range(len(json_path_names)):
        json_path = file_path + '/' + json_path_names[idx]
        if json_path.endswith('.json'):
            with open(json_path) as f:
                for line in f:
                    data.append(json.loads(line))
    return data
df = read_json(path)

# 读取json 文件 dataframe
spark.read.csv("input/earthquake_cleaned.csv",  header=True, inferSchema=True)
df.toPandas().to_csv("earthquakeC.csv", encoding='utf-8', index=False)
df.groupBy("Year").count().orderBy("Year")
# 过滤
df.filter("Area is not null")
#排序
df.sort(df["Magnitude"].desc(), df["Year"].desc()).take(500)
#当震源深度相同时，将震级更高的地震排在前面。
df.sort( df["Depth"].desc(), df["Magnitude"].desc() ).take(500)
# 取别名 alias
rawData.agg(*[count(c).alias(c) for c in rawData.columns]).show()

df['y'] # 取值 [0,1]
df_age = df.select(df['age'],df['y'])
bin = [0,30,45,60,75,100]
# 统计各个年龄段 0的人数
df_age.filter(df['age'].between(bin[i],bin[i+1])).filter(df['y']=='0').count()


# 月收入分析
df_income = df.select(df['MonthlyIncome'],df['y'])
# 获取平均值，其中先返回Row对象，再获取其中均值
mean_income = df_income.agg(functions.avg(df_income['MonthlyIncome'])).head()[0]
# 收入分布，105854人没超过均值6670，44146人超过均值6670
df_income.filter(df['MonthlyIncome'] < mean_income).count()

df.select("Job").distinct().show(truncate=False)
df.dropDuplicates((['Job'])).select("Job").show(truncate=False)
```

### dataframe:

```
fields = [ StructField("date", DateType(),False),StructField("county", StringType(),False),StructField("deaths", IntegerType(),False),]  # false 不能为空
schema = StructType(fields)

# flagMap  对集合中每个元素操作  ，在扁平化  [ [a,b],[a,d]] -> [a ,b,a,d]
# map    对集合中每个元素操作  [ [a,b],[a,d]] -> [[a,b],[a,d]]
df.select(field).filter(mdf[field] != '').rdd.flatMap(lambda g: [(v, 1) for v in map(lambda x: x['name'], json.loads(g[field]))])

df = df.filter(df.price != '面议').withColumn("price",df.price.cast(IntegerType()))

# 对多列进行不同的聚合操作, 并修改相应的列名
df.groupBy('job').agg(
    F.sum("salary").alias("sum_salary"),
    F.avg("salary").alias("avg_salary"),
    F.min("salary").alias("min_salary"),
    F.max("salary").alias("max_salary"),
    F.mean("salary").alias("mean_salary")
).show(truncate=False)      # truncate=False：左对齐

df.agg(F.sum("rain1h").alias("rain24h")).sort(F.desc("rain24h")

df_rain_sum.coalesce(1).write.csv("file:///home/analyse.csv")
df = spark.read.csv(filename,header = True)

F.date_format(df['time'],"yyyy-MM-dd").alias("date")
F.hour(df['time']).alias("hour")

                                              
df.filter(df['hour'].isin([2,8,12,20]))
                                              
F.format_number('avg_temperature',1)                                            

```

```
key  v 
rdd2 =rdd1.map(lambda v: (v.genre, int(v.num_of_sales))).reduceByKey(lambda x, y: x + y).collect()  # collect 返回的是 []
json.dumps(rdd2)
# 注意reducebykey  x,y : x+y    都是 value 

# 两个列求和 
 keyv-> []
rdd.map(lambda v: (int(v.year_of_pub),  [ int(v.num_of_tracks), 1] ))\
.reduceByKey(lambda x, y: [x[0] + y[0], x[1] + y[1]]).sortByKey()
 = res = [k ,v]
list(map(lambda v: v[0], result))
list(map(lambda v: v[1][0], result))
list(map(lambda v: v[1][1], result))

 key ()  元组v 
rdd.map(lambda v: ( (v.genre, int(v.year_of_pub)), int(v.num_of_sales)))\
.reduceByKey(lambda x, y: x + y).sortByKey().collect()

#多列 聚合操作  
rdd.map(lambda v: (v.genre, (float(v.rolling_stone_critic), float(v.mtv_critic), float(v.music_maniac_critic), 1)))\
.reduceByKey(lambda x, y : (x[0] + y[0], x[1] + y[1], x[2] + y[2], x[3] + y[3]))\
.map(lambda v: (v[0], v[1][0]/v[1][3], v[1][1]/v[1][3], v[1][2]/v[1][3])).collect()

```

![1750253900372](/knowledge-assets/big-data/image/1-spark/1750253900372.png)

## 数据分类

![1750253935735](/knowledge-assets/big-data/image/1-spark/1750253935735.png)

**总结：**

* **RDD** 主要用于处理非结构化数据 、半结构化数据、结构化；
* **SparkSQL** 是一个既支持 SQL 又支持命令式数据处理的工具；
* **SparkSQL** 主要用于处理结构化数据(较为规范的半结构化数据也可以处理)。

Spark SQL数据抽象可以分为两类：

① DataFrame：DataFrame 是一种以 RDD 为基础的分布式数据集，类似于传统数据库的二维表格，带有 Schema 元信息(可以理解为数据库的列名和类型)。DataFrame = RDD ＋ 泛型 + SQL 的操作 + 优化

② DataSet：DataSet是DataFrame的进一步发展，它比RDD保存了更多的描述信息，概念上等同于关系型数据库中的二维表，它保存了类型信息，是强类型的，提供了编译时类型检查。调用 Dataset 的方法先会生成逻辑计划，然后被 spark 的优化器进行优化，最终生成物理计划，然后提交到集群中运行！DataFrame = Dateset[Row]

![1750253992466](/knowledge-assets/big-data/image/1-spark/1750253992466.png)

* DataFrame = RDD - 泛型 + Schema + SQL + 优化
* DataSet = DataFrame + 泛型
* DataSet = RDD + Schema + SQL + 优化

- DataFrame 和 DataSet 都可以通过RDD来进行创建；
- 也可以通过读取普通文本创建–注意:直接读取没有完整的约束，需要通过 RDD+Schema；
- 通过 josn/parquet 会有完整的约束；
- 不管是 DataFrame 还是 DataSet 都可以注册成表，之后就可以使用 SQL 进行查询了! 也可以使用 DSL

![1750584043035](/knowledge-assets/big-data/image/1-spark/1750584043035.png)

![1750584677837](/knowledge-assets/big-data/image/1-spark/1750584677837.png)

![1750584699501](/knowledge-assets/big-data/image/1-spark/1750584699501.png)



Job :  每1个行动算子，产生1个 Job

1个application-> n job-> n-stage->task

https://tech.meituan.com/2016/05/12/spark-tuning-pro.html

https://blog.csdn.net/Javachichi/article/details/131871627

https://www.cnblogs.com/skaarl/p/13960639.html

https://blog.csdn.net/Javachichi/article/details/131871627
