---
title: NLP
description: basic concept
date: '2025-03-11'
area: Deep Learning
tags: []
language: zh-CN
order: 2
draft: false
---
# NLP

## basic concept

![image-20210601210129479](/knowledge-assets/deep-learning/image-20210601210129479.png)

语言模型：（一句话语法上是否通顺）

过滤词 ，停用词 ， 出现频率很低的词

word Representation

sentence Representation

Sentence Similarity

one-hot  :  Sparsity  稀疏

TF-idf Representaion

    Distributed Representation （vector）

Learn Word Embeddings:

Model:

传统：  skipGram , Glove , CBow

考虑上下文： ELmo , BERT , XLNet

### Meaning Representation in Computs

Hypernyms (is-a) relationships of wordNet

knowledge based representation (基于规则)

corpus-based representation （基于语料）

Atomic symbols: one-hot reprention

**issues**:  difficult to compute the similarity of two (sentence ,word)

**idea** : words with similar meaning often have similar neighbor

co-occurrence matrix constructed via neighbors

**neighbors** definition: full document VS windows

full docement: word-document co-occurrence matrix gives general topics (latent semantic analysis)

**windows**: context windows for each word capture syntactic (POS) and sematic information

issues: 1:matrix size increases with vocabulary   2: hith dimensional 3:sparsity 稀疏

**idea: low dimensional word vector**

method1 : SVD   X = USV

semantic relations : 语言联系 syntactic relation : 句法联系

issues: 1:computationally expensive2: difficult to add new words

**idea: directly learn low-dimensional word vectors**

method2 : directly learn low dimensional word vectors

learning representations by back-propagation 1986

a neural probabilistic language model 2003

nlp from scrath 2008

recent and most popular models : word2vec 2013 and glove  2014

as known as word embeddings

outline

- Language Modeling
- N-gram language Model
- Feed-Forward Neural Language Model
- Recurrent Neural Network Language Model

**language modeling**

Goal : estimate the probability of  a word sequence

$$
P(w_1,w_2,...w_n) \\
$$

example task : determinate (决定) whether a sequence is grammatical or makes more sense

**N-gram language model :**

probability is **conditional** on a window of (n-1) previous words   **count**

$$
p(w_1,w_2,...w_n) = \sum_{i=1}^m P(w_i|w_1,..,w_{n-1})
$$

**issue**: some sequences may not **appear** in the training data(the phenomenon happens because we cannot collect all the possible text in the word as training data)

give some small probability -> Smoothing

idea: estimate

$$
P(w_i |w_{i-(n-1)},...,w_{i-1})
$$

**not from count ,but from NN prediction**

**issue** : fixed context window for conditioning 用于条件的固定上下文窗口

**idea** : condition the neural network on all previous words and tie the weights at each time step

assumption: temporal information matters 时间信息很重要

### **Attention and Memory**

information from sensors

  ->sensory memory    attention

->working memory     encoding

-> long-term memory  retrieval

**problem**: very long sequence or an image

**solution**: pay attention on the **partial** input object each time

**Problem**: larger memory implies more parameters in RNN

**solution**: long-term memory increases memory size without increasing parameters

**Machine Translation**

Sequence-to-Sequence learning : both input and output are both sequences with different lengths

`<END>` 标识符

RNN+ Attention 实现

 Dot-Product Attention in Matrix A(Q,K,V) =soft(QK^T) V

Speech Recognition with Attention  语言辨识

Image captioning with attention

video captioning

Reading comprehension

### Corpus  based representation

**atomic  symbols: one-hot  representation**

**issues** : difficult to compute the similarity

**idea** : 	words with similar meanings often have similar neighbors

 **Neighbors :**

1. high-dimensional spare word  vector
2. low-dimensional dense word vector
   1. method 1 : dimension reduction
   2. method 2 : direct learning

### **window-based co-occurrence matrix**

**issues :**

1. matrix size increases with vocabulary
2. high dimensional
3. sparsity -> poor robustness

**idea : low dimensional word vector  降维**

SVD  矩阵分解

**issues:**

1. computationally expensive : o(mn^2)
2. when n < m for n x m matrix
3. difficult to add a new words

### direct learning  word embedding  词嵌入

Word Embedding Benefit

Given an unlabeled training corpus ， produce a vector for each word that encodes its semantic information 。 these vectors are useful because：

1. **semantic similarit**y between two words can be calculated as the cosine similarity between their corresponding word vectors
2. word vectors as **powerful features** for various supervised NLP tasks **since** the vectors contain semantic information
3. propagate any information into them via neural networks and update during training

### WordEmbeding

LM （language modeling） ： 开始的时候

predicting the next words given the proceeding contexts

$$
P(w_{t+1}|w_t)
$$

 Skip-Gram Model  （提升）

Goal : predict surrounding words within a window of each word

$$
P(w_{t-m},...w_{t-1},w_{t+1},...,w_{t+m}|w_t)
$$

CBOW (Continue Bags of Words ) :

Goal: predicting the target word given the surrounding words

$$
P(w_t|w_{t-m},...w_{t-1},w_{t+1},...,w_{t+m})
$$

1. 层次softmax
2. negative sampling

## Reprensentation

![image-20210601212650814](/knowledge-assets/deep-learning/image-20210601212650814.png)

![image-20210601212806301](/knowledge-assets/deep-learning/image-20210601212806301.png)

![image-20210607095335335](/knowledge-assets/deep-learning/image-20210607095335335.png)

![image-20240525224533026](/knowledge-assets/deep-learning/image-20240525224533026.png)

![image-20210607105704651](/knowledge-assets/deep-learning/image-20210607105704651.png)

![image-20210607105731076](/knowledge-assets/deep-learning/image-20210607105731076.png)

![image-20210607110514863](/knowledge-assets/deep-learning/image-20210607110514863.png)

**Counter-based:**  统计的方法

LSA,LDA,PCA:

**pros:**

1. fast training
2. efficient usage of statistics

**cons:**

1. primarily used to capture word similarity
2. disproportionate importance given to large counts

**Direct prediction ** 直接预测 深度学习

NNLM HLBL, RNN ,skipgram , cbow

**pros:**

1. generate improved performance on other tasks
2. capture complex patterns beyond word similarity

**cons:**

1. benefits mainly from large corpus
2. inefficient usage of statistics

### OneHot

### Glove

Combining the benefits from both words

 idea : ratio of co-occurrence probability can encode meaning

**Goal** : use word vectors in neural net models built for subsequent tasks

ability to also classify words accurately

incorporate any information into them other tasks 附加信息

Glove: Global Vectors for world Representation

### word2Vec

Word Embedding Polysemy (一词多义 )issue

Issue :

multi-senses

multi-aspects (semantic syntax )

**Intrinsic evaluation - word analogies**

word linear relationship

syntactic  句法 and semantic 语义 example questions

**Extrinsic Evaluation Subsequent Task**

 Word Embedding Polysemy issue  一词多意

Words are polysemy

an apple a day ,keeps the doctor away.

smartphone companies including apple ...

However , their embeddings are not polysemy

issue :

multi-senses

multi-aspects (semantics ,syntax)

TagLM  pre-ELMO

paper : Semi-supervised sequence tagging with bidirectional language models

### BPE

https://huggingface.co/docs/transformers/tokenizer_summary

### FasterText

### Text2CNN

### EMLO

idea : contextualized word Embeddings

![image-20210408164339989](/knowledge-assets/deep-learning/image-20210408164339989.png)

![image-20210408164808690](/knowledge-assets/deep-learning/image-20210408164808690.png)

![image-20210408170649769](/knowledge-assets/deep-learning/image-20210408170649769.png)

### Attention

**Representation of variable Length data**

input： word sequence ,image pixels(像素)，audio signal ,click logs

property: continuity ,temporal,importance distribution

**example:**

basic combination : average ,sum

neural combination: networks architectures should consider input domain properties

CNN （convolutional neural networks）

- easy to parallelize
- exploit local dependencies
- long-distance dependencies require many layers

RNN (Recurrent neural network): temporal information

- learning variable-length representatiaons
- **fit for** sentences and sequences of values
- sequential computation makes parallelization **difficult**
- No explicit modeling of long and short rang dependencies
- Attention:
  encoder-decoder model is important in NMT(机器翻译)
- RNNs need attention mechanism to handle long dependencies
- attention allows us to access any state

### Dot-product Attention

input: a query q and a set of key-value(k-v) pairs to an output

output: weighted sum of values

![image-20240525222832890](/knowledge-assets/deep-learning/image-20240525222832890.png)

### Transformer

Multi-Head Attention:
idea: allow words to interact with one another

Model:

1. Map Q,K,V to lower dimensional spaces
2. apply attention ,concatenate outputs
3. linear transformation

![image-20210331143448880](/knowledge-assets/deep-learning/image-20210331143448880.png)

![image-20210331143535394](/knowledge-assets/deep-learning/image-20210331143535394.png)

### Tramsformer-XL

idea: segment-level recurrence

Transformer 存在issue：

context fragmentation

把文本拆成一个一个的句子，然后将所有的句子统一成一样的长度，多退少补的感觉。这样就导致文本的语义信息断开了.

transformer-xl:

- segment-level recurrence
- relative postional encoding

将前面片段的隐层信息进行缓存，计算当前片段隐层信息的时候再进行使用

导致片段的绝对位置都是一样，提出了相对位置编码

![image-20220512100600889](/knowledge-assets/deep-learning/image-20220512100600889.png)

![image-20220512105740184](/knowledge-assets/deep-learning/image-20220512105740184.png)

### NCE

### GPT

给定一个无标签的序列

$$
u = ({u_1,u_2,...u_n}),
$$

 最大化优化目标：

$$
L_1(u)= \sum_i logP(u_i|u_{i-k},...u_{i-1};\theta)
$$

k : 滑动窗口的大小，P： 条件概率，

$$
\theta
$$

 : 模型参数  ， SGD优化

#### GPT 1

《Improving Language Understanding by Generative Pre-training 》

Alec Radford  （Generative Pre-trained Transformer）

采用预训练+Fine-tuning 的方式：

1. Unsupervised pre-traing
2. Supervised fine-tuning  (Classfication, Entailment, Similarity,Mutiple Choice )

1.无监督的预训练

给定一个无标签的序列

$$
u = ({u_1,u_2,...u_n}),
$$

最大化优化目标：

$$
L_1(u)= \sum_i logP(u_i|u_{i-k},...u_{i-1};\theta)
$$

k: (the size of the context window) : 滑动窗口的大小，P： 条件概率，

$$
\theta
$$

 :模型参数  ， SGD优化

<img src="../img/image-20230206220650535.png" alt="image-20230206220650535" style="zoom:50%;" />

$$
h_0 = UW_e+W_p \\
h_l = transformer_block(h_l) \  \forall l \in \{ 1,2,3,..L\}  \\
P(u) = softmax(h_nW_e^T) \\
$$

$$
U = (u_{i-k},...u_{i-1}) \
$$

token的 onehot 表示,

$$
W_p
$$

: 位置嵌入矩阵 ，

$$
W_e
$$

: 词嵌入矩阵

与transformer decoder 相比： GPT dedocer 去掉了multi-head ,  两个子层分别为

1. sublayer1 : masked multi-head attention
2. sublayer2: feed-forward network

- 字节对编码：( byte pair encoding , BPE)
- 词编码的长度为  768
- 位置编码也需要学习
- 12层的transformer，每个transformer块有 12个头
- 位置编码的长度是 3072
- 激活函数为GLEU
- drop 比例： 0.1
- 训练的batchsize为64，学习率为

  $$
  2.5e^{-4}
  $$

  ，序列长度为 512 ，序列epoch: 100
- 参数量： 1.17亿

2.对于有监督的训练: Fine-turning

数据集C ，  seq: (

$$
x^1,x^2,...x^m
$$

)$ 和对应的label : y
目标任务函数：

$$
L2(C)=\sum_{x,y} logP（y|x^1,x^2,...x^m）
$$

$$
P(y|x^1,x^2,...x^m)=softmax(h_l^mW_y)
$$

,

 其中

$$
h_l^m
$$

: 最后一个token

$$
x^m
$$

对应最后一层的decoder输出，额外调整的参数只有

$$
W_y
$$

最终：

$$
L(C)=L_2(C)+\lambda L_1(C)
$$

GPT-1证明了transformer对学习词向量的强大能力，在GPT-1得到的词向量基础上进行下游任务的学习，能够让下游任务取得更好的泛化能力。对于下游任务的训练，GPT-1往往只需要简单的微调便能取得非常好的效果。

<img src="../img/image-20230207212910968.png" alt="image-20230207212910968" style="zoom:50%;" />

#### GPT2

《Lanauage Models are Unsupervised Multitask Learners》

zero-shot

Common Crawl  数据下载

idea:

1. Language Mode:

   $$
   P(s_{n-k},...,s_n|s_1,s_2,...,s_{n-k+1})
   $$

   , 已知sequence :

   $$
   s_1,s_2,...,s_{n-k+1}
   $$
2. Any supervised task :

   $$
   P(output|input)
   $$

   ,   特定的网络，给特定的任务建模，如果要做通用模型，$P(output|input, task)$

   $$
   建模， 一般， input,output , 用向量表示， task ,也可以

   eg: 

   		(translate to french , englisht text , french text ) 

   		 (answer the questiom , document ,question ,answer)

   样本： **The translation of word Machine Learning in chinese is 机器学习**

   训练完这句话时，语言模型就自然地将翻译任务(task)和任务的输入输出(input,output)都学到了
   $$

Traning DataSet :

    40GB

Input representation:

Transformer 层堆积到48层， 隐层的维度1600，参数量15亿

#### GPT3

《Language Models are Few-Shot Learners》

词汇表： 50257

1750亿

样本不做梯度更新

**In-Context Learning**

zero-shot-learning

```
translate english to french   # task description 
cheese = >  # prompt 
```

one-shot-learning

```
translate english to french   # task description 
sea otter = > loutre de mer   # examples 
cheese = >  # prompt 
```

few-shot-learning

```
translate english to french   # task description 
sea otter = > loutre de mer   # examples 
peppermint = > menthe poivree
plush girafe = > girafe peluche 
cheese = >      	# prompt 
```

prompt tuning  -> feature engineering

主要贡献：本文证明了通过增大参数量就能让语言模型显著提高下游任务在Few-shot（仅给定任务说明和少量示例）设置下的性能，即证明了大规模语言模型使用元学习策略的可能和fine-tuning策略的非必要性

#### InstructGPT

#### ChatGPT

instruct learning :

Instruct是激发语言模型的理解能力，它通过给出更明显的指令，让模型去做出正确的行动。

prompt learning :

Prompt是激发语言模型的补全能力，例如根据上半句生成下半句，或是完形填空等

提示学习：给女朋友买了这个项链，她很喜欢，这个项链太____了。
指示学习：判断这句话的情感：给女朋友买了这个项链，她很喜欢。选项：A=好；B=一般；C=差。

```
https://github.com/v2fly/fhs-install-v2ray


curl https://api.openai.com/v1/models \
  -H 'Authorization: Bearer <OPENAI_API_KEY>' \
  -H 'OpenAI-Organization: org-v9yQSIY40G1eNQF8A1RGgZvR'
```

Reinforcement learning from human feedback (RHLF)

Lamam1 :

![在这里插入图片描述](/knowledge-assets/deep-learning/c969c0001a2545d28dfd1e2cbec309e6.png)

![img](/knowledge-assets/deep-learning/format-png)

![在这里插入图片描述](/knowledge-assets/deep-learning/9f9f1d665d034d74994b538b5517967b.png)

2： reward model training

为什么旋转位置嵌入有效？

捕捉相对位置信息：传统的位置嵌入方法通常仅编码绝对位置，这可能在处理长序列或需要捕捉相对位置信息的任务中表现不佳。而RoPE通过旋转变换自然地引入了相对位置信息，使得模型能够更好地理解序列中各个位置之间的相对关系。
    由于RoPE通过复数域的旋转变换来编码位置，这种变换能够捕捉更加丰富的位置信息。相比于简单的线性变换，旋转变换提供了更强的非线性表达能力，使得模型在处理复杂任务时具有更好的表现力。
    RoPE的计算相对简单，不需要复杂的矩阵运算。预计算频率向量和应用旋转变换的过程可以高效地实现，适合在实际应用中大规模部署。
    RoPE能够无缝集成到现有的Transformer架构中，不需要对模型结构进行大的修改。这种兼容性使得RoPE成为一种易于应用和推广的位置编码方法。
    在长序列处理任务中，传统的位置编码方法可能会遇到信息稀释或计算复杂度增加的问题。RoPE通过引入旋转变换，可以更好地保持长序列中的位置信息，使得模型在长序列任务中表现更加稳定和高效。
    (这一点是我的猜想)在高维向量中，方向是比模长更重要的量，常规位置编码直接在词嵌入上加上位置编码，相当于改变了模长，旋转位置编码改变了方向，实际上比常规位置编码多获得了一部分信息。

### BERT

http://fancyerii.github.io/2019/o3/o9/bert-codes/

BERT Bidirectional Encoding Representation From transformers

idea: contextualized word representations **learn word vectors** using long contexts using Transformer instead of LSTM

两阶段新模式（预训练+Finetuning）

Denoising Autoencoder  DAE

Bert中的一些细节:

- 在输入上，Bert的输入是两个segment，其中每个segment可以包含多个句子，两个segment用[SEP]拼接起来。
- 模型结构上，使用Transformer，这点跟Roberta是一致的。
- 学习目标上，使用两个目标：
- - Masked Language Model(MLM): 其中15%的token要被Mask，在这15%里，有80%被替换成[Mask]标记，有10%被随机替换成其他token，有10%保持不变。
  - Next Sentence Prediction: 判断segment对中第二个是不是第一个的后续。随机采样出50%是和50%不是。
- Optimizations:
- - Adam, beta1=0.9, beta2=0.999, epsilon=1e-6, L2 weight decay=0.01
  - learning rate, 前10000步会增长到1e-4, 之后再线性下降。
  - dropout=0.1
  - GELU激活函数
  - 训练步数：1M
  - mini-batch: 256
  - 输入长度: 512
- Data
- - BookCorpus + English Wiki = 16GB

#### **1: Masked Language Model**

idea: language understanding is bidirectional while LM  only uses left or right context

![image-20240525223045424](/knowledge-assets/deep-learning/image-20240525223045424.png)

![image-20240525223110825](/knowledge-assets/deep-learning/image-20240525223110825.png)

#### 2: Next Sentence Prediction

![image-20240525223131068](/knowledge-assets/deep-learning/image-20240525223131068.png)

![image-20240525223145390](/knowledge-assets/deep-learning/image-20240525223145390.png)

![image-20240525223155163](/knowledge-assets/deep-learning/image-20240525223155163.png)

### AIBERT

 compact Model

Factorized embedding parameterization :

1:wordpiece embedding  size E is tied with the hidden layer size H

    VxE  ExH

2: Cross-layer sharing

3: inter-sentence coherence loss

    NSP contains both topical and ordering information

    Topical cues help more  model utilizes more

    Sop focuses on ordering not topical cues

4: additional data and removing dropout

1: factorized embedding par

![image-20210518091843940](/knowledge-assets/deep-learning/image-20210518091843940.png)

1: factorized embedding parameterization

原始的BERT模型以及各种依据transformer来搞的预训练语言模型在输入的地方我们会发现它的E是等于H的，其中E就是embedding size，H就是hidden size，也就是transformer的输入输出维度。这就会导致一个问题，当我们的hidden size提升的时候，embedding size也需要提升，这就会导致我们的embedding matrix维度的提升。所以这里作者将E和H进行了解绑，具体的操作其实就是在embedding后面加入一个矩阵进行维度变换。E是永远不变的，后面H提高了后，我们在E的后面进行一个升维操作，让E达到H的维度。这使得embedding参数的维度从O(V×H)到了O(V×E + E×H), 当E远远小于H的时候更加明显。

Cross-layer parameter sharing

跨层参数共享，就是不管12层还是24层都只用一个transformer。之前transformer的每一层参数都是独立的，包括self-attention 和全连接，这样的话当层数增加的时候，参数就会很明显的上升。之前有工作试过单独的将self-attention或者全连接进行共享，都取得了一些效果。这里作者尝试将所有的参数进行共享，这其实就导致多层的attention其实就是一层attention的叠加。

Sentence Order Prediction（SOP）

这里作者使用了一个新的loss，其实就是更改了原来BERT的一个子任务NSP, 原来NSP就是来预测下一个句子的，也就是一个句子是不是另一个句子的下一个句子。这个任务的问题出在训练数据上面，正例就是用的一个文档里面连续的两句话，但是负例使用的是不同文档里面的两句话。这就导致这个任务包含了主题预测在里面，而主题预测又要比两句话连续性的预测简单太多。新的方法使用了sentence-order prediction(SOP), 正例的构建和NSP是一样的，不过负例则是将两句话反过来。实验的结果也证明这种方式要比之前好很多。但是这个这里应该不是首创了，百度的ERNIE貌似也采用了一个这种的。

SOP 目标补偿了一部分因为 embedding 和 FFN 共享而损失的性能。Bert 原版的 NSP 目标过于简单了，它把”topic prediction”和“coherence prediction”融合了起来。SOP 对其加强，将负样本换成了同一篇文章中的两个逆序的句子，进而消除“topic prediction”。

### RoBERT

Dynamic masking  动态Mask

each sequence is masked in 10 different ways over the 40 epochs if training

original masking is performed during data preprocessing

原来的BERT是静态mask，即在数据预处理阶段把所有的数据都mask了，在训练阶段保持不变，即使在不同的epoch里。但这样显然是有问题的， 为此，在实践中我们把数据复制10份，然后统一进行mask，然后再保持不变，送入训练过程，相当于每种mask一共需要被看4次，而不是原来的40 次了。那么动态mask就是训一个mask一个，这样基本可以保证每次看到的都不一样。下面是BERT_base使用静态和动态mask的结果：

optimization hyperparameters

peak learning rate and number of warmup steps tuned separately for each setting

setting

training is very sensitive to the Adam epsilon term

setting B2 = 0.98 imporves stability when training with large batch sizes

Data :

not randomly inject short sequences

train only with full-length sequences

original model trains with a reduced sequence length for first 90% of updates

BooksCorpus ,CC-News OpenWebText Stories

Roberta尝试了一种动态的方式，说是动态，其实也是用静态的方式实现的，把数据复制10份，每一份中采用不同的Mask。这样就有了10种不同的Mask数据。

optimization hyperparameters : 优化超参数

batch-size : 变大 256 ->2K or 8K  **训练步数从1M降到500K**

将adam 的 beta2 从0.999 -> 0.98

在更长的序列上训练，修改输入格式：FULL-SENTENCES+移除NSP任务

Text Encoding：采用更大的byte-level的BPE[词典](https://www.zhihu.com/search?q=词典&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={)

Data :  增加了数据

Roberta在如下几个方面对Bert进行了调优：

- Masking策略——静态与动态
- 模型输入格式与Next Sentence Prediction
- Large-Batch
- 输入编码
- 大语料与更长的训练步数

### SpanBERT

Span masking

a random process to mask spans of tokens

Single sentence training

a single contiguous segment of text for each training sample

Span boundary objective (SBO)

predict the entire masked span using only the spans's boundary

这篇论文的主要贡献有三：

1. 提出了**更好的 Span Mask 方案**，也再次展示了随机遮盖连续一段字要比随机遮盖掉分散字好；
2. 通过**加入 Span Boundary Objective (SBO) 训练目标**，增强了 BERT 的性能，特别在一些与 Span 相关的任务，如抽取式问答；
3. 用实验获得了和 XLNet 类似的结果，发现**不加入 Next Sentence Prediction (NSP) 任务，直接用连续一长句训练效果更好**。

**（2）加入SBO 训练目标**

Span Boundary Objective 是该论文加入的新训练目标，希望被遮盖 Span 边界的词向量，能学习到 Span 的内容。或许作者想通过这个目标，让模型在一些需要 Span 的下游任务取得更好表现。具体做法是，在训练时取 Span 前后边界的两个词，这两个词不在 Span 内，然后用这两个词向量加上 Span 中被遮盖掉词的位置向量，来预测原词。

这样做的目的是：增强了 BERT 的性能，为了让模型让模型在一些需要 Span 的下游任务取得更好表现，特别在一些与 Span 相关的任务，如抽取式问答。

适用于指代消解 ，**在抽取式问答上表现好**

提出了**更好的 Span Mask 方案**，也再次展示了随机遮盖连续一段字要比随机遮盖掉分散字好；

通过**加入 Span Boundary Objective (SBO) 训练目标**，增强了 BERT 的性能，特别在一些与 Span 相关的任务，如抽取式问答；

用实验获得了和 XLNet 类似的结果，发现**不加入 Next Sentence Prediction (NSP) 任务，直接用连续一长句训练效果更好**。

相同点：模型架构相同

不同点：bert训练任务用了  **Masked LM，Next Sentence Prediction (NSP)**

spanbert训练用了 **Masked LM，Span Boundary Objective (SBO)**

**span masking**

**A random process to mask spans of tokens**

Single sentence training

**a single contiguous segment of text for each training sample**

**Span boudary objectiove  SBO**

对于为什么 NSP 没有用，这里，SpanBERT 作者们给出了下面两个解释：

1. 相比起两句拼接，一句长句，**模型可以获得更长上下文**（类似 XLNet 的一部分效果）；
2. 在 NSP 的负例情况下，基于另一个文档的句子来预测词，会**给 MLM 任务带来很大噪音**。

于是 SpanBERT 就没采用 NSP 任务，**直接一句长句，然后 MLM 加上 SBO 任务来进行预训练**。

SpanBERT对Bert的改进主要体现在对mask方式的改进，丢弃NSP任务和增加SBO（Span Boundary Objective）任务。其改进点如下：

Bert是随机mask输入序列中的字，这样能很简单地推测出字之间的搭配，这样会让本来应该有强相关的一些连在一起的字词，在训练时是割裂开来的。难以建立词中各个字之间的关联信息。针对这一短板Bert-wwm与ERNIE分别对更改了mask策略，Bert-wwm是mask所有能够连续组成词的字，ERNIE是mask所有能够连续组成实体和短语的字。

SpanBERT的做法是根据几何分布，先随机选择一段（span）的长度，之后再根据均匀分布随机选择这一段的起始位置，最后按照长度遮盖。文中使用几何分布取 p=0.2，最大长度只能是 10，利用此方案获得平均采样长度分布。

Span Boundary Objective 是该论文加入的新训练目标，希望被遮盖 Span 边界的词向量，能学习到 Span 的内容。或许作者想通过这个目标，让模型在一些需要 Span 的下游任务取得更好表现。具体做法是，在训练时取 Span 前后边界的两个词，这两个词不在 Span 内，然后用这两个词向量加上 Span 中被遮盖掉词的位置向量，来预测原词。

这样做的目的是：增强了 BERT 的性能，为了让模型让模型在一些需要 Span 的下游任务取得更好表现，特别在一些与 Span 相关的任务，如抽取式问答。

**去除NSP任务**

XLNet 中发现NSP不是必要的，而且两句拼接在一起使单句子不能俘获长距离的语义关系，所以作者剔除了NSP任务，直接一句长句做MLM任务和SBO任务。这样做的目的是：剔除没有必要的预训练任务，并且使模型获取更长距离的语义依赖信息。

### MASS

弥补BERT在NLP中生成能力不足的问题

MASS在一系列包括机器翻译，文本总结，对话生成的三个生成任务上进行了微调

### ERNIE

 Enhanced Representation Through knowledge integration

就引入命名实体（Named Entity）外部知识，**遮盖掉实体单元**，进行训练

![image-20210331150917175](/knowledge-assets/deep-learning/image-20210331150917175.png)

### XLNET

补充：

Pretring Language model+ Fine-tuning

较多的数据来适应新的形式，少样本学习能力差，容易过拟合

MOE:

sparse model

dense model

**自回归语言模型（Autoregressive LM）**

**自编码语言模型（Autoencoder LM）**

AR :

- full auto-regressive dependence
- free from ariticial Noise
- no Bidirectional context

AE:

- independecent assumption (Maskz之间)
- artificial Noise : [MASK]
- Natural bidirectioanl Context

**issues :**

1. independence assumption : ignore the dependency between masks  (两个mask 之间可能存在relation )
2. inputs  noise : discrepancy between pre-traing and fine-tuning

**Permutation Language Model : XLnet**

Goal : use AR and bidirectional contexts for prediction

- Sample a factorization order  对语序进行排列， 然后采样。
- determine the attention masks based on the order 采取attention 掩码机制
- optimize a standard language modeing objective

Sequence order is not shuffled .

attention masks are changed to reflect factorization order.

**Two-stream self-attention**

标准的AR 没有位置 信息， 从左向右

reduced to predicting a bag of  words

Solution : condition the distribution on the position

对某个token 位置：

如果预测 某个位置， 可以用它的位置， 但是不包含它的context

如果要预测其他位置， 应该包含这个位置

Content Stream:  包含自己  predict other tokens

Query Stream   ： 不encoder 自己  predict the current token

每一层都要计算 context stream 和query stream  后面才能计算

![image-20220512175638165](/knowledge-assets/deep-learning/image-20220512175638165.png)

e :  token embedding

w : postional embedding  + 学习的参数

![image-20240525234839875](/knowledge-assets/deep-learning/image-20240525234839875.png)

![image-20220512163019529](/knowledge-assets/deep-learning/image-20220512163019529.png)

预训练阶段最终预测只使用query stream，因为content stream已经见过当前token了。在精调阶段使用content stream，又回到了传统的self-attention结构。

另外，因为不像MLM只用预测部分token，还需要计算permutation，XLNet的计算量更大了，因此作者提出了partial prediction进行简化，即只预测后面1/K个token。

为了学习到更长距离的信息，作者沿用了自己的Transformer-XL。

总体读下来，还是感觉有很多地方可以自己琢磨一下，其实作者最后的实验也不是太充分，没有和BERT做充分的平等比较。不过新的想法还是难得的：

1. Permutation Language Modeling：先给我们统一了之前语言模型的思想框架（AR or AE），再一个permutation把两者的优点结合起来，而且整体框架又回归到了AR，感觉生成模型的新SOTA指日可待。
2. Transformer-XL + Relative segment encoding：这个不是作者重点强调的，但却让我觉得很有用处，目前短文本的任务还好，文本一长难度就会上去，段落级甚至文章级，这两个操作让我看到了NLU在长文本上取得更大成果的可能。

Apply Deep learning

```
学习记录
2022-5-11： 
8-1
attention 
encoder-decoder  attention  querty decoder 的时间点
self-attention   Q ，K，V 自己学

multi-head attention  多角度学习信息
idea : allow words to interact with one another
	Map  K,Q,V to lower dimensional sapeces
	Apply attention ,concatenate outputs
	Liner transformer
MulitHead(Q,k,V) = Concat(head1, ...headh)W
headi = attention(QW,kW,VW)

Why Scaled Dot-product attention ?
problem : when dk gets larger, the variance of qTk increase 
q and k are random variables with mean 0 and variance 1
qTk has mean 0 and virance dk
virance 1 is preferred 
solution :  scale by sqrt(dk)
Transformer 
non-recurrent encoder-decoder for MT(machine translate)

BERT:
contextualized word representations 
bidirection lstm  不是同时看到两边 
NER : 

word2vec
BERT: Bidirecitonal Encoder representations from transformers 
ERNIE : Enhandced representation through knoledge integration

SRCNN
《Learning a Deep Convolutional Network for Image Super-Resolution》
整篇论文的创新点有：
(1) 使用了一个卷积神经网络来进行超分，端到端的学习低分辨率与超分辨率之间的映射。
(2) 将提出的神经网络模型与传统的稀疏编码方法之间建立联系，这种联系还指导用来设计神经网络模型。
(3) 实验结果表明深度学习方法可以用于超分中，可以获得较好的质量和较快的速度。

整个的模型架构非常的简单，先是对于输入图片进行双三次插值采样到高分辨空间，然后使用一层卷积进行特征提取，再用ReLU进行非线性映射，最后使用一个卷积来进行重建，使用MSE来作为重建损失。中间一个插曲是将传统用于超分的稀疏编码算法进行了延伸，可以看作是一种具有不同非线性映射的卷积神经网络模型。
```

```
SRCNN
《Learning a Deep Convolutional Network for Image Super-Resolution》
整篇论文的创新点有：
(1) 使用了一个卷积神经网络来进行超分，端到端的学习低分辨率与超分辨率之间的映射。
(2) 将提出的神经网络模型与传统的稀疏编码方法之间建立联系，这种联系还指导用来设计神经网络模型。
(3) 实验结果表明深度学习方法可以用于超分中，可以获得较好的质量和较快的速度。

整个的模型架构非常的简单，先是对于输入图片进行双三次插值采样到高分辨空间，然后使用一层卷积进行特征提取，再用ReLU进行非线性映射，最后使用一个卷积来进行重建，使用MSE来作为重建损失。中间一个插曲是将传统用于超分的稀疏编码算法进行了延伸，可以看作是一种具有不同非线性映射的卷积神经网络模型。

```

Encoder :  BERT  SpanBERT

Generating tasks : GPT-2 GPT-3  Lamda

GPT-J code generate

LaMDA :  Language Models for Dialog Applications

### BART

**Token掩码**：与BERT的MLM一致，即随机选择token并进行mask；

**Token删除**：随机选择token进行删除，模型学习的是哪些位置删除了token;

**文本填充**：对文本进行Span Masking，与SpanBERT不同的是，这里每个Span被替换为一个 ![[公式]](https://www.zhihu.com/equation?tex=%5B%5Cmathbb+M%5D) 符号。文本填充的目的是使模型学习Span中有多个个token被mask掉了；

**句子排列**：文章按照句子终止符（句号，叹号等）分成句子的序列，然后按照这个序列进行打乱；

**文档旋转**：随机选择一个位置，然后将这个位置旋转至文章开始，这个任务是让模型学习文章的开始位置。

### T5

Text-to-Text transfer Transformer

input:

在输入的文本前添加任务特定的文本前缀 (task-specific prefifix ) 进行提示，这也就是最早的 Prompt

task-specific prefix: input text -> output text

one model for all tasks

<`<scaling instruction finetuned language models >`>

instruction finetuning 基于指令微调

1： 任务收集

监督数据集：  define 数据集，任务类型的形式

eg: 基于SQuAD数据集的问题生成任

chain-of-thought (Cot) 任务

C4 数据集

### Handing Out-of-vocabulary

Typical , such words are set to the **UNK** token and are assigned the same vector ,which is an ineffective choice if the number of OOV words is large

Subword Embeddings:

![image-20240525223522342](/knowledge-assets/deep-learning/image-20240525223522342.png)

![image-20240525223606263](/knowledge-assets/deep-learning/image-20240525223606263.png)

![image-20240525223619340](/knowledge-assets/deep-learning/image-20240525223619340.png)

## task

- token
- pos 词性标注
- ner
- synatatic analysis 句法分析
- sematic analysis  语义分析

### 分词 word segmentation

前向最大匹配算法

后向最大匹配算法

### 词性标注 pos tagging

序列标注任务

每个单词单独去做分类

对于当前单词以及上下文单词(sliding window) 去提取特征，并用这些特征去做分类

利用概率来表示序列

考虑单词之间的前后依赖关系

常见的算法：

- 隐马尔科夫模型（Hidden Markon Model) 生成模型
- 条件随机场（Conditional Random Fields）判别模型
- 最大熵 （Max Entropy）
- LSTM  + CRF
- BERT + BILstm + CRF

### 命名实体识别 Named entity Recongnitiaon

### 句法分析 Synatic Analysis

对一个句子的词语句法做分词， 比如主谓宾

S VP  V

依存语法  Depend parse

### 语义理解 Semantic Analysis

主要问题：

- 1. 如何理解一个单词的意识
- 1. 如何理解一个文本的意识

主要技术：

SkipGram ,Cbow ,Glove ,Elmo,BERT ,ALBERT ，XLNet ,Gpt-2,gpt-3 ,Tiny-BERT

常见的应用场景：

- 1. 写作助手
  2. 文本分类（情感分析， sentiment analys ， 情绪分析  emotion analysic , 主题分类  topic classification）
  3. 信息检索 infomation retrieval
  4. 问答系统 QA （直接返回答案）

     问题类型  Factoid QA  who /what/when /where

     问题的定义
- 5 自动生成文本摘要 （Text summary）

1. extractive method
2. abstractive method

6 机器翻译 machine traslate

- Rule-based method 语法树
- statistical method

7 信息抽取

ner 识别

关系抽取

### 论文检索：

google 学术

Google Scholar:

  按作者搜索：  author: "name "

    source: "nature"

    allintitle: "question answer"  //在标题中出现

    and or

1. survey
2. review
3. tutorial

DBLP：  https://dblp.uni-trier.de

微软学术：  https://academic.microsoft.com/home

中文检索库：

万方

维普

知网

https://www.ccf.org.cn/xspj/rgzn

ACL , EMNLP COLING NAACL

arXiv.org

机器之心 ， AI科技评论 ， PaperWeekly , DeepTech ,新智元

![image-20210607101952257](/knowledge-assets/deep-learning/image-20210607101952257.png)

走进一个新的领域：

关键词 ， 关键技术， 重要论文列表 ，领域划分， 领域大牛

综述， 优秀的学位论文

abstract introduction

![image-20210607102345344](/knowledge-assets/deep-learning/image-20210607102345344.png)

快速阅读：

abstract

introduction

cs方向：  problem-Driven （对前人工作的优化）

![image-20210607102557408](/knowledge-assets/deep-learning/image-20210607102557408.png)

# References:

- https://www.bilibili.com/video/BV1pT4y1D7H5/?spm_id_from=333.788
- https://zhuanlan.zhihu.com/p/580468546
- https://blog.csdn.net/qq_51957239/article/details/139013895
