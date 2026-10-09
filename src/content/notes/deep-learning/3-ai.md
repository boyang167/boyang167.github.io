---
title: KG
description: entity
date: '2025-03-13'
area: Deep Learning
tags: []
language: zh-CN
order: 3
draft: false
---
# KG

entity 

mention : 提及

entity linking : 实体链接 把文本中的mention 链接到KG

mention variations : 同一实体有不同的mention 

​	eg: 唐僧 （实体） ->(唐僧，唐三藏，金蝉子，玄奘，长老，唐玄奘)

entity ambiguity : 同一mention 对应不同 实体

​	eg: 迈克尔乔丹  （机器学习的一位开山鼻祖， 美国篮球运动员）

~~~
<实体1 ，关系，实体>
<实体，属性，属性值>
~~~



<img src="img/image-20230326101826622.png" alt="image-20230326101826622" style="zoom: 25%;" />



> **Missing image resource:** `2-deep-learning/img/image-20230326102027835-1716637414166.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102050147-1716637414167.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102240844-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102331070-1716637414168.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326102537368-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102557064-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102618179-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102649495-1716637414168.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326102703489-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102739298-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326102804926-1716637414168.png`

## 知识表示

~~~~
知识图谱基础之RDF，RDFS与OWL
    Subject 可以是IRI或者Blank NodePredicate必须是IRIObject三种都可以
RDF : Resource Description Framework 
	N-Triples
	Turtle
	
Resource Description Framework Schema: RDFS 

RDFS/OWL本质上是一些预定义词汇（vocabulary）构成的集合，用于对RDF进行类似的类定义及其属性的定义。
### 这里我们用词汇rdfs:Class定义了“人”和“地点”这两个类。
:Person rdf:type rdfs:Class.
:Place rdf:type rdfs:Class.

### rdfs当中不区分数据属性和对象属性，词汇rdf:Property定义了属性，即RDF的“边”。
:chineseName rdf:type rdf:Property;
        rdfs:domain :Person;
        rdfs:range xsd:string .

rdfs:Class 
rdfs:domian   用于表示该属性属于哪个类别。
rdfs:range 用于描述该属性的取值类型。
rdfs:subClassof
rdfs:subProperty
rdfs:type


RDFS ： top level 
模式层：
rdfs:Class rdfs:Property rdfs:Literal 
define : vocabulary  
数据层：
data :



Web Ontology Language(owl):
### owl区分数据属性和对象属性（对象属性表示实体和实体之间的关系）。词汇owl:DatatypeProperty定义了数据属性，owl:ObjectProperty定义了对象属性。
property graph:

owl: 
owl:class owl:ObjectProperty owl:DatatypeProperty rdfs: Literal 


描述属性特征的词汇：
owl : TranstiveProperty 属性具有传递性质。
owl:  SymmetricProperty 属性具有对称性。
owl: FunctionalProperty 属性取值唯一性
本体映射词汇：
ontology mapping 
owl:equivalentClass 表示某个类和另一个类是相同的
owl:equivalentProperty 表示某个属性和另一个属性是相同的
owl:sameAs 表示两个实体是同一个实体



~~~~



> **Missing image resource:** `2-deep-learning/img/image-20230326103055046-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326103123099-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326103139925-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326103211221-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326103232319-1716637414168.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326103810411.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326103830310-1716637414169.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326104012149-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326104236820-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326104315197-1716637414169.png`





> **Missing image resource:** `2-deep-learning/img/image-20230326104445916-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326104742210-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326104811800-1716637414169.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326105003883-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326105356487-1716637414169.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326105711516.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326105730279.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326112042100-1716637414169.png`



> **Missing image resource:** `2-deep-learning/img/image-20230326112338886-1716637414169.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326112523930-1716637414169.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326112543623-1716637414169.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326112601279.png`

> **Missing image resource:** `2-deep-learning/img/image-20230326112731809-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327210723428-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327210859902-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327210932687-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327211013102-1716637414170.png`



> **Missing image resource:** `2-deep-learning/img/image-20230327211055288-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327211930587-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327211949168-1716637414170.png`



> **Missing image resource:** `2-deep-learning/img/image-20230327212310660-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327212433266-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327212511927-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327212554566-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327212739828-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327212938855-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327212954010-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327213058205-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327213145706-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327213233565-1716637414170.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327213342075-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327213519880-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327213655866-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230327214106721.png`







## 实体消歧

> **Missing image resource:** `2-deep-learning/img/image-20230329200649460-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329200725099-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329200842233-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329201011725-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329201108376-1716637414171.png`



> **Missing image resource:** `2-deep-learning/img/image-20230329201120886-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329201315823-1716637414171.png`



> **Missing image resource:** `2-deep-learning/img/image-20230329201448127-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329201551942-1716637414171.png`

> **Missing image resource:** `2-deep-learning/img/image-20230329201702831-1716637414171.png`



## 知识存储和检索

> **Missing image resource:** `2-deep-learning/img/image-20230329202010731-1716637414171.png`



> **Missing image resource:** `2-deep-learning/img/image-20230329202206858-1716637414171.png`



> **Missing image resource:** `2-deep-learning/img/image-20230329202734595-1716637414171.png`



> **Missing image resource:** `2-deep-learning/img/image-20230329202819066-1716637414171.png`



> **Missing image resource:** `2-deep-learning/img/image-20230329203059958-1716637414171.png`



~~~
https://www.bilibili.com/video/BV1ev4y1o7zj?p=1&share_medium=android&share_plat=android&share_source=COPY&share_tag=s_i&timestamp=1613741813&unique_k=PxZy11


https://github.com/wangle1218/KBQA-for-Diagnosis
https://www.bilibili.com/video/BV1CQ4y1z7Y6/?spm_id_from=333.788.recommend_more_video.18  point network
~~~





# Reinforcement Learning

https://www.bilibili.com/video/BV1fN41197ES/?vd_source=ae11379595599a1cedeb268c109fc9bb

https://github.com/QiangLong2017/Deep-Reiforcement-Learning

基本知识

https://blog.csdn.net/qq_41773233/article/details/114435113

https://www.zhihu.com/column/c_1358130156557664256

Reinforcement Learning 

分类：

不理解环境 Model-Free RL

理解环境  Model-Based RL



基于概率 policy-Based RL 

基于价值 Value-Based RL 



回合更新

单步更新



在线学习

离线学习

- Actor-Critc
- Q  Learning
- Sarsa
- Policy Gradients



openAI gym

Tkinter





#### Q-learing 

agent : 智能体

environment  : 环境

envirnoment : observation reward 

state:  状态  就是智能体**观察**到的当前环境的**部分或者全部特征**。 

Pi  策略  pilicy
$$
\pi(a|s) = P(A=a|S=s)
$$


**状态空间**就是智能体能够观察到的特征数量。

环境的特征可能有许多，但只有智能体能够观察到的特征才算是状态。所以我们也用Observation（观察的英文）表示状态。

未来是充满不确定性的，不确定性既包含在我们的策略，也包含在环境之中

action: 行为

reward 矩阵 R :  状态为行，行为为列的

状态转移：

> **Missing image resource:** `2-deep-learning/img/image-20240525235349436.png`



value function  is a prediction of future reward 

Q-value function gives expected total reward  

不确定性来自两个方面：1.智能体的行动选择（策略）。2.环境的不确定性。

> **Missing image resource:** `2-deep-learning/img/image-20240525235335394.png`



 在强化学习中，我们会用奖励R作为智能体学习的引导，期望智能体获得尽可能多的奖励。

但更多的时候，我们并不能单纯通过R来衡量一个动作的好坏

我们必须用长远的眼光来看待问题。我们要把未来的奖励也计算到当前状态下，再进行决策。

为了方便，我们希望可以有一种方法衡量我做出每种选择价值。这样，我只要看一下标记，以后的事情我也不用理了，我选择那个动作价值更大，就选那个动作就可以了。



 评估**动作**的价值，我们称为**Q值**，它代表了智能体选择这个动作后，一直到最终状态**奖励总和**的**期望**； 

评估**状态**的价值，我们称为**V值**：它代表了智能体在这个状态下，一直到最终状态的**奖励总和**的**期望**。

**V值是会根据不同的策略有所变化的！**

与V值不同，Q值和策略并没有直接相关，而与环境的状态转移概率相关，而环境的状态转移概率是不变的。



构建一个Q 矩阵：表示agent 从经验中学到的知识

> **Missing image resource:** `2-deep-learning/img/image-20220511161959902.png`



#### Sersa

> **Missing image resource:** `2-deep-learning/img/image-20220512210931289.png`



> **Missing image resource:** `2-deep-learning/img/image-20220512214126657.png`





~~~
https://zhuanlan.zhihu.com/c_1215667894253830144

~~~



DQN 

TD算法存在两个缺点：

~~~
1： waste of experience    
丢弃
2： correlated updates 
Consecutive state 连续状态   strongly correlate which is bad 


~~~



DQN：

1. 记忆库
2. 神经网络计算Q值
3. 暂时冻结q_target参数 切断相关性

优化过程：

Experience Replay : 经验回放

Prioritizedd Experience Replay  优先经验回放

Use importance sampling instead of uniform sampling .  根据重要程度进行采样

~~~
重要程度进行排序 ： TD error  
big TD  error ->high probability  >small learning rate 


SumTree 排序  提高排序效率
叶子节点是存的P 重要程度值 
https://zhuanlan.zhihu.com/p/47578210

https://zhuanlan.zhihu.com/p/47578210
https://www.zhihu.com/people/echooo-49/posts?page=3
~~~

SumTree 算法：

~~~

~~~

Double DQN ： 在选择动作的时候使用

> **Missing image resource:** `2-deep-learning/img/image-20220614160357348.png`



时间序列预测统计方法：

ARIMA是一种非常流行的时间序列预测统计方法

### 强化学习笔记（1）——概述

    1. 强化学习
    2. 序列决策过程简介
    3. Agents的类型

1. 强化学习

> **Missing image resource:** `2-deep-learning/img/1799478f5e7b237d5209ab1616af5dcc.png`

    强化学习的两大主体：agent和environment
    强化学习讨论的问题是一个智能体(agent) 怎么在一个复杂不确定的环境(environment)里面去极大化它能获得的奖励。
    当前的 agent 去跟环境交互，你就会得到一堆观测。你可以把每一个观测看成一个轨迹(trajectory).一场游戏叫做一个 episode(回合)或者trial(试验)。
    有效动作的集合经常被称为动作空间(action space)，动作空间分为离散动作空间(discrete action spaces)和连续动作空间(continuous action spaces)。
    对于一个强化学习 agent，它可能有一个或多个如下的组成成分：
    
    首先 agent 有一个 策略函数(policy function)，agent 会用这个函数来选取下一步的动作。
    然后它也可能生成一个价值函数(value function)。我们用价值函数来对当前状态进行估价，它就是说你进入现在这个状态，可以对你后面的收益带来多大的影响。当这个价值函数大的时候，说明你进入这个状态越有利。
    另外一个组成成分是模型(model)。模型表示了 agent 对这个环境的状态进行了理解，它决定了这个世界是如何进行的。它由两个部分组成：概率和奖励函数。
    
    强化学习中，探索 和利用 是两个很核心的问题，如何平衡两者的关系非常重要

2. 序列决策过程简介

    历史是观测(observation)、行为、奖励的序列：
    在这里插入图片描述
    你可以把整个游戏的状态看成关于这个历史的函数：
    在这里插入图片描述
    环境有自己的函数 S t e = f e ( H t ) S_{t}^{e}=f^{e}\left(H_{t}\right) Ste=fe(Ht)来更新状态，在 agent 的内部也有一个函数 S t a = f a ( H t ) S_{t}^{a}=f^{a}\left(H_{t}\right) Sta=fa(Ht)来更新状态。

    当 agent 的状态跟环境的状态等价的时候，我们就说这个环境是 full observability,在这种情况下面，强化学习通常被建模成一个 Markov decision process(MDP)的问题.
    当 agent 只能看到部分的观测，我们就称这个环境是部分可观测的(partially observed)。在这种情况下面，强化学习通常被建模成一个 POMDP 的问题。部分可观测马尔可夫决策过程(Partially Observable Markov Decision Processes, POMDP)。POMDP 可以用一个 7 元组描述：(S,A,T,R,Ω,O,γ)，其中 S 表示状态空间，为隐变量，A 为动作空间，T(s’|s,a)为状态转移概率，R为奖励函数，Ω(o∣s,a) 为观测概率，O 为观测空间，γ 为折扣系数。

3. Agents的类型

    根据 agent 学习的东西不同，我们可以把 agent 进行归类：

    基于价值的 agent(value-based agent)。
    这一类 agent 显式地学习的是价值函数，
    隐式地学习了它的策略。策略是从我们学到的价值函数里面推算出来的。基于价值迭代的强化学习算法有 Q-learning、 Sarsa 等
    基于策略的 agent(policy-based agent)。
    这一类 agent 直接去学习 policy，就是说你直接给它一个状态，它就会输出这个动作的概率。
    在基于策略的 agent 里面并没有去学习它的价值函数。基于策略迭代的强化学习算法有策略梯度算法等
    把 value-based 和 policy-based 结合起来就有了 Actor-Critic agent。这一类 agent 把它的策略函数和价值函数都学习了，然后通过两者的交互得到一个最佳的行为。

    agent 到底有没有学习这个环境模型来分类：

    第一种是 model-based(有模型)RL agent，它通过学习这个状态的转移来采取动作。
    另外一种是 model-free(免模型)RL agent，它没有去直接估计这个状态的转移，也没有得到环境的具体转移变量。它通过学习价值函数和策略函数进行决策。Model-free 的模型里面没有一个环境转移的模型。



### 马尔可夫决策过程

    0. 前言
    1. 马尔可夫过程（Markov Process，MP）
    2. 马尔可夫奖励过程（Markov Reward Process，MRP）
        2.1 迭代法计算状态价值函数 V V V
        2.2 蒙特卡罗法计算状态价值函数 V V V
        2.3 动态规划法计算状态价值函数 V V V
        2.4 时序差分学习法计算状态价值函数 V V V
    3. 马尔可夫决策过程（Markov Decision Process，MDP）
        3.1 MDP中的策略policy
        3.2 MDP和MRP之间的区别
        3.3 MDP的价值函数
        3.4 贝尔曼期望等式（Bellman Expectation Equation）
        3.5 备份图（backup diagram）
        3.6 预测和控制问题
            3.6.1 解决预测问题
            3.6.2 解决控制问题

0. 前言

在马尔可夫决策过程中，它的环境是全部可以观测的(fully observable)。但是很多时候环境里面有些量是不可观测的，但是这个部分观测的问题也可以转换成一个 MDP 的问题。
在介绍马尔可夫决策过程(Markov Decision Process，MDP)之前，先给大家梳理一下马尔可夫过程(Markov Process，MP)、马尔可夫奖励过程(Markov Reward Processes，MRP)。这两个过程是马尔可夫决策过程的基础。
1. 马尔可夫过程（Markov Process，MP）

    如果一个状态转移是符合马尔可夫的，那就是说一个状态的下一个状态只取决于它当前状态，而跟它当前状态之前的状态都没有关系。

    > **Missing image resource:** `2-deep-learning/img/5b42f68d0317617198ff4053de553664.png`

    我们可以用状态转移矩阵(State Transition Matrix) P 来描述状态转移 p ( s t + 1 = s ′ ∣ s t = s )

    > **Missing image resource:** `2-deep-learning/img/773e1045f5cc113cd8538768c313eff3.png`

2. 马尔可夫奖励过程（Markov Reward Process，MRP）

马尔可夫奖励过程(Markov Reward Process, MRP) 是马尔可夫链再加上了一个奖励函数。

1. Horizon是指一个回合的长度（每个回合最大的时间步数），它是由有限个步数决定的。
2. Return(回报) 说的是把奖励进行折扣后所获得的收益。Return 可以定义为奖励的逐步叠加，如下式所示：

> **Missing image resource:** `2-deep-learning/img/39025553eebf9f13024b9ee666d4bc46.png`

Rt+1代表从状态   st转移到 st+1得到的奖励

Gt代表在状态 st下能获得的折扣回报

这里有一个叠加系数，越往后得到的奖励，折扣得越多。这说明我们其实更希望得到现有的奖励，未来的奖励就要把它打折扣。

有了 return 过后，就可以定义一个状态的价值了，就是`state value function`。对于 MRP，state value function 被定义成是 return 的期望，如下式所示:

> **Missing image resource:** `2-deep-learning/img/b0b44b867ac8cf573029c1ed11c6b04c.png`

Gt是之前定义的 discounted return，我们这里取了一个期望，期望就是说从这个状态开始，你有可能获得多大的价值。discount factor 可以作为强化学习 agent 的一个超参数来进行调整，然后就会得到不同行为的 agent。



2.1 迭代法计算状态价值函数 V 

在使用迭代法之前，需要从价值函数里面推导出 Bellman Equation（贝尔曼等式），如下所示
在这里插入图片描述

想要推导贝尔曼等式，在此之前需要得到Law of Total Expectation(全期望公式)，即：
在这里插入图片描述
其中：

    V ( s t + 1 ) V(s_{t+1}) V(st+1)代表在状态 s t + 1 s_{t+1} st+1下的状态价值函数
    G t + 1 G_{t+1} Gt+1代表在状态 s t + 1 s_{t+1} st+1下的折扣回报（discounted return）。从 s t + 1 s_{t+1} st+1转移到 s t + 2 s_{t+2} st+2的奖励 R t + 2 R_{t+2} Rt+2开始算起，后面乘以折扣因子再相加。

证明过程：
在这里插入图片描述

因此全期望公式说的是，在状态 s t s_{t} st下，下一状态 s t + 1 s_{t+1} st+1的状态价值函数 V ( s t + 1 ) V(s_{t+1}) V(st+1)（它本身就是一个期望）的期望，等于，在状态 s t s_{t} st下，下一状态 s t + 1 s_{t+1} st+1的折扣回报 G t + 1 G_{t+1} Gt+1（它不是一个期望）的期望。（推导过程省略）
如何理解全期望公式？表面上看，好像 G t + 1 G_{t+1} Gt+1比 V ( s t + 1 ) V(s_{t+1}) V(st+1)计算更简洁，计算得到了优化，实际上，在计算 E [ G t + 1 ∣ s t ] \mathrm{E}\left[\mathrm{G}_{\mathrm{t}+1} \mid \mathrm{s}_{\mathrm{t}}\right] E[Gt+1∣st]的时候仍然要考虑状态 s t s_{t} st转移到状态 s t + 1 s_{t+1} st+1的概率和状态 s t + 1 s_{t+1} st+1转移到状态 s t + 2 s_{t+2} st+2的概率，因为 G t + 1 G_{t+1} Gt+1并不是状态 s t + 1 s_{t+1} st+1一个确定的折扣奖励，而是一个随机变量。全期望公式只是形式上得到了简化，但是实际在计算的时候，还是没有得到简化。

接下来，就可以得到贝尔曼等式了。
贝尔曼等式：定义了当前状态价值函数与未来状态价值函数的关系
在这里插入图片描述
其中：

    s’可以看成未来的所有状态。
    转移 P(s’|s)是指从当前状态转移到未来状态的概率。
    V(s’)代表的是未来某一个状态的价值。我们从当前这个位置开始，有一定的概率去到未来的所有状态，所以我们要把这个概率也写上去，这个转移矩阵也写上去，然后我们就得到了未来状态，然后再乘以一个 γ，这样就可以把未来的奖励打折扣。
    第二部分可以看成是未来奖励的折扣总和(Discounted sum of future reward)。

推导过程如下：
在这里插入图片描述
基于贝尔曼等式，可以写出所有状态的状态价值函数 V ( s i ) V(s_i) V(si)之间的关系：
在这里插入图片描述
修改为矩阵形式：
在这里插入图片描述
因此，只要知道每个状态的即时奖励 R R R与状态间的转移矩阵 P P P，那么就可以求出每个状态的状态价值函数 V V V。但是迭代法需要对矩阵求逆，对于大型矩阵的求逆会非常耗时，所以这种方法只适用于状态数较少的情况。
2.2 蒙特卡罗法计算状态价值函数 V V V

根据状态价值函数 V V V的定义，一个状态的 V V V是当前状态的折扣奖励期望，因此蒙特卡罗法就从当前状态出发，生成很多轨迹，然后计算这些轨迹的折扣奖励，将这些奖励加和后取平均，只要选取的轨迹足够多，那么就可以认为这就是 V V V的值。
在这里插入图片描述
2.3 动态规划法计算状态价值函数 V V V

我们也可以用这个动态规划的办法，一直去迭代它的 Bellman equation，让它最后收敛，就得到了状态价值函数 V V V。

在这里插入图片描述
2.4 时序差分学习法计算状态价值函数 V V V

时序差分学习(Temporal-Difference Learning)的办法。 Temporal-Difference Learning 叫 TD Leanring，它是动态规划和蒙特卡罗的一个结合。
3. 马尔可夫决策过程（Markov Decision Process，MDP）

相对于 MRP，马尔可夫决策过程(Markov Decision Process)多了一个 decision，其它的定义跟 MRP 都是类似的:

    这里多了一个决策，多了一个动作。
    状态转移也多了一个条件，变成了 P ( s t + 1 = s ′ ∣ s t = s , a t = a ) P\left(s_{t+1}=s^{\prime} \mid s_{t}=s, a_{t}=a\right) P(st+1=s′∣st=s,at=a)。未来的状态不仅是依赖于你当前的状态 s s s，也依赖于在当前状态 agent 采取的这个动作 a a a。
    对于这个价值函数，它也是多了一个条件，多了一个你当前的动作，变成了 R ( s t = s , a t = a ) = E [ r t ∣ s t = s , a t = a ] R\left(s_{t}=s, a_{t}=a\right)=\mathbb{E}\left[r_{t} \mid s_{t}=s, a_{t}=a\right] R(st=s,at=a)=E[rt∣st=s,at=a]。你当前的状态以及你采取的动作会决定你在当前可能得到的奖励多少。

3.1 MDP中的策略policy

    Policy 定义了在某一个状态应该采取什么样的动作。
    知道当前状态过后，我们可以把当前状态带入 policy function，然后就会得到一个概率，即：
    π ( a ∣ s ) = P ( a t = a ∣ s t = s ) \pi(a \mid s)=P\left(a_{t}=a \mid s_{t}=s\right) π(a∣s)=P(at=a∣st=s)
    假设这个概率函数应该是稳定的(stationary)
    另外这个策略也可能是确定的，它有可能是直接输出一个值，告诉你当前应该采取什么样的动作，而不是一个动作的概率。

加了策略policy π \pi π的MDP和没加策略的MRP是有关系的，即：只要对所有动作得到的奖励进行加权平均，如下所示：
在这里插入图片描述
3.2 MDP和MRP之间的区别

下图中左边是MP过程（或者是MRP过程，加了一个奖励而已），右边是MDP过程
在这里插入图片描述
3.3 MDP的价值函数

    仿照MRP中的状态价值函数的定义，可以类似地定义MDP中的价值函数：
    在这里插入图片描述
    我们通过对policy 进行采样来得到一个期望，那么就可以计算出它的价值函数。
    
    这里我们另外引入了一个 Q 函数(Q-function)。Q 函数也被称为 action-value function。Q 函数定义的是在某一个状态采取某一个动作，它有可能得到的这个 return 的一个期望。
    在这里插入图片描述
    对 Q 函数 q π ( s , a ) \rm q^{\pi}(s,a) qπ(s,a)中的动作进行加和，就可以得到价值函数 v π ( s ) \rm v^{\pi}(s) vπ(s)，即：
    在这里插入图片描述
    
    Q 函数的 Bellman equation：
    在这里插入图片描述

3.4 贝尔曼期望等式（Bellman Expectation Equation）

我们可以把状态-价值函数和 Q 函数拆解成两个部分：即时奖励(immediate reward) 和后续状态的折扣价值(discounted value of successor state)。

比如，对于状态价值函数 v π ( s ) \rm v^{\pi}(s) vπ(s)，有：
在这里插入图片描述
比如，对于Q函数 q π ( s , a ) \rm q^{\pi}(s,a) qπ(s,a)，有：
在这里插入图片描述
上面两个就是Bellman Expectation Equation的第一种形式。
当然，根据前述的 v π ( s ) \rm v^{\pi}(s) vπ(s)与 q π ( s , a ) \rm q^{\pi}(s,a) qπ(s,a)的实际含义，可以得到两者的数学关系：
在这里插入图片描述
或：
在这里插入图片描述
两式相互代入，可以得到Bellman Expectation Equation的第二种形式：
在这里插入图片描述
在这里插入图片描述
3.5 备份图（backup diagram）

如下所示的为状态价值函数 v π ( s ) \rm v^{\pi}(s) vπ(s)备份图，图中的 r \rm r r是 γ \gamma γ。
在这里插入图片描述

    这些操作将价值信息从一个状态（或状态-动作对）的后继状态（或状态-动作对）转移回它。
    每一个空心圆圈代表一个状态，每一个实心圆圈代表一个状态-动作对。

上图很形象地说明了下面这个公式
在这里插入图片描述
注意 R ( s , a ) R(s,a) R(s,a)代表在状态s下采取动作a后（转移到状态 s ′ s' s′）得到的单步奖励期望，即： R ( s , a ) = E [ R t + 1 ∣ s t = s , a t = a ] \rm R(s,a) = \mathbb{E}\left[\mathbf{R}_{\mathrm{t}+1} \mid \mathrm{s}_{\mathrm{t}}=\mathrm{s}, \mathrm{a}_{\mathrm{t}}=\mathrm{a}\right] R(s,a)=E[Rt+1∣st=s,at=a]。

如下所示的为Q函数 q π ( s , a ) \rm q^{\pi}(s,a) qπ(s,a)备份图，图中的 r \rm r r是 γ \gamma γ。
在这里插入图片描述

    第一层加和是先把这个叶子节点从黑色节点推到这个白色的节点，进了它的这个状态。
    当我们到达某一个状态过后，再对这个白色节点进行一个加和，这样就把它重新推回到当前时刻的一个 Q 函数。

在这里插入图片描述



3.6 预测和控制问题

MDP 的 prediction 和 control 是 MDP 里面的核心问题。
这两者的区别就在于：预测问题是给定一个 policy，我们要确定它的 value function 是多少，这也称为policy evaluation问题；而控制问题是在没有 policy 的前提下，我们要确定最优的 value function 以及对应的决策方案。
在强化学习中，我们通过解决预测问题，进而解决控制问题。

------------------------------------------------

> **Missing image resource:** `2-deep-learning/img/image-20240908113455192.png`

> **Missing image resource:** `2-deep-learning/img/image-20240908113514910.png`

> **Missing image resource:** `2-deep-learning/img/image-20240908113542102.png`



原文链接：https://blog.csdn.net/qq_41773233/article/details/114435113

> **Missing image resource:** `2-deep-learning/img/image-20240908115513320.png`

MC法、TD法、DP法的区别

圈表示状态， 点表示动作

**MC算法:深度采样学习**。一次学习完整经历，使用实际收获更新状态预估价值，如下图所示：

> **Missing image resource:** `2-deep-learning/img/image-20240908155716514.png`

**TD算法:浅层采样学习**。经历可不完整，使用后续状态的预估状态价值预估收获再更新当前状态价值，如下图所示。

> **Missing image resource:** `2-deep-learning/img/image-20240908160104564.png`

**DP算法:浅层全宽度(采样)学习**。依据模型，全宽度地使用后续状态预估价值来更新当前状态价值，如下图所示。

> **Missing image resource:** `2-deep-learning/img/image-20240908160138848.png`

综合上述三种学习方法的特点，可以小结如下︰当使用单个采样，同时不经历完整的状态序列更新价值的算法是TD学习;当使用单个采样，但依赖完整状态序列的算法是MC学习;当考虑全宽度采样，但对每一个采样经历只考虑后续一个状态时的算法是DP学习;如果既考虑所有状态转移的可能性，同时又依赖完整状态序列的，那么这种算法是穷举(exhausive search)法。需要说明的是:DP利用的是整个MDP问题的模型，也就是状态转移概率，虽然它并不实际利用采样经历，但它利用了整个模型的规律，因此也被认为是全宽度(full width)采样的。

> **Missing image resource:** `2-deep-learning/img/image-20240908160317046.png`

n步时序差分学习：

> **Missing image resource:** `2-deep-learning/img/v2-be78852bd396458a8917d7f7ec96cd08_720w.jpg`

> **Missing image resource:** `2-deep-learning/img/image-20240908160440505.png`

 那么在实际应用中，n取多少？n是一个超参，需要自己调！

进一步地，还可以在不增加计算复杂度的情况下，综合考虑各种步数的预测，引入一个新的参数 lamda ，并定义为   **收获**，其计算公式为：

> **Missing image resource:** `2-deep-learning/img/image-20240908160620871.png`



PPO和之前讲过的DDPG，都是基于策略梯度的强化学习算法，但它们之间还是有一定的区别。

- PPO是在线学习算法，而DDPG是离线学习算法。PPO算法在每一步中都会更新策略参数，而DDPG算法则是先收集一段轨迹，然后再进行学习。
- PPO算法使用了近端比率裁剪损失，用于限制策略更新幅度，而DDPG算法则使用了Q-learning，用于学习状态动作值函数。
- PPO算法可以用于离散动作空间和连续动作空间，而DDPG算法只能用于连续动作空间。

总体而言，PPO算法更加稳定，可以用于离散动作空间和连续动作空间，而DDPG算法则适用于连续动作空间。

策略梯度算法的核心思想是，通过最大化期望回报来优化策略：

PPO算法的核心思想是限制策略更新幅度，以达到稳定、高效的训练结果。具体来说，PPO算法使用了两个[损失函数](https://zhida.zhihu.com/search?q=损失函数&zhida_source=entity&is_preview=1)：第一个损失函数是近端比率裁剪损失，用于限制策略更新幅度；第二个损失函数是[价值函数](https://zhida.zhihu.com/search?q=价值函数&zhida_source=entity&is_preview=1)损失，用于优化策略。两个损失函数的加权和就是PPO算法的总损失函数。



> **Missing image resource:** `2-deep-learning/img/image-20240912213832473.png`

# Image Process

## 经典模型

### CNN 

CNN在文本上的应用：

关键词：  关键短语，  -》 局部性

关键信息可在不同的位置出现 -》 平移性

适当去除一些文字内容不影响语义理解， 可缩性

> **Missing image resource:** `2-deep-learning/img/image-20210609101846992.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609102901467.png`



> **Missing image resource:** `2-deep-learning/img/image-20210609102916992.png`







### LeNet5 

### AlexNet

1. 更深的网络
2. 数据增广
3. ReLU
4. dropout
5. 对GPU训练

###  resnet

### CapsNet

### MobileViT

### Vision Transformer (VIT)

### swin-transfoermer



## OCR

### Faster-RCNN 



### yole 

# Graph Network

Graph ：

​	有向图

​	无向图

图的表示：

​	邻接矩阵 Adjacency

图的性质： 度 degree

有向图： 出度 入度

子图： subgraph

连通图：

连通分量： 无向图G的一个极大连通子图称为G的一个连通分量

强连通图： 任意两个节点可达

弱连通图： 

最短路径：

度的中心性：  
$$
度的中心性： N_{degree}/n-1
$$
特征向量中心性：

不仅考虑自己的度，还考虑连接节点的度

> **Missing image resource:** `2-deep-learning/img/image-20231024214515944-1716729410138.png`

邻接矩阵， 求特征值，特征向量

中介中心性： 

连接中心性：

PageRank 算法：

HITS 算法

## graph embeding

### deep walk 

假设： 相邻节点应该相似

随机游走

DeepWalk仅能用于无权图

DeepWalk 的思想类似 word2vec，使用图中节点与节点的**共现关系**来学习节点的向量表示。那么关键的问题就是如何来描述节点与节点的共现关系，DeepWalk 给出的方法是使用随机游走 (RandomWalk) 的方式在图中进行节点采样。

RandomWalk 是一种可重复访问已访问节点的深度优先遍历算法。给定当前访问起始节点，从其邻居中随机采样节点作为下一个访问节点，重复此过程，直到访问序列长度满足预设条件。

DeepWalk使用DFS随机游走在图中进行节点采样，使用word2vec在采样的序列学习图中节点的向量表示

步骤：

1. input graph
2. random walk (生成序列， 可重复的深度优先遍历)
3. representation mapping
4. Hierarchical softmax
5. output representation

> **Missing image resource:** `2-deep-learning/img/image-20231113211112510-1716729453931.png`



https://blog.csdn.net/submarineas/article/details/129112679

deepwalk的缺点：

用完全随机游走，训练节点嵌入向量

仅能反映相邻节点的社群相似信息

无法反映节点的功能角色相似信息

### Line :

Large-scale information Network Embedding 

INE也是一种基于邻域相似假设的方法

LINE可以看作是一种使用BFS构造邻域的算法

一阶相识度：

网络中一阶相似性是两个顶点之间的局部点对的邻近度。对于每对顶点()，该边的权重表示和之间的一阶相似性，如果在和之间没有观察到边缘，它们的一阶相似性为0。比如上图中的6和7，它们之间有较强的边连接关系。

> **Missing image resource:** `2-deep-learning/img/image-20231113214408059-1716729453931.png`

> **Missing image resource:** `2-deep-learning/img/image-20231113213017919-1716729453932.png`

> **Missing image resource:** `2-deep-learning/img/image-20231113214445229-1716729453932.png`



二阶相似度：

二阶近似假设共享多个相同邻域顶点的两个顶点相似，

对向量引入两个向量表征，一个是顶点本身的 embedding，另一个是作为其他顶点上下文即邻域的表征

> **Missing image resource:** `2-deep-learning/img/image-20231113213559533-1699882660153-1716729453932.png`对向量引入两个向量表征，一个是顶点本身的 embedding，另一个是作为其他顶点上下文即邻域的表征

> **Missing image resource:** `2-deep-learning/img/image-20231113214513394-1716729453932.png`

Line : 技巧：

负采样

### node2Vec:

homophily : 同质性

structural equivalence: 结构等价性



> **Missing image resource:** `2-deep-learning/img/image-20231109203540369-1716729453932.png`

> **Missing image resource:** `2-deep-learning/img/image-20231109203714395-1716729453932.png`

> **Missing image resource:** `2-deep-learning/img/image-20231109204153271-1716729453932.png`

> **Missing image resource:** `2-deep-learning/img/image-20231109205420942-1716729453932.png`

> **Missing image resource:** `2-deep-learning/img/image-20231109211323027-1716729453932.png`



> **Missing image resource:** `2-deep-learning/img/image-20231113214146759-1716729453932.png`



> **Missing image resource:** `2-deep-learning/img/image-20231113214618555-1716729453932.png`



> **Missing image resource:** `2-deep-learning/img/image-20231113214635339-1716729453932.png`

### SDNE

Structural Deep Network Embedding，是第一个将深度学习应用于网络学习中的方法。

> **Missing image resource:** `2-deep-learning/img/image-20231113215315211-1716729453933.png`

自动编码器的输入和输出分别是邻接矩阵和经过神经网络重构后的邻接矩阵，中间绿色部分为压缩后的向量，最后就用这个向量来表示节点。

一阶相似性优化：让图中相邻的两个顶点对应的embedding vector（绿色部分）在隐藏空间接近。它的优化目标是对中间向量y进行优化：

因为输入的是邻接矩阵，所以包含了该点的邻居结构信息。这样的重构过程能够使得结构相似的顶点具有相似的embedding表示向量。它的优化目标是对输出向量x进行优化：

### struc2vec

之前node embedding 都是基于近邻关系，但是有些节点没有近邻，但也有相似的结构

> **Missing image resource:** `2-deep-learning/img/image-20231113220856992-1716729453933.png`

Struc2Vec是从空间结构相似性的角度定义顶点相似度的。

**顶点对**距离定义：

> **Missing image resource:** `2-deep-learning/img/image-20231114213630833-1716729453933.png`

> **Missing image resource:** `2-deep-learning/img/image-20231114213708461-1716729453933.png`

表中是根据 d(a,b) 公式算出来的

> **Missing image resource:** `2-deep-learning/img/image-20231114213805350-1716729453933.png`



> **Missing image resource:** `2-deep-learning/img/image-20231114213902608-1716729453933.png`

> **Missing image resource:** `2-deep-learning/img/image-20231114213922439-1716729453933.png`



Struct2Vec 适用于节点分类，其结构标识比邻居更重要。

### EGES

Enhanced Graph Embedding with Side Information，

其基本思想是在DeepWalk生成的graph embedding基础上引入补充信息。



> **Missing image resource:** `2-deep-learning/img/image-20231025213422238-1716729453933.png`



1. DeepWalk: 采用随机游走，形成序列，采用skip-gram方式生成节点embedding
2. node2vec: 不同的随机游走策略，形成序列，类似skip-gram方式生成节点embedding
3. LINE: 捕获节点的一阶和二阶相似度，分别求解，再将一阶二阶拼接在一起，作为节点的embedding
4. struc2vec: 对图的结构信息进行捕获，在其结构重要性大于邻居重要性时，有较好的效果
5. SDNE: 采用了多个非线性层的方式捕获一阶二阶的相似性
6. EGES：将一个商品的embedding分为多个维度的embedding，这样对于新的item来说，会先对该item的已有属性进行向量的加权求和，就可以生成新的embedding了。



https://mp.weixin.qq.com/s?__biz=MzA4ODc5NzE1OA==&mid=2653607932&idx=1&sn=a4e47d7b019496bd395e7ad8a1226635&vid=1688851238003775&deviceid=af79c586-976d-4277-8133-21ce9651aa8f&version=4.1.2.6017&platform=win



https://github.com/shenweichen/GraphEmbedding

## graph network

CNN卷积具有顺序  ，全连接 输入没有顺序性

卷积参数共享

卷积的定义：



卷积核  ： kernel size 

步长 : stride

填充： padding 

通道： channels 

池化：降维，减少数据计算量，减缓过拟合，特征不变形 

空洞卷积 

局部输入不变

感受野变大

### 图卷积

> **Missing image resource:** `2-deep-learning/img/image-20231027214638212-1716729705623.png`

在经典卷积网络中，对于输入数据有如下要求：

- 只能处理固定输入维度的数据
- 局部输入数据必须有序
- > **Missing image resource:** `2-deep-learning/img/image-20231027214818043-1716729705624.png`

任何的连续周期信息，可以由一组适当的正弦曲线组合而成

1. 频域：指将信号转换为频率的域，通过对频率的分析来研究信号的频率特性。常用的转换方法是使用傅里叶变换。在频域中，信号可以表示为各个频率分量的相对强度。
2. 谱域：指将信号转换为能量或功率的域，通过对能量或功率的分析来研究信号的能量或功率分布。常用的转换方法是使用功率谱密度函数。在谱域中，信号可以表示为各个频率分量的能量或功率。
3. 空域：指将信号转换为空间坐标的域，通过对空间坐标的分析来研究信号的空间特性。在空域中，信号可以表示为在不同空间位置上的强度。
4. 时域：指将信号转换为时间坐标的域，通过对时间坐标的分析来研究信号的时间特性。在时域中，信号可以表示为在不同时间上的变化。

傅里叶变化是可逆的

拉普拉斯矩阵： 度矩阵- 邻接矩阵

> **Missing image resource:** `2-deep-learning/img/image-20231026230428643-1716729705624.png`

https://zhuanlan.zhihu.com/p/19763358

#### 谱域图卷积

​	根据图谱理论和卷积定理，将数据由空域转换到谱域做处理

谱域一切都是静止

卷积定理： 

> **Missing image resource:** `2-deep-learning/img/image-20231027215014124-1716729705624.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215053247-1716729705624.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215151157-1716729705624.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215331384-1716729705624.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215403761-1716729705624.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215540081-1716729705624.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215625970-1716729705625.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215807806-1716729705626.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027215909523-1716729705626.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220022448-1716729705626.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220253176-1716729705626.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220316356-1716729705626.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220439237-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220604860-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220634130-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027220741826-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027221109498-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027221350367-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027221426442-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027221640105-1716729705627.png`



> **Missing image resource:** `2-deep-learning/img/image-20231027221943391-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222015351-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222052748-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222151352-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222325432-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222404791-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222604012-1716729705627.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222705436-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222813853-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222837358-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222911918-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027222953604-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027223019296-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027223120685-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231027223142873-1716729705628.png`





#### 空域图卷积：

直接在空间上定义卷积操作

<img src="../Note_v1/imgs/image-20231026222130765.png" alt="image-20231026222130765" style="zoom: 33%;" />

> **Missing image resource:** `2-deep-learning/img/image-20231027215248862-1716729705628.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212124902-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212139564-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212256611-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212336893-1716729705629.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029212357863-1716729705629.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029212447252-1716729705629.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029212555839-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212744028-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212838108-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029212907134-1716729705629.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029213048510-1716729705629.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029213313682-1716729705629.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029214937633-1716729705630.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029215011179-1716729705630.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029215032135-1716729705630.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029215204288-1716729705630.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029215308421-1716729705630.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029215630550-1716729705630.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029215839590-1716729705630.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029215905027-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029215951172-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029220015043-1716729705631.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029220051281-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029220113516-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029220129726-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029220222750-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029220248575-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029220413015-1716729705631.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029221009017-1716729705631.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221028569-1716729705632.png`



##### PGC：

> **Missing image resource:** `2-deep-learning/img/image-20231029221133816-1716729705632.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221200198-1716729705632.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221324472-1716729705632.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221518074-1716729705632.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029221622031-1716729705632.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221649530-1716729705632.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029221736188-1716729705633.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221754148-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029221811213-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029221901085-1716729705633.png`



> **Missing image resource:** `2-deep-learning/img/image-20231029221925449-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231029222012221-1716729705633.png`



> **Missing image resource:** `2-deep-learning/img/image-20231030210558522-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231030210813877-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231030210857118-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231030210940893-1716729705633.png`



> **Missing image resource:** `2-deep-learning/img/image-20231030211122235-1716729705633.png`

> **Missing image resource:** `2-deep-learning/img/image-20231030212523697-1716729705633.png`







### 

### GNN



### GCN



### GAT







### GraphSACE 

sample and aggre

> **Missing image resource:** `2-deep-learning/img/image-20231115201134650-1716729566664.png`

> **Missing image resource:** `2-deep-learning/img/image-20231115201509695-1716729566665.png`

> **Missing image resource:** `2-deep-learning/img/image-20231115201526872-1716729566665.png`



> **Missing image resource:** `2-deep-learning/img/image-20231115201551603-1716729566665.png`

### graphSACE-minibach 

> **Missing image resource:** `2-deep-learning/img/image-20231115202321251-1716729566665.png`



K 是聚合的深度，

> **Missing image resource:** `2-deep-learning/img/image-20231115202451755-1716729566665.png`

> **Missing image resource:** `2-deep-learning/img/image-20231115202512583-1716729566665.png`

### GrapSAGE-Embedding









### HAN

Heterogeneous Graph Attention network  经典的异构图模型

- 同构图：节点类型 + 边类型 = 2
- 异构图：节点类型 + 边类型 > 2

不同类型的边应该有不同的权值，而在同一个类型的边中，不同的邻居节点又应该有不同的权值，因此它使用了节点级别的注意力（node level attention）和语义级别的注意力（semantic level attention）

定义了meta-path:

即用来表示连接两个实体的一条特定的路径

> **Missing image resource:** `2-deep-learning/img/image-20231121214222388-1716729566666.png`> **Missing image resource:** `2-deep-learning/img/image-20231121214245440-1716729566666.png`





https://zhuanlan.zhihu.com/p/583055027





### GTN 

Graph Transformer Network

因此GTNs的出现：

1. 提出了一种新的图变换网络，识别有用的元路径和多跳连接来学习图上的有效节点表示。
2. 图的生成是可解释的，提供有效路径连接的解释。
3. 证明了图变换网络学习的节点表示的有效性，从而获得了最佳的性能，而现有的方法在异质图的所有三种基准节点分类中都使用了领域知识

> **Missing image resource:** `2-deep-learning/img/image-20231123212818989-1716729566666.png`

1: meta-path generation  元路径的产生

> **Missing image resource:** `2-deep-learning/img/image-20231123212842388-1716729566666.png`

2： graph Transformer Networks 



> **Missing image resource:** `2-deep-learning/img/image-20231123212920383-1716729566666.png`

### metapath2vec:



以图结构分类可以分为同构与异构图两大类。其中

1.同构图: 点类型 + 边类型=2(也就是不区分点与边类型)

2.异构图：点类型 + 边类型>2 

metapath2vec与之前的图嵌入方法不同，metapath2vec是专门处理异质图的，利用metapath2vec我们可以得到异质图中多种不同类型节点的潜在向量表示。



https://zhuanlan.zhihu.com/p/541894996

> **Missing image resource:** `2-deep-learning/img/image-20231127213644499-1716729566666.png`

其中P(u)是负采样中样本的预定义分布，这个更新公式与带负采样的skip-gram公式基本一致。

元路径随机游走：

一个meta-path的scheme被定义为：

> **Missing image resource:** `2-deep-learning/img/image-20231127213809079-1716729566666.png`

元路径中相邻节点的类型是不一样的，即vi和vi+1属于不同类型的节点，表示两个节点间的关系。

> **Missing image resource:** `2-deep-learning/img/image-20231127213911878-1716729566666.png`

> **Missing image resource:** `2-deep-learning/img/image-20231127213945082-1716729566666.png`



作者提出了Heterogeneous negative sampling的概念:







当前点，下一个点，与定义的meta-path 中有相同的，则概率为 1/ 节点个数

GCN，GAT，GraphSAGE都是以同构图进行研究，沿着这个同构图模型的思想出发，大胆假设一下，将异构图分成多个含单一关系的同构图，那么会发现，其实只需要解决不同关系之间的交互，就可以套用同构图的思想解决异构图的问题。



### GATNE

General Attributed Multiplex Herogeneous Network Eebedding 



直推学习 Transductive 

归纳式学习 inductive

Transductive Model:  GATNE-T

> **Missing image resource:** `2-deep-learning/img/image-20231128210737121-1716729566667.png`





### BiNE

1: 显示关系的建模， 点的直连

2： 隐式关系建模 ，间接连接

> **Missing image resource:** `2-deep-learning/img/image-20231128211152029-1716729566667.png`

> **Missing image resource:** `2-deep-learning/img/image-20231128211343768-1716729566667.png`

wij 是权重， u，v 是vector 

> **Missing image resource:** `2-deep-learning/img/image-20231128212200445-1716729566667.png`

> **Missing image resource:** `2-deep-learning/img/image-20231128212442908-1716729566667.png`

> **Missing image resource:** `2-deep-learning/img/image-20231128212519454-1716729566667.png`



### SGCN

Singed Graph Convolutional Network 

> **Missing image resource:** `2-deep-learning/img/image-20231128212716915-1716729566667.png`

> **Missing image resource:** `2-deep-learning/img/image-20231128213106879-1716729566667.png`

> **Missing image resource:** `2-deep-learning/img/image-20231128213302679-1716729566667.png`

> **Missing image resource:** `2-deep-learning/img/image-20231128213147379-1716729566667.png`



### SiGAT

> **Missing image resource:** `2-deep-learning/img/image-20231128213447608-1716729566668.png`



### SDGNN

Sgned Directed Grap neural Networks 

> **Missing image resource:** `2-deep-learning/img/image-20231129211238479-1716729566668.png`



> **Missing image resource:** `2-deep-learning/img/image-20231129211330358-1716729566668.png`



## Dynamic network representations

> **Missing image resource:** `2-deep-learning/img/image-20231130213846134-1716729566668.png`

> **Missing image resource:** `2-deep-learning/img/image-20231130214142188-1716729566668.png`

> **Missing image resource:** `2-deep-learning/img/image-20231130213956928-1716729566668.png`





> **Missing image resource:** `2-deep-learning/img/image-20231130214108240-1716729566668.png`



> **Missing image resource:** `2-deep-learning/img/image-20231130214307751-1716729566668.png`





> **Missing image resource:** `2-deep-learning/img/image-20231130214338664-1716729566668.png`

### DySAT

> **Missing image resource:** `2-deep-learning/img/image-20231130214512016-1716729566668.png`

> **Missing image resource:** `2-deep-learning/img/image-20231130214748822-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231130214810404-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231130215031813-1716729566669.png`

v 节点， T 时刻

只能看到j 时刻之前的值

> **Missing image resource:** `2-deep-learning/img/image-20231130215532112-1716729566669.png`





### EvolveGCN:

W 不是通过GCN学习，而是通过RNN 学习

> **Missing image resource:** `2-deep-learning/img/image-20231204204918962-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231204205055389-1716729566669.png`





### Streaming GNN 

> **Missing image resource:** `2-deep-learning/img/image-20231204205146316-1716729566669.png`

> **Missing image resource:** `2-deep-learning/img/image-20231204205235059-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231204205323317-1716729566669.png`





### DGNN





### TGAT



pytorch-gemeric





V : vertex 

E:  edge 

U : Global attributes 

A： 邻接矩阵 ：

非结构化处理数据的难点：

1. 图的大小是任意的，拓扑结构复杂
2. 没有固定的节点顺序
3. 图是动态的，包含多模态特征

message passing nural network :
$$
H=\sigma(AXW)
$$
与基本的神经网络，增加了一个邻居矩阵，

<img src="../Note_v1/imgs/image-20231015212310503.png" alt="image-20231015212310503" style="zoom:50%;" />

<img src="../Note_v1/imgs/image-20231015215551974.png" alt="image-20231015215551974" style="zoom:50%;" />GNN

输入是特征，输入也是特征，邻接矩阵不会改变

感受野：

多层GNN ， 就是提高感受野

GCN：

各个节点输入特征， 网络结构图

A： 邻接矩阵 + 对角都设置为1 ， 就是把自己加上

D： 度矩阵

F: 特征矩阵

I： 单位矩阵 ， 对角线都是1

都是对称矩阵
$$
P = D^{-1/2}AD^{-1/2}\\
L = I - D^{-1/2}AD^{-1/2}(拉普拉斯矩阵) \\
$$
> **Missing image resource:** `2-deep-learning/img/image-20231015214853027-1697380164785-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231015215730555-1716729566669.png`



<img src="../Note_v1/imgs/image-20231015222608447.png" alt="image-20231015222608447" style="zoom:50%;" />



> **Missing image resource:** `2-deep-learning/img/image-20231015222819485-1716729566669.png`

> **Missing image resource:** `2-deep-learning/img/image-20231015223454546-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231015223734761-1716729566669.png`



> **Missing image resource:** `2-deep-learning/img/image-20231015224024231-1716729566669.png`

> **Missing image resource:** `2-deep-learning/img/image-20231015224051681-1716729566670.png`



> **Missing image resource:** `2-deep-learning/img/image-20231015224829347-1716729566670.png`

> **Missing image resource:** `2-deep-learning/img/image-20231015224856685-1716729566670.png`



> **Missing image resource:** `2-deep-learning/img/image-20231015225008883-1716729566670.png`

> **Missing image resource:** `2-deep-learning/img/image-20231015225049899-1716729566670.png`







Graph Embedding：

1. 矩阵分解
2. 随机游走
3. 深度学习







GAT



GVP （Geometric Vector Perceptrons, GVPs) 几何向量感知机

# 图像基本运算

https://blog.csdn.net/asialee_bird/article/details/109463084

霍夫梯度法，

https://www.zhihu.com/search?q=%E5%9B%BE%E5%83%8F%E5%88%86%E5%89%B2%E6%9C%89%E4%BB%80%E4%B9%88%E7%94%A8&utm_content=search_suggestion&type=content

## 形态学

膨胀，腐蚀，开启，闭合

集合的交，并，补，差，反射，平移 

> **Missing image resource:** `2-deep-learning/img/image-20220719214916718-1716726498187.png`



> **Missing image resource:** `2-deep-learning/img/image-20220719215106427-1716726498189.png`



> **Missing image resource:** `2-deep-learning/img/image-20220719215313902-1716726498189.png`

## 二值图像的逻辑运算 

not

and

or 

xor

前景 背景

目标检测：

> **Missing image resource:** `2-deep-learning/img/image-20220721234015378-1716726498190.png`

分类算法：

<img src="../Note/pic/image-20220721234657466.png" alt="image-20220721234657466" style="zoom:50%;" />

<img src="../Note/pic/image-20220723101835912.png" alt="image-20220723101835912" style="zoom:50%;" />

> **Missing image resource:** `2-deep-learning/img/image-20220723110709486-1716726498190.png`



> **Missing image resource:** `2-deep-learning/img/image-20220723110425853-1716726498190.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723110759148-1716726498191.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723111003707-1716726498191.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723111135980-1716726498191.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723111052574-1716726498192.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723111227962-1716726498192.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165004489-1716726498192.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165051327-1716726498192.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165123204-1716726498193.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165217096-1716726498192.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165248547-1716726498193.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165331117-1716726498193.png`

> **Missing image resource:** `2-deep-learning/img/image-20220723165359874-1716726498193.png`

# 图像增强：

~~~
https://github.com/zycskylove
https://github.com/kali20gakki/ObjectDetectionAssistant
https://github.com/ami66/yolov5_v6.0_object_detection
~~~

~~~
对图像进行缩放并进行长和宽的扭曲
对图像进行翻转
对图像进行色域扭曲

~~~



~~~
1： 图片预处理（随机改变明暗、对比度、颜色等）
import numpy as np
import cv2
from PIL import Image, ImageEnhance
import random

# 随机改变亮暗、对比度和颜色等
def random_distort(img):
    # 随机改变亮度
    def random_brightness(img, lower=0.5, upper=1.5):
        e = np.random.uniform(lower, upper)
        return ImageEnhance.Brightness(img).enhance(e)
    # 随机改变对比度
    def random_contrast(img, lower=0.5, upper=1.5):
        e = np.random.uniform(lower, upper)
        return ImageEnhance.Contrast(img).enhance(e)
    # 随机改变颜色
    def random_color(img, lower=0.5, upper=1.5):
        e = np.random.uniform(lower, upper)
        return ImageEnhance.Color(img).enhance(e)

    ops = [random_brightness, random_contrast, random_color]
    np.random.shuffle(ops)

    img = Image.fromarray(img)
    img = ops[0](img)
    img = ops[1](img)
    img = ops[2](img)
    img = np.asarray(img)

    return img
2： 随机填充
# 随机填充
def random_expand(img,
        gtboxes,
        max_ratio=4.,
        fill=None,
        keep_ratio=True,
        thresh=0.5):
    if random.random() > thresh:
        return img, gtboxes

    if max_ratio < 1.0:
        return img, gtboxes

    h, w, c = img.shape
    ratio_x = random.uniform(1, max_ratio)
    if keep_ratio:
        ratio_y = ratio_x
    else:
        ratio_y = random.uniform(1, max_ratio)
    oh = int(h * ratio_y)
    ow = int(w * ratio_x)
    off_x = random.randint(0, ow - w)
    off_y = random.randint(0, oh - h)

    out_img = np.zeros((oh, ow, c))
    if fill and len(fill) == c:
        for i in range(c):
            out_img[:, :, i] = fill[i] * 255.0

    out_img[off_y:off_y + h, off_x:off_x + w, :] = img
    gtboxes[:, 0] = ((gtboxes[:, 0] * w) + off_x) / float(ow)
    gtboxes[:, 1] = ((gtboxes[:, 1] * h) + off_y) / float(oh)
    gtboxes[:, 2] = gtboxes[:, 2] / ratio_x
    gtboxes[:, 3] = gtboxes[:, 3] / ratio_y

    return out_img.astype('uint8'), gtboxes
3随机裁剪 （这个涉及裁剪之后会不会裁掉过多的原本图像）
https://blog.csdn.net/qq_20491295/article/details/109312771#:~:text=bccd%E8%A1%80%E7%BB%86%E8%83%9E%E6%95%B0%E6%8D%AE%E9%9B%86%E6%98%AF%E4%B8%80%E4%B8%AA%E6%AF%94%E8%BE%83%E8%80%81%E7%9A%84%E6%95%B0%E6%8D%AE%E9%9B%86%EF%BC%8C%E4%B9%9F%E4%B8%8D%E5%A4%A7%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%9C%A8%E8%BF%99%E4%B8%8B%E8%BD%BD%20https%3A%2F%2Fpublic.roboflow.com%2Fobject-detection%2Fbccd,%E8%AF%A5%E6%95%B0%E6%8D%AE%E9%9B%86%E5%85%B1%E6%9C%89%E4%B8%89%E7%B1%BB364%E5%BC%A0%E5%9B%BE%E5%83%8F%EF%BC%9A%EF%BC%88WBC%E7%99%BD%E7%BB%86%E8%83%9E%EF%BC%89%EF%BC%8CRBC%EF%BC%88%E7%BA%A2%E7%BB%86%E8%83%9E%EF%BC%89%E5%92%8CPlatelets%E3%80%82%203%E4%B8%AA%E7%B1%BB%E5%88%AB%E4%B8%AD%E6%9C%894888%E4%B8%AA%E6%A0%87%E7%AD%BE%EF%BC%88%E6%9C%890%E4%B8%AA%E7%A9%BA%E7%A4%BA%E4%BE%8B%EF%BC%89%E3%80%82
~~~



~~~
conda create -n finace python=3.6

pip freeze > requirements.txt 
https://blog.csdn.net/adczsw/article/details/121983846 # 打包环境

~~~

 pip install --user torch==1.7.1 torchvision==0.8.2 -f https://download.pytorch.org/whl/torch_stable.html -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com

https://haicoder.net/docker/docker-run-mode.html

https://github.com/cosmicpython/book/blob/master/chapter_01_domain_model.asciidoc



# 生成模型

生成模型是指能够随机生成观测数据的模型，尤其是在给定某些隐含参数的条件下。它给观测值和标注数据序列指定一个联合概率分布

## Encoder



## AutoEncoder(AE)

自编码器

目的： 降维，和去噪生，和图像生成

idea: 直接使用神经网络对input 数据进行映射，得到output向量（作为从数据中提取的特征）

AE:  是一种利用反向传播的算法，使得输出值 = 输入值得神经网络

​		encoder : h = f(x)  将输入数据压缩成潜在空间特征

​		decoder: r = g(h)

​		g(f(x)) =r  = x (与原x 相近)

​		其中 h 的维度 比x 小(相当于降维 PCA )

学习过程：  L（x, g(f(x))） ,  MSE 

如果 decoder 是线性的，且L是均方误差，则自编码器会学习出PCA相同的子空间

#### 正则编码器

1. 稀疏自编码器

   加入稀疏惩罚项，让自编码器的input结果稀疏，编码器网络隐藏层第$$[Math Processing Error]i$$ 个神经元的平均激活度为所有训练样本的激活函数均值，记为$$[Math Processing Error]\widehat{p_i}$$,p 是人工指定的活跃点

    						$$[Math Processing Error]L(x,g(f(x))+\Omega{(h)}$$

使得交叉熵构造惩罚项：

​						$$[Math Processing Error]\Omega(h) = \sum^n_i (pln{p \over \widehat p_i} +(1-p)ln{ 1-p \over 1- \widehat p_i})$$

去噪编码器 (Denosing AutoEncoder , DAE)

收缩自编码器（Contractinve Autoencoder ,CAE）



## VAE 

(Variational Auto-encoder , VAE)

> **Missing image resource:** `2-deep-learning/img/image-20230223203937529-1716637961102.png`







$$[Math Processing Error]希望构建一个隐变量Z，生成目标函数x，但是只能看到x,只要推出Z的特征，（贝叶斯概率)$$

看到x,要推出Z的特征：

​		$$[Math Processing Error]p(z|x) = {p(x|z)p(z)\over p(x)} \tag{1}$$

​									$$[Math Processing Error]p(x)= \int P(x|z)P(z)dz \tag{2}$$

VAE : (变化+贝叶斯)，使用q(z|x) 来近似p(z|x)

​										$$[Math Processing Error] min KL(q(z|x)|| p(x|z))$$

通过 $$[Math Processing Error]max E_{q(t|x)}logP(x|z)-KL(q(z|x)||p(z))$$ , 来最小化。



https://blog.csdn.net/smileyan9/article/details/107362252

https://blog.csdn.net/cloudless_sky/article/details/123697481

##  Gan

~~~
https://www.bilibili.com/video/BV1Bg4y187WC?spm_id_from=333.337.search-card.all.click

https://developer.huawei.com/consumer/cn/forum/topic/0202744487054880144?fid=0101592429757310384

https://zhuanlan.zhihu.com/p/28853704 gan 的证明
~~~



GANs（Generativeadversarial networks）对抗式生成网络

- Generative：生成式模型
- Adversarial：采取对抗的策略
- Networks：网络

> **Missing image resource:** `2-deep-learning/img/image-20220508115412966.png`

整个公式的具体含义如下：

- 式子由两项构成，x表示真实图片，z表示输入G网络的噪声，而G(z)表示G网络生成的图片。
- D(x)表示D网络判断**真实图片是否真实**的概率（因为x就是真实的，所以对于D来说，这个值越接近1越好）。
- D(G(z))是**D网络判断G生成的图片是否真实的概率。**
- G的目的：G应该希望自己生成的的图片越接近真实越好。
- D的目的：D的能力越强，D(x)应该越大，D(G(x))应该越小，这时V(D,G)会变大，因此式子对于D来说是求最大（max_D）。
- trick：为了前期加快训练，生成器的训练可以把log(1-D(G(z)))换成-log(D(G(z)))损失函数。

 GAN图片生成:

**第一步（左图）**：希望判决器尽可能地分开真实数据和我生成的数据。那么，怎么实现呢？我的真实数据就是input1（Real World  images），我生成的数据是input2（Generator）。input1的正常输出是1，input2的正常输出是0，对于一个判决器（Discriminator）而言，我希望它判决好，首先把生成器固定住（虚线T），然后生成一批样本和真实数据混合给判决器去判断。此时，经过训练的判决器变强，即固定生成器且训练判决器。

**第二步（右图）**：固定住判决器（虚线T），我想办法去混淆它，刚才经过训练的判决器很厉害，此时我们想办法调整生成器，从而混淆判别器，即通过固定判决器并调整生成器，使得最后的输出output让生成的数据也输出1（第一步为0）

~~~python
GAN的核心就是这些，再简单总结下，即：
    步骤1是在生成器固定的时候，我让它产生一批样本，然后让判决器正确区分真实样本和生成样本。（生成器标签0、真实样本标签1）
    步骤2是固定判决器，通过调整生成器去尽可能的瞒混判决器，所以实际上此时训练的是生成器。（生成器的标签需要让判决器识别为1，即真实样本）
    
for 迭代 in range(迭代总数):
    for batch in range(batch_size):
        新batch = input1的batch + input2的batch (batch加倍)
        for 轮数 in range(判别器中轮数):
           步骤一 训练D
        步骤二 训练G
        
https://www.infoq.cn/article/2w5ew5i3g*vkgc5elqgy
    
~~~

~~~
https://reiinakano.github.io
https://reiinakano.com/
~~~

> **Missing image resource:** `2-deep-learning/img/image-20220510104339221.png`



https://blog.csdn.net/weixin_43334693/article/details/135271954?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-135271954-blog-105175097.235%5Ev43%5Epc_blog_bottom_relevance_base6&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-135271954-blog-105175097.235%5Ev43%5Epc_blog_bottom_relevance_base6&utm_relevant_index=5



https://www.bilibili.com/video/BV1Up411R7Lk?p=4&vd_source=ae11379595599a1cedeb268c109fc9bb

##  Flow

https://blog.csdn.net/m0_56942491/article/details/136346491

https://www.bilibili.com/video/BV1C4411A7o3/?from=search&seid=7904061540301133082&vd_source=c06477a064079dc916ffc3a3b940bb0f

## diffusion

噪声的添加过程中，每一步都要保持尽量相同的噪声扩散幅度。图片前期的分布非常均匀，添加一些噪声便可以将[原始分布](https://www.zhihu.com/search?q=原始分布&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"article"%2C"sourceId"%3A"610012156"})改变，但到后期，需要添加更多的噪声，方可保证噪声扩散幅度相同（有趣的比喻，水中加糖，为了使糖的甜味增长相同，后期需要加更多的糖）。







> **Missing image resource:** `2-deep-learning/img/generative-overview.png`



[*Diffusion* Model （李宏毅阅读笔记）](https://zhuanlan.zhihu.com/p/638698344)

## 评价指标

### Frechet Inception Distance（FID）

> **Missing image resource:** `2-deep-learning/img/v2-800c40353982433989c19b88467e5887_720w.webp`

FID评价指标

首先需要一个训练好的分类器，然后比较生成图片与真实图片representation之间的距离，距离越小越好，这需要大量图片来测量。

### Contrastive Language-Image Pre-Training（CLIP）

> **Missing image resource:** `2-deep-learning/img/v2-e81b6efd946be1d5513252d010016461_720w.webp`

CLIP Score评价指标

使用CLIP模型根据对应的文字描述来判断生成图像的质量。

## 概念讲解

> **Missing image resource:** `2-deep-learning/img/v2-cc5050d50f4ec9669863ff1e8a7cc52c_720w.webp`

图一：Diffusion Model的运作

不同时序使用的是同一个denoise模型，但是因为输入图片的状态有很大的不同，所以需要把step本身也输入到denoise模型，让它知道当前图片的去噪状况。Denoise模型的具体结构如图2所示。

> **Missing image resource:** `2-deep-learning/img/v2-54095ed615a4341f9555963ebc1781c3_720w.webp`

图二：Denoise模块内部情况

Denoise模块中存在一个Predicter，它用来预测输入图片的噪声，再用要被denoise的图片减去噪声就可以得到denoise之后的图片了。

那么这个Noise Predicter如何训练呢？在训练时，我们首先需要根据原始无噪声的图片认为生成Predicter的噪声GT。GT具体的生成方法见图三。

> **Missing image resource:** `2-deep-learning/img/v2-3ef197ddda52133d9a5ed97ccf5c64e6_720w.webp`

图三：噪声的生成与Predicter的训练

与denoise相反，在生成GT时我们一步步的对无噪声图片添加噪声，每一步添加的噪声就是GT。在训练Predictor时，当前的step以及加噪之后的图片是模型的输入，添加的噪声就是当前step的GT。

但是我们都知道，diffusion模型的一个重要功能就是可以根据文字描述生成图片，那么这段文字描述应该怎么传到模型呢？其实很简单，和step数一样，直接输入给Noise Predictor就可以了。

> **Missing image resource:** `2-deep-learning/img/v2-5d66d690aa20132e89c5512319002c7a_720w.webp`

图四：text-to-image

### text-to-image框架

既然说到了text-to-image，那么我们不妨先来看看整个框架，如图五所示。

> **Missing image resource:** `2-deep-learning/img/v2-9749eddbc19e3403435e08aaeaf5f165_720w.webp`

图五：text-to-image framework

从这个framework中可以看出，文字是没有办法直接输入到模型中的，首先需要一个encoder（GPT,BERT）将文本编码成token，再和噪声一起输入到生成模型（也就是diffusion模型），得到的中间产物最后通过一个decoder生成最终的图像。**其中decoder的训练数据可以不需要标签。**

Decoder的输入有两种情况，一种是denoise图片的压缩版本（imagen），一种是latent representation（stable  diffusion）。对于前者非常简单，只需要拿很多downsample的图片来训练就可以了。对于后者需要训练一个auto  encoder，把decoder拿出来用，如图六所示。

> **Missing image resource:** `2-deep-learning/img/v2-8e54658eecdc6d21752717971cfcd926_720w.webp`

图六：中间产物为latent representation

对于framework中的生成模型，noise加在中间产物（latent representation）上而不是原始图像上。  

### 训练（加噪）过程

> **Missing image resource:** `2-deep-learning/img/v2-383cc03b62e6496a838c73a48f96a927_720w.webp`

图七：Diffusion的训练

第5行是唯一需要解释的地方， 

 是干净的图片，  是前面说的Noise Predictor，它的输入包括加噪声之后的图像（红色框）以及时序  ， 

 是训练的target也就是添加的噪声。它其实与前面我们提到的一步步加噪的过程不一样，而是一次就可以了。

> **Missing image resource:** `2-deep-learning/img/v2-321bd1ff951e2c4c09cf2ee521d89e2f_720w.webp`

图八：DDPM

### 推理（去噪）过程

> **Missing image resource:** `2-deep-learning/img/v2-4aa00a1e25b276ed29b7d22002bb2247_720w.webp`

图九：Diffusion的推理

Diffusion的推理符合我们最开始对Diffusion的印象，需要一步步的把图片从完全的噪声 

 恢复到干净的图片  。其中伪代码比较难理解的点首先是第三行的额外噪声  ，其次是第四行中各个相乘的系数。第四行代码中的  和 

 将在后面解释。

### 数学推理

生成模型的本质是用网络生成一组图像的分布，这个分布与真实图片的分布越接近越好。那么如何判断两组分布是否足够接近呢？这里通常会使用**Maximum Likelihood Estimation。**

> **Missing image resource:** `2-deep-learning/img/v2-42eceb5150da1ea334668c5901b27def_720w.webp`

图十：Maximum Likelihood Estimation

图十表示最优的模型参数 

 要求模型生成从原始数据分布 中采样得到的  到 

 的乘积概率最大。对式子进行化简，可以得到一个关于KL的式子，如图十一所示。

> **Missing image resource:** `2-deep-learning/img/v2-88aec1503aa3f4a97b954035bd99ad76_720w.webp`

图十一：图像生成的目标

这个式子中的 

 是真实数据的分布，我们需要求的东西就变成了  。那么 

 怎么求呢？下面给出推导公式如图十二。

> **Missing image resource:** `2-deep-learning/img/v2-bd381c2c3585e0e122288c86218d90b3_720w.webp`

图十二：DDPM计算P_\theta 

这样我们就知道了 

 怎么求，由图十我们知道越大越好，因此这里我们的目标就是让

最大。那么如何求它的最大值呢？

> **Missing image resource:** `2-deep-learning/img/v2-640325f7b37ea6bea62b719d25abf943_720w.webp`

图十三：DDPM最大化P

图十三中的 

 表示diffusion的前向加噪过程。接下来的问题就是如何求  以及  。

非常容易求得，根据加噪的步骤我们就可以知道。

> **Missing image resource:** `2-deep-learning/img/v2-83e0bc70a5189426decc0a0ad293bf5e_720w.webp`

图十四：DDPM一步步添加噪声

如图十四所示，其实这样类推就可以得到

的关系式。但是我们发现，如果每次计算到t都需要采样t次高斯噪声，那么这样是很麻烦的。其实多次独立的采样噪声等价于采样一次噪声。

> **Missing image resource:** `2-deep-learning/img/v2-398b99d4a211e23da0d673c1889bc037_720w.webp`

图十五：采样噪声的合并

由此可以得到

的关系式图十六。

> **Missing image resource:** `2-deep-learning/img/v2-103ac307de5fe0274e855bcda978b3ad_720w.webp`

图十六

其中还包括了对 

 和 

 的解释。根据图十三我们知道要最大化的式子，接下来就是对这个式子进行化简：

> **Missing image resource:** `2-deep-learning/img/v2-a73c17560116ed7e74396a491e72f05f_720w.webp`

图十七：优化目标的化简

接下来的问题就是化简图十七的式子。

> **Missing image resource:** `2-deep-learning/img/v2-79776a38eb49cf4559c322748a4cbed3_720w.webp`

图十八

我们首先对式子中蓝色框的式子进行化简。我们知道 

 表示的是前向过程，我们将前向过程中所有的产物都视为高斯分布的，根据图十六的式子我们可以用高斯分布的表达式来表达 

 。

> **Missing image resource:** `2-deep-learning/img/v2-f64608f122af88d09f116f20e95409af_720w.webp`

图十九

根据图十九我们就可以得到

 的均值与方差。

> **Missing image resource:** `2-deep-learning/img/v2-207c4197606314448ea8a2813380defb_720w.webp`

图二十：均值与方差分别只与x0和xt有关，与xt-1无关

对于红色框的式子，我们的目标是让 

 的均值与  的均值最接近。这是因为前者的均值与方差都是固定的（与  无关），后者的均值取决于Noise Predictor，方差同样是固定的。因此Predictor的作用就是在给定输入  和 

 的时候让输出的噪声的分布与前者的均值最接近。

> **Missing image resource:** `2-deep-learning/img/v2-d76500b6880269acd6247cb09c82ea3f_720w.webp`

图二十一：Predictor的目标

对均值进行化简，就可以得到最终我们Predictor预测的目标。这与前面图九的目标相同。

### reference

https://github.com/YangLing0818/RPG-DiffusionMaster



## DALL-E2 



stabel diffusion

Reference：

https://blog.csdn.net/m0_66015895/article/details/132511722 [flow]

https://kexue.fm/archives/5253

https://www.cnblogs.com/yifanrensheng/p/13586468.html

# 时间序列

~~~
https://www.bilibili.com/video/BV1F441187xt?spm_id_from=333.337.search-card.all.click
https://github.com/dragen1860/TensorFlow-2.x-Tutorials

https://developer.huawei.com/consumer/cn/forum/topic/0202744487054880144?fid=0101592429757310384
~~~



# 多模态

MultiModal Machine Learing (MMML):

多模态表示学习  Representation

模态转化 Translation

对齐：  Alignment

多模态融合：  Fusion

协同学习：  Co-learning

协同学习：  Co-learning



> **Missing image resource:** `2-deep-learning/img/image-20210609104647608.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104719752.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104744097.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104807316.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104840560.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104855714.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104909805.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104927517.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609104953058.png`

> **Missing image resource:** `2-deep-learning/img/image-20210609105022628.png`

# Large-model

- 第一章 概览与前置任务

  -  tokenizer训练

     - tokenizer原理与算法:BPE，ByteBPE, wordpiece,unilm,sentence-piece

     - tokenizer训练：sentence-piece

  -  position encoding方案

     - Alibi

     - RoPE

     - [综述：利用位置编码实现长度外推 (qq.com)](https://mp.weixin.qq.com/s/h6Ug2ttJSN5W2qmAC8Id5A)![img](https://api2.mubu.com/v3/document_image/61415017-c42c-48a1-84ef-b67f44c27cd7-8142555.jpg)

  -  注意力机制与transformer架构

     - 典型的自注意力机制
       - ![img](https://api2.mubu.com/v3/document_image/dbf02412-8f54-4220-95f8-54a0d161f387-8142555.jpg)

     - 其他注意力机制
       - Mamba,H3,Hyena,RetNet,RWKV,Linear attention, Sparse attention

     - 典型的transformer架构

       - decoder-only

       - encoder-only

       - encoder-decoder

- 第二章 训练

  - 预训练

    - lm训练配置

      - 正则化方法

      - 激活函数

      - 优化器

  - SFT训练

  - 强化学习

    - Police-Based

    - Value-Based

    - Actor-Critic

  - RLHF训练

  - 其他指令对齐训练

  - 分布式并行训练技术

    - 模型并行

      - tensor parellelism

      - 序列并行

      - pipeline parellelism
        - GPipe,1F1B, interleaved 1F1B

    - 数据并行
      - DP,DDP,FSDP,ZeRO

  - MoE

  - PEFT训练

    - Adapter类

    - Prompt类

    - LoRA类

  - 上下文扩展技术

    - window attention

    - 注意力缩放

    - streaming-llm

    - RoPE改进

    - Alibi

- 第三章 推理

  - 压缩

    - 剪枝

    - 量化

      - 校准量化

        - GPTQ

        - AWQ

        - SmoothQuant

        - SpQR

      - 非校准量化

        - LLM.int8

        - ZeroQuant

  - 显存优化技术

    - pagedattention

    - quantized kv cache

    - mqa/gqa

    - flash-attention

    - flash-attention-v2

    - flash-attention-decoding

  - 调度优化技术

    - dynamic batching

    - async serving

    - continuous/interative-level batching

    - sarathi/fastgen

  - 请求优化技术

    - 网络通信优化

    - 响应模式优化

  - 采样及解码加速

    - speculative decoding

    - specinfer

    - medusa

    - blockwise parallel decoding

    - SOT-parallel decoding

  - 推理中的模型并行策略
    - TP,PP

  - 算子融合及其他优化:no padding, 高性能算子...

- 第四章 应用

  - RAG

    - RAG的基本组件

      - DocLoader

      - TextSplitter

      - 向量数据库
        - 索引：NSW,NSG,HNSW,DiskAnn,LSH,IVF

      - embedding模型

    - RAG增强训练

      - self-rag

      - Chain-of-Note

    - RAG优化

      - NL2Cypher

      - NL2SQL

      - 文本检索

      - embedding训练

      - reranker

  - Agent

    - Agent基本组件

      - Planning

      - Reflection

      - Memory

      - Tool Use

    - Agent对齐微调

      - Toolformer

      - TALM

      - Chain of Hindsight

      - Algorthm Distillation

    - Agent框架

      - ReAct

      - Relfexion

  - Prompt Engineering
    - CoT,ToT,GoT

> **Missing image resource:** `2-deep-learning/img/fe4358f50efc4839801562b690b32cff.png`









https://github.com/virginiakm1988/ML2022-Spring

https://blog.csdn.net/weixin_42491648/article/details/132384913

https://kexue.fm/archives/5253

git clone https://github.com/virginiakm1988/ML2022-Spring

https://blog.csdn.net/weixin_42491648/article/details/132384913

https://github.com/VHellendoorn/Code-LMs
