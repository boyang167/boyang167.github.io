---
title: deep learning
description: Basic Concept
date: '2025-03-11'
area: Deep Learning
tags: []
language: zh-CN
order: 1
draft: false
---
# deep learning

## Basic Concept

The network desgin of deep learning is shown in the following figure:

- **神经网络常见层**
  全连接层、激活层、BN层、Dropout层、卷积层、池化层、循环层、Embedding层、Merege层等
- **网络配置**
  损失函数、优化器、激活函数、性能评估、初始化方法、正则项等
- **网络训练流程**
  预训练模型、训练流程、数据预处理（归一化、Embedding）、数据增强（图片翻转旋转曝光生成海量样本）等

![image-20220508112545595](/knowledge-assets/deep-learning/image-20220508112545595.png)

### Fully connected Layer

隐藏层的输入和输出都有关联，即全连接层的每一个结点都与上一层的所有结点相连，用来把前边提取到的特征综合起来。由于其全相连的特性，一般全连接层的参数也是最多的。

![image-20220508112700073](/knowledge-assets/deep-learning/image-20220508112700073.png)

### Activation Function :

激活函数相当于一个过滤器或激励器，它把特有的信息或特征激活，常见的激活函数包括softplus、sigmoid、relu、softmax、elu、tanh等。

- 对于隐藏层，我们可以使用relu、tanh、softplus等非线性关系；
- 对于分类问题，我们可以使用sigmoid（值越小越接近于0，值越大越接近于1）、softmax函数，对每个类求概率，最后以最大的概率作为结果；
- 对于回归问题，可以使用线性函数（linear function）来实验

![image-20220508112920687](/knowledge-assets/deep-learning/image-20220508112920687.png)

常用的激活函数Sigmoid、tanh、ReLU、Leaky ReLU曲线如下图所示：

![image-20240525234246083](/knowledge-assets/deep-learning/image-20240525234246083.png)

### **Optimizer**

**优化器选择:**

存在梯度变化后，会有一个迭代的方案，这种方案会有很多选择。优化器有很多种，但大体分两类：

- 一种优化器是跟着梯度走，每次只观察自己的梯度，它不带重量
- 一种优化器是带重量的

它也是机器学习中最重要或最基础的线性优化。七种常见的优化器包括：

- class tf.train.GradientDescentOptimizer
- class tf.train.AdagradOptimizer
- class tf.train.AdadeltaOptimizer
- class tf.train.MomentumOptimizer
- class tf.train.AdamOptimizer
- class tf.train.FtrlOptimizer
- class tf.train.RMSPropOptimizer

References:

- https://developer.huawei.com/consumer/cn/forum/topic/0202744487054880144?fid=0101592429757310384
