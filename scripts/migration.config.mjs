export const areaByDirectory = {
  "1-machine-learning": "Machine Learning",
  "2-deep-learning": "Deep Learning",
  "3-big-data": "Big Data",
  "6-language": "Programming",
  "7-Architecture": "Architecture",
  "8-web": "Web",
  "9-SRE": "SRE",
  "10-stock": "Finance",
  "11-protein": "Bioprocess",
  "12-sparkops": "Data Platform",
  "13-agent": "AI Agent",
  "14-work": "Work Notes",
};

export const excludedPathPatterns = [
  /(^|\/)\.gitee\//,
  /(^|\/)imgs\/prompts\//,
  /(^|\/)_(home|sidebar)\.md$/i,
  /(^|\/)README(?:[._-]en)?\.md$/i,
];

export const externalSources = [
  {
    prefix: "13-agent/claude-code-docs/docs/",
    source: "https://github.com/AnneHeartRecord/claude-code-docs",
    rawAssets:
      "https://raw.githubusercontent.com/AnneHeartRecord/claude-code-docs/main/imgs/",
  },
  {
    prefix: "13-agent/hermes-agent-anatomy/docs/",
    source: "https://github.com/AnneHeartRecord/hermes-agent-anatomy",
    rawAssets:
      "https://raw.githubusercontent.com/AnneHeartRecord/hermes-agent-anatomy/main/imgs/",
  },
];

export const seriesByPrefix = [
  {
    prefix: "13-agent/claude-code-docs/docs/",
    series: "Claude Code Anatomy",
    translationPrefix: "claude-code-docs",
    bilingual: true,
  },
  {
    prefix: "13-agent/hermes-agent-anatomy/docs/",
    series: "Hermes Agent Anatomy",
    translationPrefix: "hermes-agent-anatomy",
  },
];
