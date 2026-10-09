---
title: 'LLM :'
description: >-
  Shortcome: （LLM 没有长期记忆，但是工程需要长期记忆） 无持久化记忆，每次对话都是新的 ，所有AI 无法成长 context window
  有限， 超过 length ,token 就忘 不会复盘，错误不会自动修复
date: '2026-03-14'
area: AI Agent
tags: []
language: zh-CN
draft: false
---
# LLM :
Shortcome: （LLM 没有长期记忆，但是工程需要长期记忆）
- 无持久化记忆，每次对话都是新的 ，所有AI 无法成长
- context window 有限， 超过 length ,token 就忘
- 不会复盘，错误不会自动修复

Ai 系统的架构 逐渐从Prompt Engineering ， 演进到Memory Enginerring ,并最终走向 Self-Improving Agent 
核心问题： AI 具体长期经验 （Experience）


Ai Agent 的能力大致如下6个阶段

```
    Prompt Engineering 
    RAG (Retrieval Augmentd Generation)
    Memeory Engineering 
    Memory Graph 
    Self-Evolving Memory 
    Connitive Agent Memory 
```

## 第一阶段： Prompt Engineering 
核心思想： 通过精心设计Prompt 来控制LLM 行为
Architecture
```
    User  Input :
    Prompt Template
    LLM
    Response 
```
Advantage： 
1. 不需要额外系统 （简单）
2. 直接调用LLM （快速）
3. 可控 （可控制输出格式）
Disagvantge:
1. 没有长期记忆， 经验不可累计（每次对话都是新的）
2. 无法学习， 不会从历史中学习
3. 无法个性化， 不知道项目规则
4. 无法复盘 ，无法总结经验


## RAG 阶段
让LLM可以查询外部知识库

Query ->Vector  Search-> Relevant Documents->LLM->Answer
```
    User Query 
    Embedding 
    Vector Database 
    Relevant context 
    LLM
    Response
```
向量数据库：
1. Qdrant
2. Weaviate
3. Milvus 
4. PG /ES

Advantage :
1. 接入企业知识 
2. 减少幻觉
3. 支持私有化数据

本质： 静态知识库

Disadvantage：
1. 不会学习新的经验， 只读知识
2. 不会记录任务， 不知道发生过什么
3. 没有技能系统，不会形成workflow 


## Memory Engineering 

核心思想：让AI记录历史任务和经验

Task ->Memory Storage -> Feture Tasks use Memory 

Memeory 分类：
1. short-memory 当前对话
2. long-term memory 历史经验
3. project memory 项目规则
4. user memory 用户偏好

```
    user task 
    agent 
    tools
    observations
    memory store 
```
memory 会被用于 context retrieval 

Advantage :
1. Ai 记住项目， 项目知识
2. 避免重复错误， 经验复用
3. 个性化行为，用户习惯

Disadvantage：
1. memory 没有结构
eg: error1 ,error2, error3
系统很难判断这些错误是否相关


## Memory Graph 

将 memory 组织为图结构 Graph 

task ->tool ->observation->knowledge ->skills


Graph Database :
- Neo4j 
- TigerGraph
- ArangDB


```
    Taks : deploy Service 
    Tool : kubectl apply 
    Observation : imagePullbackoff
    Knowledge : private registry login required
    Skill : kubernets deployment workflow 

```

Memory Graph 仍然是： 被动系统
AI 仍然不会：
1. 自动总计经验
2. 自动升级技能
3. 自动生成workflow 


## Self-Evolving Memory 

核心思想： memory 可以自动进化

Observation -> lesson -> pattern ->skill->Automation 

``` 
    Agent Execution
    Observations
    Learning Extractor
    Pattern Detector
    Skill Generator 
    Automation Builder
```
Advantage :
1. 自动学习， 不需要人工总结
2. 形成技能， workflow
3. 减少错误， 经验复用


## Cognitive Agent Architecture 

核心思想： 模拟人类认知系统

核心模块：
1. Working Memory  当前任务
2. long-tern Memory 历史经验
3. Planner 任务规划
4. Reasoner 推理
5. Reflection 自我反思

```
    User Task 
    Planner 
    Tool Execution 
    Observations
    Reflection 
    Memory Update
```
形成： Learning Loop




















# RAG （Retrieve-Augmented Generation）

```
    user question 

    vecotr search 

    Retrieve Documents

    LLM Answer

```
解决问题
1. 知识过期
2. 模型不知道公司的知识
没有解决问题：
1. 模型依旧犯错
2. 模型不会成长

RAG 是静态知识， 不会学习， 不会改变行为。 不会积累经验





# Agent Memory Architecture 

4 layer memory architecuture 演变

```
System Prompt (核心规则)

project memory (项目知识)

Learning Logs (.learning)

Conversation (当前对话)

```



## version 1

```
  LLM (reasoning engine )

  Tools (shell /git / code)

  Memory (project knowledge)  

  Skills  (reusable expertise)

```

## version 2  (learnging loop architecture)

```
  Observe  （执行）

  Error or Feedback 

  Learn (记录经验)

  Update Rules 更新记忆

  Next Task (行为改进)

```
这就是 .learnings 系统在做的事情

openclaw
```
   system rules  (soul / claude)

   project memeory  (项目知识库)

   Learning Logs (.learning)

   Observations (tool outputs)

   Current Task (conversation)

```

一个完整的Learning Loop 有4个核心的模块


1. Observation Layer  负责记录
2. Learning Engine  负责分析
3. Pattern Detection 模式识别，检测错误，升级为rule-> skills 
4. memeory promotion  

self-improving agent 


## Version 3 

```
  LLM (reasoing +planning )

  Tools (shell /code / cloud)

  Memory (vector + log + rules)

  Skills  (reusable expertise)

  Learning Loop  (observe + improve)

```


## version 4

Knowledge Flywheel 知识飞轮

让AI 使用越多， 系统越聪明， 而不是越来越混乱

小改进不断累计，最终产生指数级的增长

use -> 产生数据 -> 体验经验-> 改进系统-> 更好使用

```
  User Tasks 

  Agent Execution 

  Observation (logs)

  Learnings 

  Rules / skiils 

  Better Agents

  More tasks 
  
```
Ai 自增强系统

```
    User Tasks  (用户真实任务)

    Agent Execuation  （执行代码 /工具）

    Observation （Logs / errors）

    Learnings (.learning files)

    Rules /Skiils (agent behavior)

    Imporved Agent （更强的Ai 能力)

```
Raw Data -> Error -> Learning -> Rule -> Skill 


Flywheel VS RAG 

RAG = 外部知识
Flywheel = 内部经验


## Version 5:
```
    LLM reasoning 

    Tools (shell / git /code)

    Rag (company docs)

    Memeory Logs (.learning )

    Knowledge loop learning engine  

```

challenge ：
memory explosion : 
1. 去重
2. 模式检测
3. 规则升级
4. 自动清理

knowledge Flywheel 本质是： 把Ai 的每一使用，都变成训练数据，最终实现： 
1. Ai 越用越强
2. 团队经验不会丢失
3. 系统自动进化


## Version 6

```
    Procedural skills 

    Semantic Knowledge 

    Episodic Task History 

    Observations logs / output

Architcture 

    LLM  reasoning engine 

    Tools  (shell / git / k8s) 

    Memory (episodic / semantic / procedural)

    Learning Loop (self-imporvement)
```

经验->知识-> 技能
会学习，会记忆，会改进行为  (self-improving agent)


## Version 7 


```
        LLM  reasoning

        Planner  

        Observations 

        Learning Engine

        Memory Graph 

pattern Engine   Skill Engine 
    
    Patterns        Skills
            Automation

```
未来Ai agent 的真正能力 来自 experience 而不是 model paramters （ 经验> 模型）

人类工程成长路径：
    看文档-> 做任务-> 踩坑-> 总结经验-> 形成技能-> 自动化流程

未来最强的Ai Enginner System :
LLM + Tools + memory graph + self-evolving Learning (autonomout enginner system)
3 大核心 inf:
1. Planner
2. tool system 
3. Memory System 





Ai Agent 架构进化

1. Prompt Engineering 
2. RAG (Qdrant, Milvus)
3. Memory Engineering (short-memory , long-term memory , project memory , user memory )
4. Memory Graph 
5. Self-Evolving Memory 
6. Cognitive Agent Architecture 











# Prompt 
Problem 
1. 不可累计（新的对话）
2. 不可个性化 （不同项目规则不同）
3. 不会成长 （promt 是静态的）




# Agent memory 

1. Episodic memeory (情景记忆，事件记忆)
2. semantic memory  （语义记忆、知识记忆）
3. procedural memeory   （程序记忆，技能记忆）

认知科学(Cogntive Science)

Ai 系统的映射：

memory      AI对应      example
Episodic    任务日志    .learnings
Semantic    知识库      RAG /docs
Procedural  行为规则    agent skills


structure :

```
                Agent Memory System

        Episodic   Semantic    Procedural
        经验        知识         技能
```

Episodic Memroy : Agent task 历史 ，在工程系统中通常是， .learning (logs task history)
Semantic Memory: AI 知识库
Procedural Memoery :  skills 

3种memory 的关系：
Episodic -> Semantic -> procedural 
- Episodic : 多个任务发现同一事实 （semantic）
- Episodic:  多个任务发现同一个操作  (procedural)
- sematntic -> procedural  知识变成技能


不同的AI系统实现方式：
System      Episodic        Semantic    Procedural 
AI IDE      logs            repo docs   workflows
chat agent  conversation    RAG         tools
Coding agent   task history codebase    skills



















# Question 
## 1. 为什么设计成markdown 
learning.md 
errors.md
feature_requests.md
1. llm 非常擅长读取markdown 
2. 可被git 管理
3. 人类也能读取
## Ai 缺点

1. 没有经验
2. 没有技能， 只能单步推理
3. 没有成长，不会越来越强






## experice how to imporve rules 
learning ->rule -> skills 
升级： 错误发生-> 记录 learning -> 重复出现-> 升级规则->写入 agent prompt

## experice improve skill 

当某个经验非常通用，就升级成 agent skill 


## 为什么未来 Ai Agent 的核心不是RAG , 而是 Learning loop Architecture 

observe -> learning -> update prompt -> improve behavior 


## 未来Ai Agent 的真正竞争力

1. model scale 
2. 模型的通用能力
3. 团队经验 ->飞轮








# Ai coding IDE 

Ai soft enginerr 必须有3件东西（知识 ，经验 ，复盘）

Ai agent architecture :  LLM (tools, memory , skills)

现在Ai coding 工具都在做， Long-term agent memory 

















