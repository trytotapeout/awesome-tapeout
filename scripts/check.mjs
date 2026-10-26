// Verify every GitHub repo linked in README.md is public, not empty, and contains source files.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = /\.(js|mjs|cjs|ts|tsx|jsx|sol|py|rs|go|cs|html|vue|svelte|v|sv|c|cpp|swift)$/i;
const readmePath = new URL("../README.md", import.meta.url);
const readme = readFileSync(readmePath, "utf8");
const prune = process.argv.includes("--prune");
const repos = [...new Set([...readme.matchAll(/\]\(https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\)/g)].map((m) => m[1]))];

const gh = (args) => JSON.parse(execFileSync("gh", ["api", ...args], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "pipe"] }));
const isNotFound = (err) => /\(HTTP 404\)/.test(String(err.stderr));
// Only a 404 from the repository metadata endpoint can trigger removal.
// A missing tree (e.g. an empty repository) must never remove an entry.
const metadata = (repo) => {
  try { return gh([`repos/${repo}`]); }
  catch (err) {
    if (!prune || !isNotFound(err)) throw err;
    try { return gh([`repos/${repo}`]); }
    catch (confirmation) {
      if (!isNotFound(confirmation)) throw confirmation;
      return null;
    }
  }
};
const removed = new Set();
let failed = 0;
for (const repo of repos) {
  try {
    const meta = metadata(repo);
    if (!meta) {
      // The list format is one project per bullet. Refuse to delete other text.
      const lines = readme.split(/\r?\n/).filter((line) => line.includes(`](https://github.com/${repo})`));
      if (!lines.length || lines.some((line) => !/^\s*- \[/.test(line) || [...line.matchAll(/\]\(https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\)/g)].length !== 1)) {
        throw new Error("404 confirmed, but entry is not a standalone project bullet; remove manually");
      }
      removed.add(repo);
      console.log(`REMOVE ${repo}: repository unavailable (HTTP 404 confirmed twice)`);
      continue;
    }
    const tree = gh([`repos/${meta.full_name}/git/trees/HEAD?recursive=1`]).tree;
    const sources = tree.filter((f) => f.type === "blob" && SOURCE.test(f.path)).length;
    const problems = [meta.private && "private", meta.archived && "archived", sources === 0 && "no source files"].filter(Boolean);
    if (meta.full_name.toLowerCase() !== repo.toLowerCase()) problems.push(`renamed to ${meta.full_name}`);
    if (problems.length) { failed++; console.log(`FAIL ${repo}: ${problems.join(", ")}`); }
    else console.log(`ok   ${repo} (${sources} source files)`);
  } catch (err) {
    failed++;
    console.log(`FAIL ${repo}: ${String(err.stderr || err.message).trim().replace(/\s+/g, " ")}`);
  }
}
if (removed.size) {
  const updated = readme.split(/(?<=\n)/).filter((line) => ![...removed].some((repo) => line.includes(`](https://github.com/${repo})`))).join("");
  writeFileSync(readmePath, updated);
}
console.log(`\n${repos.length - failed - removed.size}/${repos.length - removed.size} repositories passed; ${removed.size} unavailable repositories removed`);
process.exit(failed ? 1 : 0);
