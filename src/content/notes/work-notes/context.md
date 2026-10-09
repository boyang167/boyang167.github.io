---
title: context
description: >-
  First CMC Hackathon We are happy to announce our very first hackathon — the
  CMC Ontology & Agentic AI Challenge.
date: '2026-03-29'
area: Work Notes
tags: []
language: en
draft: false
---
*** First CMC Hackathon ***
We are happy to announce our very first hackathon — the CMC Ontology & Agentic AI Challenge.

* We ask participants to design, develop and demonstrate a CMC ontology and agentic AI use cases where the ontology is a governed, machine-usable data layer that agents can query, validate against, and explain
* Final deliverable should be a working MVP
* We encourage teams to leverage any existing approaches and open-source tools (e.g. Palantir foundry, Graphql, LinkML-yaml, SPARQL, OWL/RDF)
* All GDT team members are welcomed to participate, each participating team should be no more than 2 people
* Prize pool: 300K RMB
* Timeline:
  — first submission (can be your approach or demo): April 2, in-person at WGQ, 5 min presentation for each team. RSVP to Xiaoxiao before March 25.
  — final competition (the MVP): tentatively May 6.
* Why CMC: Pharmaceutical Chemistry, Manufacturing & Controls (CMC) depends on clear definition of products, processes, materials, quality attributes, specifications and evidence across batch execution, in-process controls, analytical testing and release. In practice, knowledge is fragmented across BioFoundry, EBRs, ELN, LIMS, QMS, spreadsheets, powerpoints and word documents - hard for humans to stitch together, and hard for software to reason over consistently.
* What “AI-native / agentic” means here: We are not asking for chatbot, but a system that behave like agents: they decompose tasks, call tools (APIs, graph queries, validators, report builders), and cite the ontology objects and links that support their conclusions
* What good looks like:
  — well-defined CMC ontology that downstream code and agents can rely on
  — tool-grounded behavior (e.g., query, validate, generate)
  — multi-step workflows
  — governance and traceability, no fabricated data links
  — measurable success with real or high-quality synthetic data
  — reusable playbooks: domain data and workflow logic packaged as skills

Other important notes:

* CMC concepts, vocabularies, terminologies, naming conventions should be aligned to ICH, or ISA-88 guidelines
* Security guidelines on AI tool use must be respected
* Participating in the competition should not compromise your daily deliverables on project teams



![1774686748854](/knowledge-assets/work-notes/image/context/1774686748854.png)


在 OntoFlow 的设计里，本体建模不是孤立页面功能，而是一条从需求理解、数据探查、流程生成、**
              代码生成、图谱构建、知识服务到智能体技能封装的连续生产线。
