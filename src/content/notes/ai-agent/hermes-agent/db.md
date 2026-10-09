---
title: db
description: ❯ hermer agent 底层的数据库是怎么设计的
date: '2026-06-30'
area: AI Agent
tags: []
language: zh-CN
series: hermes-agent
draft: false
---
❯ hermer-agent 底层的数据库是怎么设计的                                                                                                                        
                                                                                                                                                                
 ┊  Hermes Agent 底层数据库设计                                                                                                                                 
                                                                                                                                                                
    Hermes Agent 的持久化层以 SQLite 为核心，不是分布式数据库，也不是 ORM 栈。主路径是 两个独立的 .db 文件，外加少量 文件型 存储（轨迹 JSONL、看板附件等）。    
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    总体架构                                                                                                                                                    
                                                                                                                                                                
      ─ mermaid                                                                                                                                                 
      flowchart TB                                                                                                                                              
          subgraph profile ["~/.hermes/profiles/&lt;name&gt;/ 或 ~/.hermes/"]                                                                                   
              state["state.db\n(SessionDB)"]                                                                                                                    
              kanban["kanban.db\n(Kanban)"]                                                                                                                     
          end                                                                                                                                                   
          CLI["CLI / TUI"] --> state                                                                                                                            
          Gateway["Gateway 多平台"] --> state                                                                                                                   
          Web["Dashboard / Web API"] --> state                                                                                                                  
          Agent["AIAgent 对话循环"] --> state                                                                                                                   
          Dispatcher["Kanban Dispatcher"] --> kanban                                                                                                            
          Worker["Kanban Worker"] --> kanban                                                                                                                    
          kanban -. "session_id 软引用" .-> state                                                                                                               
          state --> FTS["FTS5\nmessages_fts + trigram"]                                                                                                         
                                                                                                                                                                
      数据库     默认路径（Windows）              实现文件                 用途                                                                                 
      ─────────  ───────────────────────────────  ───────────────────────  ────────────────────────────────────                                                 
      state.db   %LOCALAPPDATA%\hermes\state.db   hermes_state.py          会话元数据 + 完整消息历史 + 全文搜索                                                 
      kanban.db  %LOCALAPPDATA%\hermes\kanban.db  hermes_cli/kanban_db.py  多 Agent 看板任务协调                                                                
                                                                                                                                                                
    仓库里还有可视化 ER 图：schema/hermes-backend.dbml（可导入 dbdiagram.io）。                                                                                 
                                                                                                                                                                
    Profile 隔离：每个 Hermes profile 有自己的 state.db（在 ~/.hermes/profiles/<name>/state.db）。看板库默认在 共享 root 下，跨 profile 协调任务。              
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    1. state.db — 会话存储（核心）                                                                                                                              
                                                                                                                                                                
    由 SessionDB 类管理，设计目标在文件头写得很清楚：                                                                                                           
                                                                                                                                                                
      ─ 1:15:hermes_state.py                                                                                                                                    
      #!/usr/bin/env python3                                                                                                                                    
      """                                                                                                                                                       
      SQLite State Store for Hermes Agent.                                                                                                                      
      Provides persistent session storage with FTS5 full-text search, replacing                                                                                 
      the per-session JSONL file approach. Stores session metadata, full message                                                                                
      history, and model configuration for CLI and gateway sessions.                                                                                            
      Key design decisions:                                                                                                                                     
      - WAL mode for concurrent readers + one writer (gateway multi-platform)                                                                                   
      - FTS5 virtual table for fast text search across all session messages                                                                                     
      - Compression-triggered session splitting via parent_session_id chains                                                                                    
      - Batch runner and RL trajectories are NOT stored here (separate systems)                                                                                 
      - Session source tagging ('cli', 'telegram', 'discord', etc.) for filtering                                                                               
      """                                                                                                                                                       
                                                                                                                                                                
    核心表结构                                                                                                                                                  
                                                                                                                                                                
    sessions — 会话元数据（一行一个 session）                                                                                                                   
                                                                                                                                                                
    • 主键：id（UUID 风格 session id）                                                                                                                          
    • 来源：source（cli / telegram / discord / cron / dashboard 等）                                                                                            
    • 谱系：parent_session_id → 自引用 FK，用于 上下文压缩拆分 和 分支会话                                                                                      
    • 统计：message_count、tool_call_count、各类 token 计数、api_call_count                                                                                     
    • 计费：billing_*、estimated_cost_usd、actual_cost_usd 等                                                                                                   
    • 状态：title、archived、end_reason、handoff_*（跨平台 handoff）                                                                                            
    • 模型：model、model_config（JSON）、system_prompt、cwd                                                                                                     
                                                                                                                                                                
    messages — 完整对话历史（OpenAI 消息格式）                                                                                                                  
                                                                                                                                                                
    • 主键：自增 id                                                                                                                                             
    • 外键：session_id → sessions.id                                                                                                                            
    • 角色：role（user / assistant / tool / system …）                                                                                                          
    • 内容：content（多模态会 JSON 编码）、tool_calls、tool_name、reasoning*、codex_*                                                                           
    • 软删除：active（0 = rewind/undo 后的“无效”消息，默认搜索排除）                                                                                            
    • 平台映射：platform_message_id（Telegram/Yuanbao 等外部消息 id）                                                                                           
                                                                                                                                                                
    state_meta — KV 元数据（prune 时间戳、Telegram topic schema 版本等）                                                                                        
                                                                                                                                                                
    compression_locks — 压缩锁（防止同一会话被两条压缩路径同时处理）                                                                                            
                                                                                                                                                                
    可选 Telegram 表（启用 /topic 后才创建）：                                                                                                                  
                                                                                                                                                                
    • telegram_dm_topic_mode                                                                                                                                    
    • telegram_dm_topic_bindings（chat/thread → session_id，带 ON DELETE CASCADE）                                                                              
                                                                                                                                                                
    当前 schema 版本：v15（SCHEMA_VERSION = 15）。                                                                                                              
                                                                                                                                                                
    关系模型（简化）                                                                                                                                            
                                                                                                                                                                
      sessions (1) ──< messages (N)                                                                                                                             
      sessions (1) ──< sessions (N)   [parent_session_id 压缩链/分支]                                                                                           
      messages (1) ── messages_fts (1) [FTS5 rowid = messages.id，触发器同步]                                                                                   
                                                                                                                                                                
    FTS5 全文搜索                                                                                                                                               
                                                                                                                                                                
    两套虚拟表 + 触发器自动维护：                                                                                                                               
                                                                                                                                                                
    1. messages_fts — unicode61 分词，英文/关键词搜索                                                                                                           
    2. messages_fts_trigram — trigram 分词，CJK/子串 搜索                                                                                                       
                                                                                                                                                                
    索引文本 = content + tool_name + tool_calls 拼接：                                                                                                          
                                                                                                                                                                
      ─ 326:343:hermes_state.py                                                                                                                                 
      CREATE TRIGGER IF NOT EXISTS messages_fts_insert AFTER INSERT ON messages BEGIN                                                                           
          INSERT INTO messages_fts(rowid, content) VALUES (                                                                                                     
              new.id,                                                                                                                                           
              COALESCE(new.content, '') || ' ' || COALESCE(new.tool_name, '') || ' ' || COALESCE(new.tool_calls, '')                                            
          );                                                                                                                                                    
      END;                                                                                                                                                      
                                                                                                                                                                
    Agent 的 session_search 工具、Dashboard 的 /api/sessions/search、CLI 的 /resume 搜索都走这条链路。                                                          
                                                                                                                                                                
    Schema 演进策略                                                                                                                                             
                                                                                                                                                                
    采用 声明式列对齐（reconcile），而非大量版本迁移脚本：                                                                                                      
                                                                                                                                                                
    • SCHEMA_SQL 是唯一真相源                                                                                                                                   
    • 启动时用 PRAGMA table_info 对比，自动 ADD COLUMN 缺失列                                                                                                   
    • schema_version 表仅保留给 需要改数据的迁移（不能声明式完成的）                                                                                            
                                                                                                                                                                
    并发与可靠性                                                                                                                                                
                                                                                                                                                                
    • WAL 模式：多读者 + 单写者（Gateway 多平台并发）                                                                                                           
    • NFS/SMB 回退：WAL 不可用时自动降级为 DELETE journal                                                                                                       
    • 写冲突：短 timeout（1s）+ 应用层随机 jitter 重试（最多 15 次）                                                                                            
    • 只读连接：跨 profile 聚合时用 mode=ro，避免写锁争用                                                                                                       
    • Cron 运行记录：不单独建表，而是 source='cron' 且 id 形如 cron_{job_id}_{timestamp} 的 session                                                             
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    2. kanban.db — 看板任务库                                                                                                                                   
                                                                                                                                                                
    独立 SQLite 文件，与 state.db 无 SQL 外键，只有逻辑引用（如 tasks.session_id → 创建任务时的 agent session）。                                               
                                                                                                                                                                
    主要表                                                                                                                                                      
                                                                                                                                                                
      表                  作用                                                                                                                                  
      ──────────────────  ─────────────────────────────────────────────────────────────────────                                                                 
      tasks               任务卡片：状态、优先级、workspace、claim 锁、worker PID、goal loop 等                                                                 
      task_links          任务依赖 DAG（parent → child）                                                                                                        
      task_comments       评论                                                                                                                                  
      task_runs           每次 claim/重试的运行记录                                                                                                             
      task_events         事件流（供 notifier 推送）                                                                                                            
      task_attachments    附件（磁盘路径，不在 BLOB 里）                                                                                                        
      kanban_notify_subs  订阅某任务的平台/chat，用于 Gateway 通知                                                                                              
                                                                                                                                                                
    并发模型                                                                                                                                                    
                                                                                                                                                                
    • WAL + BEGIN IMMEDIATE                                                                                                                                     
    • CAS（Compare-And-Swap） 更新 tasks.status / claim_lock                                                                                                    
    • Claim TTL 默认 15 分钟，worker 需 heartbeat                                                                                                               
    • 支持 多 board（kanban/boards/<slug>/kanban.db），默认 board 仍用 root 的 kanban.db 做向后兼容                                                             
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    3. 不在 SQLite 里的东西                                                                                                                                     
                                                                                                                                                                
      数据                 存储方式                     说明                                                                                                    
      ───────────────────  ───────────────────────────  ────────────────────────────────────────────                                                            
      对话轨迹（RL/训练）  trajectory_samples.jsonl 等  save_trajectories=True 时写入，不进 state.db                                                            
      Batch 批处理         独立 JSONL 输入/输出         batch_runner.py，每条 prompt 独立 session                                                               
      遗留会话             ~/.hermes/sessions/*.jsonl   已废弃，现统一用 state.db                                                                               
      Memory 插件          各插件自有后端               honcho/mem0/supermemory 等，不是 core DB                                                                
      配置/密钥            config.yaml + .env           非关系库                                                                                                
      日志                 ~/.hermes/logs/*.log         文件日志                                                                                                
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    4. 典型读写路径                                                                                                                                             
                                                                                                                                                                
      用户发消息                                                                                                                                                
        → AIAgent.run_conversation()                                                                                                                            
          → SessionDB.create_session() / append_message()                                                                                                       
            → INSERT messages                                                                                                                                   
            → 触发器更新 messages_fts / messages_fts_trigram                                                                                                    
            → UPDATE sessions 计数器                                                                                                                            
      /resume 或 session_search                                                                                                                                 
        → SessionDB.search_sessions() / search_messages()                                                                                                       
          → FTS5 MATCH 或 trigram/LIKE 回退                                                                                                                     
          → JOIN sessions + messages                                                                                                                            
      上下文压缩                                                                                                                                                
        → 结束旧 session（end_reason='compression'）                                                                                                            
        → 新建 session，parent_session_id 指向旧 session                                                                                                        
        → compression_locks 防并发压缩                                                                                                                          
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    5. 如何本地查看                                                                                                                                             
                                                                                                                                                                
      ─ powershell                                                                                                                                              
      # 导出 live schema                                                                                                                                        
      sqlite3 "$env:LOCALAPPDATA\hermes\state.db" ".schema"                                                                                                     
      # 或直接打开 DB 浏览器看表                                                                                                                                
                                                                                                                                                                
    ────────────────────────────────────                                                                                                                        
                                                                                                                                                                
    一句话总结：Hermes 底层是 Profile 级 state.db（会话+消息+FTS5）+ 共享级 kanban.db（任务协调） 的双库 SQLite 设计；消息以 OpenAI 格式存 relational           
    表，搜索靠 FTS5 双索引，谱系靠 parent_session_id 链，并发靠 WAL + 应用层重试；训练轨迹和批处理等走独立 JSONL，不进核心库。                                  
                                                                                                                                                                
    如果你想深入某一块（例如压缩拆分、active 软删除、或 Kanban claim 流程），可以说一下，我可以按代码路径展开。                                                 
                                                                                                                        

                                                                    . 核心思想
它把 Agent 的运行数据分成两类：

原始事实数据：真正的会话和消息，存在 sessions、messages 表。

检索加速数据：为了搜索快，额外维护 messages_fts、messages_fts_trigram 两套全文索引。

也就是说，messages 是权威数据源，FTS 表只是“搜索目录”。目录坏了可以重建，原始消息不能丢。

2. 写入链路
用户在前端问一句话时，逻辑是：

前端提交问题
  ↓
后端确保 sessions 有一条会话记录
  ↓
把用户问题 append 到内存 messages
  ↓
立即持久化用户问题，防止中途崩溃丢失
  ↓
Agent 调模型、执行工具、继续循环
  ↓
把 assistant 回复、tool_calls、tool 结果继续追加到 messages
  ↓
统一 flush 新增消息到 SQLite
这个设计的优点是：不等整轮完成才保存。用户问题先落库，后面模型失败也能恢复上下文。

3. 表结构分层
可以借鉴成 5 个层次：

sessions
  保存会话元信息：来源、模型、标题、父会话、成本、token、状态
messages
  保存完整消息流：user / assistant / tool / tool_calls / reasoning
messages_fts
  英文/关键词搜索索引
messages_fts_trigram
  中文/CJK/子串搜索索引
state_meta / schema_version / locks
  保存迁移版本、锁、运行控制状态
其中最关键的是 sessions.parent_session_id。它让系统支持：

上下文压缩后新建 continuation session
分支会话
子 agent 会话
resume 时沿 lineage 找到最新会话
这比把所有历史都塞进一个无限增长的 session 更稳。

4. 搜索设计
搜索不是直接扫 messages，而是查 FTS 索引。

每次 messages 写入时，数据库 trigger 自动把这些字段拼起来：

content + tool_name + tool_calls
然后写入 FTS 表。

这样搜索时不仅能搜聊天文本，还能搜到：

工具名，比如 read_file
文件路径
命令参数
tool call JSON 里的关键词
这对 Agent 项目很重要，因为很多关键信息并不在 assistant 文本里，而在工具调用参数和工具结果里。

5. 为什么两套 FTS
messages_fts 适合英文关键词搜索。

messages_fts_trigram 适合中文、日文、韩文、任意子串搜索。

普通英文分词依赖空格，但中文没有天然空格。trigram 会把文本切成连续小片段，所以用户搜一段中文短语时也能命中。

可借鉴原则是：不要假设所有用户语言都适合英文分词器。

6. 并发与可靠性
这个项目考虑了多个入口同时写数据库：

CLI
TUI
Web UI
Gateway
子 Agent
cron / background task
所以它用了：

SQLite WAL
  支持多个读者 + 一个写者
BEGIN IMMEDIATE
  写事务开始时就抢写锁，避免提交时才失败
应用层随机退避重试
  database locked 时 20-150ms 抖动重试
定期 WAL checkpoint
  防止 WAL 文件无限膨胀
如果你的项目也有多进程/多线程共享本地数据库，这套设计很值得借鉴。

7. 迁移策略
它没有把每次加字段都写成复杂 migration，而是把 SCHEMA_SQL 当成目标结构。

启动时：

读取当前表字段
  ↓
和 SCHEMA_SQL 声明字段对比
  ↓
缺什么列就 ALTER TABLE ADD COLUMN
这叫“声明式补列”。优点是简单、自修复、幂等。

但数据重建类迁移，比如 FTS 重建、旧数据回填，仍然用 schema_version 控制。

可借鉴原则：

加字段：声明式 reconcile
改数据：版本化 migration
8. 适合其他项目复用的模板
如果你做的是 Agent、聊天系统、知识库、客服助手、IDE 助手，可以按这个模型设计：

Conversation Store
  sessions(id, source, title, parent_id, model, status, counters...)
  messages(id, session_id, role, content, metadata_json, active...)
Search Index
  messages_fts(content)
  messages_fts_trigram(content)
Triggers
  messages insert/update/delete 自动同步 FTS
Runtime Control
  locks
  schema_version
  state_meta
再加几个工程原则：

原始数据和搜索索引分离。
搜索索引可以重建，消息原文必须可靠。
用户输入先落库，模型完成后补齐回复。
工具调用参数也纳入搜索。
中文/英文搜索分开优化。
删除优先软删除，比如 active=0，方便 rewind 和审计。
长会话不要无限增长，用 parent_session_id 做 lineage。
SQLite 足够好，但要认真处理锁、WAL、迁移和 checkpoint。
一句话总结：这个设计不是单纯“存聊天记录”，而是为长期运行的 Agent 做的本地状态系统：既能恢复、搜索、分支、压缩，又能让前端、CLI 和 Agent 自己共享同一套历史数据。
