// Discover TapeOut projects that are not listed in README.md yet.
// Usage: node scripts/discover.mjs <report.md>  (prints the candidate count to stdout)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const SOURCE = /\.(js|mjs|cjs|ts|tsx|jsx|sol|py|rs|go|cs|html|vue|svelte|v|sv|c|cpp|swift)$/i;
// Strong signals name the protocol itself; weak signals only count in combination.
const STRONG = { "tapeout.net": /tapeout\.net/i, tapekit: /tapekit/i, "tape://": /tape:\/\//i, ".tape": /\b\d+\.\d+\.tape\b/i, "genesis transistor": /genesis transistor/i, tapehub: /tapehub/i };
const WEAK = { BEM: /\$BEM\b|\bBEM (token|mining|price)/, behemoth: /behemoth/i, ignix: /ignix/i, "x layer": /x ?layer/i, nand: /\bnand\b/i, latch: /\blatch\b/i, transistor: /transistor/i, bnb: /\b(bnb|bsc)\b/i, tapeout: /tape ?out/i };
const CHIP = { "tiny tapeout": /tiny ?tapeout/i, sky130: /sky130/i, gf180: /gf180/i, openlane: /openlane/i, caravel: /caravel/i, efabless: /efabless/i, gds: /\bgds(ii)?\b/i };
const QUERIES = ["tapeout BEM", "tapeout behemoth", "tapekit", "tapeout.net", "tapeout x layer", "genesis transistor", "tapeout nand latch", "tape deweb", "tapeout processor circuit", "TapeOut 流片"];
const X_QUERIES = ["tapeout github", "TapeOut 开源", "tapekit github", "Genesis Transistor github", "X Layer TapeOut github", "from:blonskr github", "TapeOut hackathon"];

const gh = (args) => JSON.parse(execFileSync("gh", ["api", ...args], { encoding: "utf8", maxBuffer: 1 << 26 }));
const ghText = (args) => { try { return execFileSync("gh", ["api", ...args], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "ignore"] }); } catch { return ""; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fetchText = async (url) => { try { const r = await fetch(url, { signal: AbortSignal.timeout(15_000), headers: { "user-agent": "awesome-tapeout-discover" } }); return r.ok ? await r.text() : ""; } catch { return ""; } };
const repoLinks = (text) => [...text.matchAll(/github\.com\/([\w.-]+)\/([\w.-]+)/gi)].map((m) => `${m[1]}/${m[2].replace(/\.git$/, "")}`).filter((r) => !/^(sponsors|orgs|topics|features|apps)\//i.test(r));
const hits = (text, table) => Object.entries(table).filter(([, re]) => re.test(text)).map(([k]) => k);

const listed = new Set([...read("README.md").matchAll(/github\.com\/([\w.-]+\/[\w.-]+)\)/g)].map((m) => m[1].toLowerCase()));
const rejected = new Set(read("data/rejected.txt").split("\n").map((l) => l.replace(/#.*/, "").trim().toLowerCase()).filter(Boolean));
const candidates = new Map(); // lowercased repo -> { repo, sources:Set, curated }
const add = (repo, source, curated = false) => {
  const key = repo.toLowerCase();
  if (listed.has(key) || rejected.has(key)) return;
  const c = candidates.get(key) || { repo, sources: new Set(), curated: false };
  c.sources.add(source);
  c.curated ||= curated;
  candidates.set(key, c);
};
// Source 1: community-verified directory maintained in the TapeOut Encyclopedia.
const encyclopedia = ghText(["repos/BruceLanLan/tapeout-encyclopedia-public/contents/content/public-github/repositories.json", "-H", "Accept: application/vnd.github.raw"]);
try { for (const r of JSON.parse(encyclopedia)) if (r.full_name) add(r.full_name, "encyclopedia", true); } catch { console.error("encyclopedia: unreadable"); }

// Source 2: tapeout.link site data, plus GitHub links found on each listed site.
const sitesJs = await fetchText("https://tapeout.link/data/sites.js");
const siteUrls = [...new Set([...sitesJs.matchAll(/url:\s*'(https?:\/\/[^']+)'/g)].map((m) => m[1]))];
for (const url of siteUrls) {
  const io = url.match(/^https?:\/\/([\w-]+)\.github\.io\/([\w.-]+)/i);
  if (io) add(`${io[1]}/${io[2]}`, "tapeout.link");
}
for (let i = 0; i < siteUrls.length; i += 8) {
  const pages = await Promise.all(siteUrls.slice(i, i + 8).map(fetchText));
  pages.forEach((html) => repoLinks(html).forEach((r) => add(r, "tapeout.link")));
}
repoLinks(sitesJs).forEach((r) => add(r, "tapeout.link"));

// Source 3: GitHub repository search, limited to recently pushed repositories.
const searchMeta = new Map();
const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
for (const q of QUERIES) {
  try {
    const res = gh(["-X", "GET", "search/repositories", "-f", `q=${q} in:name,description,readme pushed:>=${since}`, "-f", "per_page=30"]);
    for (const item of res.items) {
      if (hits(`${item.name} ${item.description || ""}`, CHIP).length) continue;
      searchMeta.set(item.full_name.toLowerCase(), item);
      add(item.full_name, `search: ${q}`);
    }
  } catch (err) { console.error(`search "${q}": ${err.message.split("\n")[0]}`); }
  await sleep(2500); // stay well under the search API limit
}

// Evaluate: public, original, active, has source code, and actually about the TapeOut protocol.
const found = [];
for (const c of candidates.values()) {
  let meta = searchMeta.get(c.repo.toLowerCase());
  if (!meta) { try { meta = gh([`repos/${c.repo}`]); } catch { continue; } }
  if (meta.private || meta.fork || meta.archived || listed.has(meta.full_name.toLowerCase()) || rejected.has(meta.full_name.toLowerCase())) continue;
  const readme = ghText([`repos/${meta.full_name}/readme`, "-H", "Accept: application/vnd.github.raw"]).slice(0, 60_000);
  const text = `${meta.name} ${meta.description || ""} ${readme}`;
  const strong = hits(text, STRONG), weak = hits(text, WEAK), chip = hits(text, CHIP);
  const ecosystem = weak.some((w) => ["BEM", "behemoth", "ignix"].includes(w));
  if (!c.curated && !strong.length && !(ecosystem && weak.length >= 3)) continue;
  if (!c.curated && chip.length && !strong.length) continue;
  let sources = 0;
  try { sources = gh([`repos/${meta.full_name}/git/trees/HEAD?recursive=1`]).tree.filter((f) => f.type === "blob" && SOURCE.test(f.path)).length; } catch { /* empty repository */ }
  if (!sources) continue;
  found.push({ meta, sources, strong, weak, chip, from: [...c.sources] });
}

found.sort((a, b) => b.strong.length - a.strong.length || b.meta.pushed_at.localeCompare(a.meta.pushed_at));
const cell = (s) => String(s || "").replace(/\|/g, "\\|").replace(/\s+/g, " ").slice(0, 140);
const today = new Date().toISOString().slice(0, 10);
const lines = [
  `Daily discovery run on ${today}: **${found.length}** candidate(s) not yet in the list.`,
  "",
  "Review each one. Add good entries to `README.md`; put rejected ones in `data/rejected.txt` so they stop showing up.",
  "",
];
if (found.length) {
  lines.push("| Repository | Description | Lang | ★ | Pushed | Signals | Found via |", "|---|---|---|---|---|---|---|");
  for (const f of found) {
    const signals = [...f.strong.map((s) => `**${s}**`), ...f.weak, ...f.chip.map((s) => `⚠️${s}`)].join(", ");
    lines.push(`| [${f.meta.full_name}](${f.meta.html_url}) | ${cell(f.meta.description)} | ${f.meta.language || "-"} | ${f.meta.stargazers_count} | ${f.meta.pushed_at.slice(0, 10)} | ${signals} | ${f.from.join(", ")} |`);
  }
}
lines.push("", "### Manual X search", "", "X needs a logged-in browser, so check these by hand (latest posts first):", "");
for (const q of X_QUERIES) lines.push(`- [${q}](https://x.com/search?q=${encodeURIComponent(q)}&f=live)`);
writeFileSync(process.argv[2] || "candidates.md", `${lines.join("\n")}\n`);
console.log(found.length);
