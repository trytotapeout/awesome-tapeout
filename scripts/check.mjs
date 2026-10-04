// Verify every GitHub repo linked in README.md is public, not empty, and contains source files.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SOURCE = /\.(js|mjs|cjs|ts|tsx|jsx|sol|py|rs|go|cs|html|vue|svelte|v|sv|c|cpp|swift)$/i;
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const repos = [...new Set([...readme.matchAll(/\]\(https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\)/g)].map((m) => m[1]))];

const gh = (args) => JSON.parse(execFileSync("gh", ["api", ...args], { encoding: "utf8", maxBuffer: 1 << 26 }));
let failed = 0;
for (const repo of repos) {
  try {
    const meta = gh([`repos/${repo}`]);
    const tree = gh([`repos/${meta.full_name}/git/trees/HEAD?recursive=1`]).tree;
    const sources = tree.filter((f) => f.type === "blob" && SOURCE.test(f.path)).length;
    const problems = [meta.private && "private", meta.archived && "archived", sources === 0 && "no source files"].filter(Boolean);
    if (meta.full_name.toLowerCase() !== repo.toLowerCase()) problems.push(`renamed to ${meta.full_name}`);
    if (problems.length) { failed++; console.log(`FAIL ${repo}: ${problems.join(", ")}`); }
    else console.log(`ok   ${repo} (${sources} source files)`);
  } catch (err) {
    failed++;
    console.log(`FAIL ${repo}: ${err.message.split("\n")[0]}`);
  }
}
console.log(`\n${repos.length - failed}/${repos.length} repositories passed`);
process.exit(failed ? 1 : 0);
