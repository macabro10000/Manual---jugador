import { writeFile } from "node:fs/promises";

const FEEDS = [
  { name: "BBC Mundo", url: "https://feeds.bbci.co.uk/mundo/rss.xml" },
  { name: "DW Español", url: "https://rss.dw.com/xml/rss-es-all" }
];
const MAX_PER_FEED = 40;
const TIMEOUT_MS = 12000;

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function tag(block, name) {
  const re = new RegExp("<(?:[\\w.-]+:)?" + name + "\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?" + name + "\\s*>", "i");
  return decodeXml(block.match(re)?.[1] || "");
}

function canonicalize(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_.+|fbclid|gclid|ocid|cmpid)$/i.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    return url.href;
  } catch { return null; }
}

function parseFeed(xml, source) {
  const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi)].slice(0, MAX_PER_FEED);
  return blocks.map((match) => {
    const block = match[2];
    let rawUrl = tag(block, "link");
    if (!rawUrl) {
      const href = block.match(/<(?:[\w.-]+:)?link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
      rawUrl = href?.[1] || "";
    }
    const url = canonicalize(rawUrl);
    const title = tag(block, "title");
    const dateRaw = tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "date");
    const timestamp = Date.parse(dateRaw);
    return {
      source,
      title,
      url,
      publishedAt: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null,
      dateValid: Number.isFinite(timestamp),
      urlValid: Boolean(url),
      titleValid: title.length >= 12,
      candidateId: url ? url.toLowerCase() : null
    };
  }).filter(item => item.title || item.url);
}

async function main() {
  const startedAt = new Date().toISOString();
  const results = await Promise.all(FEEDS.map(async feed => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(feed.url, {
        signal: controller.signal,
        headers: { "user-agent": "UNIVERSO-RSS-Audit/0.1 (read-only; contact: repository maintainer)", "accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5" }
      });
      const body = await response.text();
      if (!response.ok) throw new Error("HTTP " + response.status);
      if (!/<(?:rss|feed|rdf:RDF)\b/i.test(body)) throw new Error("La respuesta no parece un feed RSS/Atom");
      const entries = parseFeed(body, feed.name);
      return { source: feed.name, feedUrl: feed.url, ok: true, httpStatus: response.status, entriesRead: entries.length, entries };
    } catch (error) {
      return { source: feed.name, feedUrl: feed.url, ok: false, error: String(error?.message || error), entriesRead: 0, entries: [] };
    } finally { clearTimeout(timer); }
  }));

  const seen = new Set();
  let duplicateCount = 0;
  let invalidCount = 0;
  const candidates = [];
  for (const result of results) {
    for (const entry of result.entries) {
      if (!entry.urlValid || !entry.titleValid || !entry.dateValid) invalidCount++;
      if (entry.candidateId && seen.has(entry.candidateId)) { duplicateCount++; continue; }
      if (entry.candidateId) seen.add(entry.candidateId);
      candidates.push({ ...entry, eligibleForReview: entry.urlValid && entry.titleValid && entry.dateValid });
    }
  }

  const report = {
    mode: "READ_ONLY_DRY_RUN",
    startedAt,
    completedAt: new Date().toISOString(),
    policy: {
      publishesAutomatically: false,
      modifiesCatalog: false,
      sendsNotifications: false,
      urlResponseDoesNotProveStoryTruth: true,
      independentCorroborationRequiredBeforePublication: true
    },
    summary: {
      feedsConfigured: FEEDS.length,
      feedsSucceeded: results.filter(x => x.ok).length,
      entriesRead: results.reduce((sum, x) => sum + x.entriesRead, 0),
      uniqueUrlCandidates: seen.size,
      duplicateCount,
      entriesWithMissingOrInvalidFields: invalidCount,
      candidatesEligibleForHumanOrNextStageReview: candidates.filter(x => x.eligibleForReview).length
    },
    feeds: results.map(({ entries, ...meta }) => meta),
    candidates
  };

  await writeFile("rss-audit-report.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ mode: report.mode, summary: report.summary, feeds: report.feeds }, null, 2));
  if (results.every(x => !x.ok)) process.exitCode = 1;
}

main().catch(error => {
  console.error("RSS audit failed:", error);
  process.exitCode = 1;
});
