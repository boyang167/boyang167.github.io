---
title: Transaction
description: Local Transaction
date: '2026-03-02'
area: Web
tags: []
language: zh-CN
draft: false
---
# Transaction

## Local Transaction

AICD

本地事务即传统的单机数据库事物，必须具备ACID 原则

A ： acid  原子性 ，要么全部完成，要么全部不做，不存在中间状态。如果事务在执行中发生错误，则所有的操作都会被回滚，整个事务就像从没被执行过一样。

C ： consistency  一致性

I ： isolation  隔离性

隔离性是指事务与事务之间不会互相影响，一个事务的中间状态不会被其他事务感知。数据库保证隔离性包括四种不同的隔离级别：

* Read Uncommitted（读未提交）
* Read Committed（读已提交）
* Repeatable Read（可重复读）
* Serializable（[串行化](https://zhida.zhihu.com/search?content_id=183265184&content_type=Article&match_order=1&q=%E4%B8%B2%E8%A1%8C%E5%8C%96&zhida_source=entity)）

D  *持久性（D）：*

* **未提交读（READ UNCOMMITTED）** ：所有事务都可以看到其他事务未提交的修改。一般很少使用；
* **提交读（READ COMMITTED）** ：Oracle默认隔离级别，事务之间只能看到彼此已提交的变更修改；
* **可重复读（REPEATABLE READ）** ：MySQL默认隔离级别，同一事务中的多次查询会看到相同的数据行；可以解决不可重复读，但可能出现幻读；
* **可串行化（SERIALIZABLE）** ：最高的隔离级别，事务串行的执行，前一个事务执行完，后面的事务会执行。读取每条数据都会加锁，会导致大量的超时和锁争用问题；

![1768312466182](/knowledge-assets/web/image/transaction/1768312466182.png)




本地事务以mysql为例，[原子性](https://zhida.zhihu.com/search?content_id=183265184&content_type=Article&match_order=3&q=%E5%8E%9F%E5%AD%90%E6%80%A7&zhida_source=entity)和持久性是靠undo和redo日志来实现的。

undo 日志：

事务具备原子性（Atomicity），如果事务执行失败，需要把数据回滚，原子性则使用undo log来实现。

undo log为了满足事务的原子性，在操作任何数据之前，首先将[数据备份](https://zhida.zhihu.com/search?content_id=183265184&content_type=Article&match_order=1&q=%E6%95%B0%E6%8D%AE%E5%A4%87%E4%BB%BD&zhida_source=entity)

到undo log。然后进行数据的修改。如果出现了错误或者用户执行了roolback语句，系统可以利用undo log中的备份将[数据恢复](https://zhida.zhihu.com/search?content_id=183265184&content_type=Article&match_order=1&q=%E6%95%B0%E6%8D%AE%E6%81%A2%E5%A4%8D&zhida_source=entity)到事务开始之前的状态。

**redo日志**： 


| 特性         | Redo 日志                      | Undo 日志                               |
| ------------ | ------------------------------ | --------------------------------------- |
| 日志类型     | 物理日志（记录页的修改）       | 逻辑日志（记录如何撤销操作）            |
| 主要用途     | 崩溃恢复、保证持久性           | 事务回滚、MVCC                          |
| 是否写入磁盘 | 是（关键路径，可配置刷盘策略） | 是（作为表空间的一部分）                |
| 是否循环使用 | 是（固定大小日志文件循环覆盖） | 否（由 Purge 线程清理）                 |
| 恢复阶段作用 | 前滚（Roll Forward）           | 回滚未提交事务（Roll Back）             |
| 与事务的关系 | 提交时必须写入（取决于配置）   | 事务开始即生成，提交后可能保留用于 MVCC |


|        | Redo 日志                  | Undo 日志                                |
| ------ | -------------------------- | ---------------------------------------- |
| 干什么 | 记“做了什么”，防止丢数据 | 记“怎么撤销”，能反悔或看历史           |
| 像什么 | 小票/记账本                | 后悔药 + 时光机                          |
| 崩溃后 | 重做已提交的事（前滚）     | 回滚未提交的事（后退）                   |
| 保证   | 持久性（Durability）       | 原子性 + 隔离性（Atomicity & Isolation） |

* **Redo Log（重做日志）** **：**
  ➤ **防丢数据** —— 确保**已提交的事务**即使系统崩溃也不会丢失。
  ➤ 实现  **持久性（Durability）** **。**
* **Undo Log（回滚日志）** **：**
  ➤ **能反悔 + 能看过去** —— 支持**事务回滚**和 **多版本并发读（MVCC）** **。**
  ➤ 实现 **原子性（Atomicity）** 和 **隔离性（Isolation）**


| 项目         | Redo Log                                           | Undo Log                                  |
| ------------ | -------------------------------------------------- | ----------------------------------------- |
| 作用         | 崩溃恢复，重做已提交的操作                         | 事务回滚 + MVCC（读历史版本）             |
| 日志类型     | 物理日志（记录“页怎么改”）                       | 逻辑日志（记录“如何撤销”）              |
| 写入时机     | 事务修改时就写（WAL机制）                          | 修改前先写旧值                            |
| 存储位置     | 独立日志文件（如 `ib_logfile0`）                 | Undo 表空间（共享表空间或独立 undo 文件） |
| 是否循环使用 | 是（固定大小，覆盖旧日志）                         | 否（由 Purge 线程异步清理）               |
| 崩溃恢复角色 | 前滚（Roll Forward）                               | 回滚未提交事务（Roll Back）               |
| 是否影响性能 | 刷盘策略可调（`innodb_flush_log_at_trx_commit`） | 本身也产生 Redo（因 Undo 也是数据修改）   |

1. **事务开始 → 分配事务 ID。**
2. **修改数据前 → 先把** **旧值写入 Undo Log** **。**
3. **修改数据 → 同时将** **新值的物理变更写入 Redo Log Buffer** **。**
4. **事务提交 → **
   * **Redo Log 刷盘** **（根据配置）→ 保证持久性；**
   * **Undo Log 标记为可清理** **（但暂不删，供 MVCC 使用）。**
5. **系统崩溃重启 → **
   * **用 ****Redo Log 前滚**所有已提交事务；
   * **用 ****Undo Log 回滚**未提交事务。

> **Redo 防丢，Undo 能撤；
> Redo 物理保持久，Undo 逻辑支回滚与 MVCC；
> 提交靠 Redo，读历史靠 Undo；
> 两者配合，ACID 才稳！**
>

在多个事务并发操作时，数据库中会出现下面三种问题： **脏读，幻读，不可重复读** 。

事务A读到了事务B还未提交的数据：

事务A在读取某些数据后，再次读取该数据，发现读出的该数据已经在事务B中发生了变更或删除。

## Distrubued Transaction

### CAP 定理

* 一致性（Consistency）
* 可用性（Availability）
* 分区容错性（Partition tolerance）

一致性和可用性的矛盾

### Base 理论

* Basically Available（基本可用）
* Soft state（软状态）
* Eventually consistent（最终一致性）

CP方式：现在如果要满足事务的强一致性，就必须在订单服务数据库锁定的同时，对[库存服务](https://zhida.zhihu.com/search?content_id=183265184&content_type=Article&match_order=2&q=%E5%BA%93%E5%AD%98%E6%9C%8D%E5%8A%A1&zhida_source=entity)* 、用户服务数据资源同时锁定。等待三个服务业务全部处理完成，才可以释放资源。此时如果有其他请求想要操作被锁定的资源就会被阻塞，这样就是满足了CP，这就是强一致，弱可用

AP方式：三个服务的对应数据库各自独立执行自己的业务，执行本地事务，不要求互相锁定资源。但是这个中间状态下，我们去访问数据库，可能遇到数据不一致的情况，不过我们需要做一些后补措施，保证在经过一段时间后，数据最终满足一致性，这就是高可用，但弱一致（最终一致）。


由上面的两种思想，延伸出了很多分布式事务解决方案：

* XA
* TCC
* 可靠消息最终一致
* AT




## Distributed Transaction 

出现场景
1. 跨进程
2. 跨数据库实例
3. 多服务访问同一实例
核心挑战：
1. 网络的不确定性，分布式系统中的网络延迟，分区，消息丢失
2. 性能瓶颈： 全局锁和同步阻塞导致系统吞吐量下降



数据库的垂直拆分：

将不同业务表拆分到不同数据库中，这就进入了分布式事务的领域。
1. 后置提交策略
实现原理：
- 在所有参与数据库上执行SQL但不提交
- 如果所有SQL执行成功，则逐个提交各数据库事务
- 如果任何SQL执行失败，则回滚所有数据库事务

```
// 数据库1：账户库
Connection conn1 = db1.getConnection();
conn1.setAutoCommit(false);
// 数据库2：交易库  
Connection conn2 = db2.getConnection();
conn2.setAutoCommit(false);

try {
    // 第一步：在所有数据库上执行SQL但不提交
    stmt1 = conn1.prepareStatement("UPDATE account SET balance=balance-100 WHERE user_id='小张'");
    stmt1.executeUpdate();
    
    stmt2 = conn2.prepareStatement("INSERT INTO transaction(from_user,to_user,amount) VALUES('小张','小丽',100)");
    stmt2.executeUpdate();
    
    // 第二步：全部执行成功后，逐个提交
    conn1.commit();
    conn2.commit();
} catch (Exception e) {
    // 任何一步失败则回滚所有
    conn1.rollback();
    conn2.rollback();
    throw e;
}

```
异常处理：

    SQL执行阶段异常：可以回滚所有数据库事务
    提交阶段异常：如果第一个事务提交成功但第二个失败，会导致数据不一致

优点：

    比简单的"执行-立即提交"模式更能保证一致性
    实现相对简单

缺点：

    提交阶段出现异常时无法保证一致性
    事务持有时间较长，影响并发性能
后置提交策略的潜在问题

```
[协调者]       [DB1]        [DB2]
  |-- BEGIN -->|
  |-- UPDATE小张-->|
  |-- BEGIN -->|
  |-- INSERT交易记录-->|
  |-- COMMIT DB1-->| (成功)
  |-- COMMIT DB2-->| (失败!) 
  // 此时DB1已提交无法回滚，数据不一致

```

为解决后置提交的缺陷，计算机科学家们提出了两阶段提交协议(2PC)，这成为分布式事务的经典解决方案。

两阶段提交协议通过引入准备阶段来解决后置提交的问题。

2PC :
image.png



