import assert from "node:assert/strict";
import test from "node:test";

import {
  buildKnowledgeTree,
  findAdjacent,
  findTranslation,
} from "../src/lib/knowledge.mjs";

const entries = [
  {
    id: "ai/02-loop-zh",
    data: {
      title: "02 Agent 循环",
      area: "AI Agent",
      series: "Agent",
      order: 2,
      language: "zh-CN",
      translationKey: "agent/02",
      date: new Date("2026-10-02"),
    },
  },
  {
    id: "sre/docker",
    data: {
      title: "Docker",
      area: "SRE",
      series: "Containers",
      language: "zh-CN",
      date: new Date("2026-09-01"),
    },
  },
  {
    id: "ai/01-architecture",
    data: {
      title: "01 Architecture",
      area: "AI Agent",
      series: "Agent",
      order: 1,
      language: "en",
      translationKey: "agent/01",
      date: new Date("2026-10-01"),
    },
  },
  {
    id: "ai/02-loop-en",
    data: {
      title: "02 Agent Loop",
      area: "AI Agent",
      series: "Agent",
      order: 2,
      language: "en",
      translationKey: "agent/02",
      date: new Date("2026-10-02"),
    },
  },
];

test("builds areas and series in stable reading order", () => {
  const tree = buildKnowledgeTree(entries);

  assert.deepEqual(
    tree.map((area) => area.name),
    ["AI Agent", "SRE"],
  );
  assert.equal(tree[0].series[0].name, "Agent");
  assert.equal(tree[0].series[0].entries[0].title, "01 Architecture");
});

test("finds the other language for a translation key", () => {
  assert.equal(
    findTranslation(entries[0], entries)?.id,
    "ai/02-loop-en",
  );
});

test("keeps adjacent navigation in the same series and language", () => {
  const adjacent = findAdjacent(entries[2], entries);

  assert.equal(adjacent.previous, undefined);
  assert.equal(adjacent.next?.id, "ai/02-loop-en");
});
