# Contributing

Submit a pull request that adds one project per line in the matching section:

```
- [Name](https://github.com/owner/repo) - Short description ending with a period.
```

Requirements for every entry:

- The project is built on or directly for the TapeOut protocol (tapeout.net, $BEM, TapeKit, DeWEB, TapeOut processors on BNB Chain, X Layer or Base).
- The GitHub repository is public and contains real source code. Repositories that only hold a README, a submission form, an installer script or prebuilt binaries are not accepted.
- Silicon tapeout projects (Tiny Tapeout, sky130, ASIC flows) belong elsewhere.
- Mark Genesis Transistor Hackathon entries with 🏁.
- Run `node scripts/check.mjs` before opening the PR. It needs an authenticated `gh` CLI.

A GitHub Actions job runs the check every day. Scheduled and manual runs on the default branch use `node scripts/check.mjs --prune`: when a repository's metadata returns HTTP 404 twice, its project bullet is removed from `README.md` and the change is committed automatically. Deleted and private repositories both appear as 404 to the workflow token. Successfully removed entries do not fail the job. Network errors, rate limits, missing source files and other validation failures keep the entry and open or update a `repo-check` issue. Push and pull request checks never modify the list.

## Daily discovery

`scripts/discover.mjs` runs every day in GitHub Actions. It searches GitHub, the [TapeOut Encyclopedia](https://github.com/BruceLanLan/tapeout-encyclopedia-public) directory and [tapeout.link](https://tapeout.link/), drops anything already listed, private, forked, without source code or only about silicon tapeout, and writes the rest to a `new-candidates` issue together with links for a manual X search.

After reviewing a candidate, either add it to `README.md` or record it in `data/rejected.txt` with a short reason so it stops coming back.
