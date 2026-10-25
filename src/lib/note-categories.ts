/** raw/1-Note 下的一级目录（与 personal-knowledge-wiki 保持一致） */
export const NOTE_CATEGORY_ORDER = [
  '1-Bioinformatics&Data',
  '2-MachineLearning',
  '3-DeepLearning',
  '4-DataEngineering',
  '5-Infrastructure',
  '6-KnowledgeGraph',
  '7-Programming',
  '8-BigData',
  '9-Agent&Harness',
  '10-TechSharing',
] as const;

export const NOTE_CATEGORY_LABELS: Record<string, string> = {
  '1-Bioinformatics&Data': '1 · Bioinformatics & Data',
  '2-MachineLearning': '2 · Machine Learning',
  '3-DeepLearning': '3 · Deep Learning',
  '4-DataEngineering': '4 · Data Engineering',
  '5-Infrastructure': '5 · Infrastructure',
  '6-KnowledgeGraph': '6 · Knowledge Graph',
  '7-Programming': '7 · Programming',
  '8-BigData': '8 · Big Data',
  '9-Agent&Harness': '9 · Agent & Harness',
  '10-TechSharing': '10 · Tech Sharing',
};

export const NOTE_CATEGORY_ICONS: Record<string, string> = {
  '1-Bioinformatics&Data': '◉',
  '2-MachineLearning': '◉',
  '3-DeepLearning': '✳',
  '4-DataEngineering': '⌁',
  '5-Infrastructure': '▦',
  '6-KnowledgeGraph': '◈',
  '7-Programming': '⌘',
  '8-BigData': '⌁',
  '9-Agent&Harness': '✳',
  '10-TechSharing': '⌘',
};

export function categoryLabel(id: string): string {
  return NOTE_CATEGORY_LABELS[id] ?? id;
}

export function sortCategoryIds(ids: string[]): string[] {
  const known = new Set(NOTE_CATEGORY_ORDER);
  const ordered = NOTE_CATEGORY_ORDER.filter((id) => ids.includes(id));
  const extra = ids.filter((id) => !known.has(id)).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return [...ordered, ...extra];
}
