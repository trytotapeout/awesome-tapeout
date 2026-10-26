import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const original = "# Projects\n\n- [Missing](https://github.com/example/missing) - Description.\n- [Good](https://github.com/example/good) - Keep this.\n\nFooter.\n";
const meta = { full_name: "example/missing", private: false, archived: false };
const tree = { tree: [{ type: "blob", path: "src/main.ts" }] };

function run(responses, { prune = true, readme = original } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "tapeout-check-"));
  try {
    mkdirSync(join(dir, "scripts"));
    mkdirSync(join(dir, "bin"));
    copyFileSync(new URL("./check.mjs", import.meta.url), join(dir, "scripts/check.mjs"));
    writeFileSync(join(dir, "README.md"), readme);
    writeFileSync(join(dir, "responses.json"), JSON.stringify(responses));
    writeFileSync(join(dir, "bin/gh"), `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const root = path.dirname(path.dirname(__filename));
const file = path.join(root, "responses.json");
const responses = JSON.parse(fs.readFileSync(file, "utf8"));
const endpoint = process.argv[3];
const queue = responses[endpoint];
const response = queue?.shift() ?? (endpoint.endsWith("/git/trees/HEAD?recursive=1") ? ${JSON.stringify(tree)} : { full_name: endpoint.slice(6), private: false, archived: false });
fs.writeFileSync(file, JSON.stringify(responses));
if (typeof response === "number") {
  console.error("gh: API error (HTTP " + response + ")");
  process.exit(1);
}
console.log(JSON.stringify(response));
`, { mode: 0o755 });
    const result = spawnSync(process.execPath, [join(dir, "scripts/check.mjs"), ...(prune ? ["--prune"] : [])], {
      encoding: "utf8",
      env: { ...process.env, PATH: `${join(dir, "bin")}:${process.env.PATH}` },
    });
    return { ...result, readme: readFileSync(join(dir, "README.md"), "utf8") };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("confirmed metadata 404 removes only the missing bullet and passes", () => {
  const result = run({ "repos/example/missing": [404, 404] });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(result.readme, original.replace(/^- \[Missing\].*\n/m, ""));
  assert.match(result.stdout, /1\/1 repositories passed; 1 unavailable repositories removed/);
});

test("ordinary checks report 404 without changing README", () => {
  const result = run({ "repos/example/missing": [404, 404] }, { prune: false });
  assert.equal(result.status, 1);
  assert.equal(result.readme, original);
});

test("a successful confirmation keeps the repository", () => {
  const result = run({ "repos/example/missing": [404, meta] });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(result.readme, original);
});

for (const errors of [[403], [429], [500], [404, 403], [404, 500]]) {
  test(`metadata errors ${errors.join(", ")} fail without deleting`, () => {
    const result = run({ "repos/example/missing": errors });
    assert.equal(result.status, 1);
    assert.equal(result.readme, original);
    assert.match(result.stdout, new RegExp(`HTTP ${errors.at(-1)}`));
  });
}

test("tree 404 never removes an existing repository", () => {
  const result = run({ "repos/example/missing/git/trees/HEAD?recursive=1": [404] });
  assert.equal(result.status, 1);
  assert.equal(result.readme, original);
});

test("confirmed 404 in prose requires manual cleanup", () => {
  const readme = original.replace("- [Missing]", "See [Missing]");
  const result = run({ "repos/example/missing": [404, 404] }, { readme });
  assert.equal(result.status, 1);
  assert.equal(result.readme, readme);
});

test("valid removals persist even when another repository fails", () => {
  const result = run({ "repos/example/missing": [404, 404], "repos/example/good": [500] });
  assert.equal(result.status, 1);
  assert.equal(result.readme, original.replace(/^- \[Missing\].*\n/m, ""));
  assert.match(result.stdout, /FAIL example\/good/);
});
