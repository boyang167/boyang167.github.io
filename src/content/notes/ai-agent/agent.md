---
title: Agent
description: 一个典型的Agent运行流程一般会包括感知、推理、决策、执行、反馈等几个流程。其中：
date: '2026-03-12'
area: AI Agent
tags: []
language: zh-CN
draft: false
---
# Agent

一个典型的Agent运行流程一般会包括感知、推理、决策、执行、反馈等几个流程。其中：

**感知（Perception）** 主要是接收输入信息，这个信息可以是用户输入或者是通过传感器在环境中获取信息；

 **推理（Reasoning）** ：主要是综合上下文、环境感知信息等，分析输入数据并规划任务执行步骤；

 **决策（Decision Making）** ：通过推理得到的结果来选择合适的工具或操作;

 **执行（Action Execution）** ：调用 API、数据库或计算模块，完成任务；

 **反馈（Feedback & Learning）** ：分析执行结果，优化未来决策。

![1772454547885](/knowledge-assets/ai-agent/image/agent/1772454547885.png)

**一个标准的 Agent 系统由以下四个核心组件组成：**

1. **大脑 (LLM Core)** **:**-

   * **负责推理、规划和决策。**
   * **关键点****: 现在的模型不仅生成文本，还生成结构化动作（JSON/Function Calls）。**
2. **感知与记忆 (Memory & Context)** **:**

   * **短期记忆****: 当前对话的上下文窗口 (Context Window)。
   * ****长期记忆****: 向量数据库 (Vector DB) 存储的历史交互、知识库 (RAG)。
   * ****工作记忆****: 执行过程中的临时状态存储。**
3. **工具 (Tools/Actions)** **:**

   * **Agent 的手脚。可以是 API 调用、代码解释器 (Code Interpreter)、数据库查询、文件系统操作等。**
   * **关键范式****: Function Calling / Tool Use。**
4. **规划与反思 (Planning & Reflection)** **:**

   * **任务分解****: 将复杂目标拆解为子任务 (CoT, ToT)。
   * ****自我修正****: 执行失败后，分析错误日志并调整策略 (ReAct 模式)。

# Agent 设计的9种模式

## React

```
+-------------------+
|     接收任务      |
+-------------------+
           |
           v
+-------------------+
|     推理（Thought）|
+-------------------+
           |
           v
+-------------------+
|     行动（Action）  |
+-------------------+
           |
           v
+-------------------+
|     观察（Observation）|
+-------------------+
           |
           v
+-------------------+
|     循环迭代      |
+-------------------+
```

## Plan and Solve

## **Basic Reflection**

```
+-------------------+
|     接收任务      |
+-------------------+
           |
           v
+-------------------+
| 生成初始响应（Initial Response）|
+-------------------+
           |
           v
+-------------------+
|     反思（Reflection）|
+-------------------+
           |
           v
+-------------------+
|     修正（Revision）|
+-------------------+
           |
           v
+-------------------+
|     循环迭代      |
+-------------------+


```

## # RAG （Reteril Augement Generation）

检索，增强，生成

![1773061782385](/knowledge-assets/ai-agent/image/agent/1773061782385.png)

LLM 主要优化的手段有那些？

1. RAG
2. Prompt Engineering
3. Fine-tuning

![1773061912429](/knowledge-assets/ai-agent/image/agent/1773061912429.png)

https://cloud.tencent.com/developer/article/2373340

https://jishuzhan.net/article/1989091717279186946

## https://cloud.tencent.com/developer/article/2397124?policyId=1003

## https://cloud.tencent.com/developer/article/2378520

## https://www.cnblogs.com/shuezhang/p/17266646.html

https://cloud.tencent.com/developer/article/2397124?policyId=1003

## ** Language Agent Tree Search **

https://blog.csdn.net/m0_57081622/article/details/147892638

# Claude Code

**Claude Code 的"项目级理解"并不是模型本身的能力，而是通过本地工程化手段实现的！**

```
┌─────────────────────────────────────────────────────────┐
│                  Claude Code CLI                        │
│         (本地工具 - 项目理解的"大脑")                      │
│                                                         │
│  ✅ 扫描项目结构                                         │
│  ✅ 构建文件依赖图                                       │
│  ✅ 语义搜索和索引                                       │
│  ✅ 智能上下文管理                                       │
│  ✅ 上下文窗口优化                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ 发送精心构造的提示词（含项目上下文）
                     ↓
┌─────────────────────────────────────────────────────────┐
│           Claude Sonnet 4.5 模型                        │
│           (claude-sonnet-4-5-20250929)                 │
│                                                         │
│  ❌ 纯粹的语言模型                                       │
│  ❌ 没有项目级理解能力                                   │
│  ❌ 只能处理输入的文本                                   │
│  ✅ 基于提供的上下文生成回答                             │
└─────────────────────────────────────────────────────────┘


✅ 全部在本地 Claude Code CLI 实现


```

```python
class ClaudeCodeCLI:
    """Claude Code CLI 的核心架构（简化版）"""

    def __init__(self):
        # 所有这些组件都在您的本地电脑运行
        self.code_indexer = CodeIndexEngine()      # 1️⃣ 代码索引引擎
        self.dependency_analyzer = DependencyAnalyzer()  # 2️⃣ 依赖分析器
        self.ast_parser = ASTParser()              # 3️⃣ AST 解析器
        self.semantic_search = SemanticSearch()    # 4️⃣ 语义搜索系统
        self.context_manager = ContextManager()    # 5️⃣ 上下文管理器
```

1️⃣ 代码索引引擎（类似 LSP）

```python
def index_project(self, project_path):
    """
    扫描整个项目并建立索引
    - 识别所有代码文件
    - 提取类、函数、变量定义
    - 建立符号表
    """
    for file in scan_directory(project_path):
        symbols = extract_symbols(file)
        self.index[file] = symbols
```

2️⃣ 依赖关系分析器

```python
def analyze_dependencies(self, files):
    """
    静态分析代码依赖
    - 解析 import/require 语句
    - 构建模块依赖图
    - 识别循环依赖
    """
    dependency_graph = {}
    for file in files:
        imports = parse_imports(file)
        dependency_graph[file] = imports
    return dependency_graph
```

3️⃣ AST 解析器

```python
def parse_code_structure(self, file):
    """
    抽象语法树解析
    - 理解代码结构
    - 识别函数调用关系
    - 提取业务逻辑
    """
    ast = parse_to_ast(file)
    return extract_structure(ast)
```

4️⃣ 语义搜索系统

```python
def semantic_search(self, query, files):
    """
    基于向量嵌入的语义搜索
    - 将代码转换为向量
    - 计算相似度
    - 返回最相关的代码片段
    """
    query_embedding = embed(query)
    file_embeddings = {f: embed(content) for f, content in files.items()}

    similarities = {
        f: cosine_similarity(query_embedding, emb)
        for f, emb in file_embeddings.items()
    }

    return sorted(similarities.items(), key=lambda x: x[1], reverse=True)
```

5️⃣ 上下文管理器

```python
def build_optimal_context(self, relevant_files, max_tokens=100000):
    """
    智能选择和组织上下文
    - Token 预算分配
    - 优先级排序
    - 上下文压缩
    """
    context = []
    total_tokens = 0

    for file, priority in sorted(relevant_files, key=lambda x: x[1], reverse=True):
        file_tokens = count_tokens(file)
        if total_tokens + file_tokens <= max_tokens:
            context.append(file)
            total_tokens += file_tokens

    return self.format_context(context)
```

#### 2. 完整的工作流程

```python
def process_user_query(self, query):
    """Claude Code 处理用户查询的完整流程"""

    # ===== 步骤 1-5：全部在本地完成 =====

    # 1. 扫描项目（本地）
    project_files = self.scan_project()

    # 2. 构建依赖图（本地）
    dependency_graph = self.dependency_analyzer.analyze(project_files)

    # 3. 解析代码结构（本地）
    ast_trees = self.ast_parser.parse_all(project_files)

    # 4. 语义搜索相关文件（本地）
    relevant_files = self.semantic_search.find(query, project_files)

    # 5. 构建最优上下文（本地）
    optimal_context = self.context_manager.build_context(
        relevant_files,
        dependency_graph,
        max_tokens=200000
    )

    # ===== 步骤 6：构建提示词 =====

    prompt = f"""
    项目结构：
    {self.format_project_structure()}

    文件依赖关系：
    {self.format_dependency_graph(dependency_graph)}

    相关代码片段：
    {optimal_context}

    用户问题：
    {query}

    请基于以上项目上下文回答问题。
    """

    # ===== 步骤 7：调用云端 API =====

    # 这一步只是发送文本到 Claude API
    response = self.call_claude_api(prompt)

    return response


def call_claude_api(self, prompt):
    """
    调用 Claude API（可能通过慧言平台等中转）

    注意：这里发送的只是纯文本！
    API 端点由环境变量决定（可能是慧言平台）
    """
    api_endpoint = os.getenv(
        "ANTHROPIC_BASE_URL",
        "https://api.anthropic.com"
    )

    response = requests.post(
        f"{api_endpoint}/v1/messages",
        json={
            "model": "claude-sonnet-4-5-20250929",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 4096
        }
    )

    return response.json()
```

https://jishuzhan.net/article/1989091717279186946

https://www.ququ123.top/2026/03/openclaw-source-architecture-overview/

https://www.axtonliu.ai/newsletters/ai-2/posts/openclaw-architecture-deep-dive
