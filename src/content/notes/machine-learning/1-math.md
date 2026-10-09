---
title: Math
description: 采样
date: '2025-03-10'
area: Machine Learning
tags: []
language: zh-CN
order: 1
draft: false
---
# Math

## 采样


马尔科夫链模型的状态转移矩阵收敛到的稳定概率分布与我们的初始状态概率分布无关

对于绝大多数的其他的马尔科夫链模型的状态转移矩阵也有效。同时不光是离散状态，连续状态时也成立。

基于马尔科夫链采样

MCMC采样

MC-MH 采样

是M-H采样有两个缺点：一是需要计算接受率，在高维时计算量大。并且由于接受率的原因导致算法收敛时间变长。二是有些高维数据，特征的条件概率分布好求，但是特征的联合分布不好求。因此需要一个好的方法来改进M-H采样，这就是我们下面讲到的Gibbs采样。

细致平稳条件：如果非周期马尔科夫链的状态转移矩阵*P*和概率分布*π*(*x*)对于所有的*i*,*j*满足：

*π*(*i*)*P*(*i*,*j*)=*π*(*j*)*P*(*j*,*i*)

![image-20230809210759101](/knowledge-assets/machine-learning/image-20230809210759101-1716637189476.png)

gibss 采样：

MCMC采样都是用的Gibbs采样。当然Gibbs采样是从M-H采样的基础上的进化而来的，同时Gibbs采样要求数据至少有两个维度，一维概率分布的采样是没法用Gibbs采样的,这时M-H采样仍然成立。

https://blog.csdn.net/Anne033/article/details/129939259

https://www.cnblogs.com/pinard/p/6645766.html
