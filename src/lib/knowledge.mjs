const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function seriesName(entry) {
  return entry.data.series || "General";
}

function compareEntries(left, right) {
  const orderDifference =
    (left.data.order ?? Number.POSITIVE_INFINITY) -
    (right.data.order ?? Number.POSITIVE_INFINITY);
  if (orderDifference) return orderDifference;
  const dateDifference =
    new Date(right.data.updated || right.data.date).valueOf() -
    new Date(left.data.updated || left.data.date).valueOf();
  if (dateDifference) return dateDifference;
  return collator.compare(left.data.title, right.data.title);
}

function toSummary(entry) {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    area: entry.data.area,
    series: seriesName(entry),
    language: entry.data.language,
    order: entry.data.order,
    date: entry.data.date,
    updated: entry.data.updated,
    entry,
  };
}

export function buildKnowledgeTree(entries) {
  const areas = new Map();
  for (const entry of entries) {
    const area = entry.data.area;
    if (!areas.has(area)) areas.set(area, new Map());
    const series = seriesName(entry);
    const areaSeries = areas.get(area);
    if (!areaSeries.has(series)) areaSeries.set(series, []);
    areaSeries.get(series).push(entry);
  }

  return [...areas.entries()]
    .sort(([left], [right]) => collator.compare(left, right))
    .map(([name, series]) => ({
      name,
      count: [...series.values()].reduce(
        (total, seriesEntries) => total + seriesEntries.length,
        0,
      ),
      series: [...series.entries()]
        .sort(([left], [right]) => collator.compare(left, right))
        .map(([seriesName, seriesEntries]) => ({
          name: seriesName,
          entries: [...seriesEntries]
            .sort(compareEntries)
            .map(toSummary),
        })),
    }));
}

export function findTranslation(entry, entries) {
  const key = entry.data.translationKey;
  if (!key) return undefined;
  return entries.find(
    (candidate) =>
      candidate.id !== entry.id &&
      candidate.data.translationKey === key &&
      candidate.data.language !== entry.data.language,
  );
}

export function findAdjacent(entry, entries) {
  const candidates = entries
    .filter(
      (candidate) =>
        candidate.data.area === entry.data.area &&
        seriesName(candidate) === seriesName(entry) &&
        candidate.data.language === entry.data.language,
    )
    .sort(compareEntries);
  const index = candidates.findIndex(
    (candidate) => candidate.id === entry.id,
  );
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: candidates[index - 1],
    next: candidates[index + 1],
  };
}
