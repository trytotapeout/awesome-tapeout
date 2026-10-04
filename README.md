# Awesome TapeOut [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of open-source projects built on [TapeOut](https://tapeout.net/), the on-chain tapeout protocol where NAND / LATCH transistors are wired into circuits and taped out as verifiable on-chain hardware on BNB Chain, X Layer and Base.

TapeOut 链上流片协议的开源项目合集。收录标准：GitHub 公开仓库、含真实源代码、与 TapeOut 协议直接相关。

This list is about the **TapeOut protocol** (tapeout.net, $BEM, TapeKit, DeWEB). It is not about silicon tapeout / Tiny Tapeout / ASIC flows.

> **Legend / 图例**
>
> - 🏁 Entry of the [IGNIX × TapeOut × X Layer Genesis Transistor Hackathon](https://ignix.bot/x_campaign).
> - 🏁 表示该项目是 [Genesis Transistor 黑客松](https://ignix.bot/x_campaign)（IGNIX × TapeOut × X Layer）的参赛作品。

## Contents

- [Developer Live Sessions](#developer-live-sessions)
- [Official](#official)
- [DeWEB, Browsers & Gateways](#deweb-browsers--gateways)
- [Data, Explorers & Monitoring](#data-explorers--monitoring)
- [Trading, Launchpads & DeFi](#trading-launchpads--defi)
- [Circuit Showcases & Experiments](#circuit-showcases--experiments)
- [Games](#games)
- [Circuit-Governed Apps on X Layer](#circuit-governed-apps-on-x-layer)
- [Docs, Guides & Research](#docs-guides--research)
- [Related Projects](#related-projects)
- [Other Resources](#other-resources)
- [Contributing](#contributing)

## Developer Live Sessions

Replays of TapeOut developer live streams, newest first.

*Coming soon.*

## Official

- [TapeKit](https://github.com/TapeOutProtocol/TapeKit) - Open-source browser kernel that reads `tape://` sites straight from chain and verifies every byte against on-chain SHA-256.
- [TAPs](https://github.com/TapeOutProtocol/TAPs) - TapeOut Protocol Proposals: numbered specs for new formats, interfaces and on-chain conventions (EIP-1 style).

## DeWEB, Browsers & Gateways

- [TapeAPI](https://github.com/BruceLanLan/tapeapi) - Signed AI-call receipts, MCP tools and end-to-end encrypted channels for TapeOut containers (TAP-11).
- [deweb-mcp-playground](https://github.com/tizerluo/deweb-mcp-playground) - Off-chain playground for an unofficial DeWEB MCP + WebMCP draft.
- [TapeSign](https://github.com/staveliu/TapeSign) - On-chain contracts, content notarization and dual-signature wallet built on TapeOut containers.
- [DeSQL Wallet](https://github.com/staveliu/DeSQL_wallet) - Multi-chain wallet experiment built around TapeOut and TapeKit.
- [TapeBrowser](https://github.com/trytotapeout/TapeBrowser) - Desktop DeWEB browser for `tape://` sites.
- [TapeVault](https://github.com/trytotapeout/TapeVault) - On-chain encrypted safe box built on the TapeKit framework.

## Data, Explorers & Monitoring

- [tap](https://github.com/ddgsdde/tap) - Reproducible on-chain data mirror: leaderboards, raw netlists, NAND-only BLIF exports and market snapshots.
- [TapeOut Order Monitor](https://github.com/tomqaq1/tapeout-order-monitor) - Windows WinForms terminal for fixed-price orders, mint progress and airdrop claims on BNB Chain.
- [tapeout-harvester](https://github.com/runesleo/tapeout-harvester) - Fail-closed BEM reward harvester with optional V3 swap and local signing.
- [Likely2X](https://github.com/neyosmt-byte/likely2X) - Ecosystem radar for processors, circuits, Proof-of-Design tasks and X Layer events.
- [TRACE](https://github.com/btcc6758-svg/trace-xlayer-growth) - X Layer project discovery and builder milestone cards backed by a TapeOut NAND circuit.

## Trading, Launchpads & DeFi

- [tapeoutgo](https://github.com/0xLukin/tapeoutgo) - Budget-first, non-custodial $BEM starter that wraps NAND / LATCH into tradable tokens.
- [tapeout-wrappers](https://github.com/0xLukin/tapeout-wrappers) - GateWrapper contracts that wrap ERC-1155 transistors as ERC-20 for PancakeSwap V2.
- [Tosh-Core](https://github.com/jayoo101/Tosh-Core) - Fair-launch protocol denominated in BEM and settled through a PancakeSwap Infinity hook.
- [meme-circuit-bonds](https://github.com/Doufuru1/meme-circuit-bonds) - Bonding-curve experiment where circuit NFTs can be disassembled to reclaim 80% of their transistors.
- [Launch Lab](https://github.com/BruceLanLan/tapeout-launch-lab) - Interactive comparison of TapeHub launch mechanics against Pump.fun, Four.meme, Flap and others.

## Circuit Showcases & Experiments

- [secp256k1-auth-core](https://github.com/bsc-signverify/secp256k1-auth-core) - `ecrecover` rebuilt from raw NAND gates: 13 circuits, 40,496 transistors, byte-verified on BNB Chain.
- [Perpetua](https://github.com/h805846716/perpetua) - Conway's Game of Life as a 14,592-gate NAND circuit, one generation per call.
- [life-tapeout](https://github.com/BruceLanLan/life-tapeout) - Game of Life rebuilt for both tapeout.net (NAND / LATCH) and Tiny Tapeout (sky130).
- [BEM Clock](https://github.com/fashen002/bem-clock) - Seven-segment clock written in Verilog, synthesized with Yosys + ABC, evaluated on-chain each tick.
- [21 NAND Driver](https://github.com/JogJohgoeg/nand-driver) - A car controlled by 21 NAND gates, taped out as circuit #279.
- [c3s-reflex-circuits](https://github.com/BruceLanLan/c3s-reflex-circuits) - Fly giant-fiber escape reflex synthesized into exhaustively verified NAND / LATCH netlists (LoomEscape).
- [NANDFLY](https://github.com/wetware-labs/nandfly) - The fruit-fly escape reflex derived from a 166,700-neuron connectome, deployed as an ownerless contract.
- [tapeout-fly](https://github.com/HongH933/tapeout-fly) - Fly-brain circuit assembly with Beacon-proxy deployment tooling on BSC.
- [Drosophila](https://github.com/HongH933/Drosophila) - Full MaleCNS connectome model executed by 10,419 NAND / LATCH circuit NFTs.
- [heyue-BEM](https://github.com/jianfengliao774-sketch/heyue-BEM) - Fail-closed mainnet tool that tapes out an 8-bit Johnson counter on an existing processor.
- [MINI-4](https://github.com/tomandpeter/mini-4) - A 1-bit (now 0–255) calculator driven by read-only processor calls.

## Games

- [TapeOutTank](https://github.com/tizerluo/tapeouttank) - Tank battles where players are NAND circuit brains, with verifiable replays.
- [Neon Reliquary](https://github.com/tizerluo/neon-reliquary-xlayer) - Circuit-driven roguelite built with TapeOut on X Layer. 🏁
- [ChainOfSuspicion](https://github.com/trytotapeout/ChainOfSuspicion) - Three-Body-themed circuit bluffing game on X Layer.
- [RuleChip](https://github.com/lichao01111-dot/rulechip) - Game rules taped out as provable NAND circuits: swap the circuit, change the game. 🏁

## Circuit-Governed Apps on X Layer

Most entries here come from the [Genesis Transistor Hackathon](https://ignix.bot/x_campaign) (marked 🏁).

- [TapeID](https://github.com/JogJohgoeg/tapeid) - Turn any TapeOut circuit into a coin launched on IGNIX. 🏁
- [OpenGate](https://github.com/KAMEVETRICS/opengate) - Staking vault whose reward tiers are computed by a 40-gate circuit. 🏁
- [Stego](https://github.com/kvzuobai/stego) - Vault whose deposit, withdrawal and rebalance rules are TapeOut policy circuits. 🏁
- [Policy Processor LAW](https://github.com/hackid02/policy-processor-law) - Circuit-governed vaults with immutable withdrawal "Law Cards". 🏁
- [TapeSafe](https://github.com/kin684660-commits/TapeSafe) - Team approval policies compiled into NAND circuits, verified on X Layer mainnet.
- [DrawAgent](https://github.com/memeshee/drawagent) - Trustless raffles and votes executed by real NAND circuits. 🏁
- [LeoLabs Agent Firewall](https://github.com/runesleo/leolabs-agent-firewall) - Deterministic pre-sign firewall for AI treasuries with TapeOut ADD8 provenance. 🏁
- [SkillPass](https://github.com/IGNIX-IMOO/skillpass) - Agent commerce IP: use a skill, prove it, own it. 🏁
- [Signal Processor](https://github.com/w522mp8vf8-create/signal-processor) - Revenue-sharing processor for an AI trading-signal agent with a buyback-and-burn circuit. 🏁
- [XBOT Intelligence Processor](https://github.com/Jaffyjee/xbot-intelligence-processor) - Consensus logic for intelligence signals expressed as a TapeOut circuit. 🏁
- [Nandout](https://github.com/davieslennox0/nandout) - Rules taped out as immutable circuits that consumer contracts obey. 🏁
- [Fabrica](https://github.com/seekdaseek/fabrica) - Design-to-earn market for smaller equivalent circuits. 🏁
- [Circuit Commons](https://github.com/yanwenzhe519-ctrl/tapeout-circuit-commons) - Circuit licensing, usage receipts and revenue vaults. 🏁
- [Circuit City](https://github.com/259906573-ship-it/circuit-city) - A "constitution" circuit governing verifiable energy trades. 🏁
- [CircuitDesk](https://github.com/diveyreadytodive-star/circuitdesk-ignix-tapeout) - Guided workbench for small Boolean circuits and their truth tables. 🏁
- [PatchNAND](https://github.com/SERAPH125/patchnand) - Bounty payouts decided by a 60-NAND circuit after human-reviewed fixes. 🏁
- [TapeFlow](https://github.com/bingfasamsung-boop/tapeflow-xlayer) - Payment suite with escrow, red packets and conditional locks on a TapeOut processor. 🏁
- [LotGate](https://github.com/haivcon/LoteGate) - Batch-auction allocation computed by a TapeOut CPU, exported as JSON receipts.
- [Yuan Station](https://github.com/bitcoingoodssss/yizhan-relay-asic) - Request interlock for AI vehicles running on an X Layer processor.

## Docs, Guides & Research

- [TapeOut Beginner Guide](https://github.com/chickdady-svg/tapeout-beginner-guide) - 《TapeOut 新手完全指南》, proofread chapter-by-chapter Markdown plus a 138-page PDF.
- [TapeOut Encyclopedia](https://github.com/BruceLanLan/tapeout-encyclopedia-public) - Community encyclopedia, knowledge graph and verified public GitHub directory.
- [TapeOut Whitepaper](https://github.com/azk3cd/tapeout-whitepaper) - Unofficial 16-chapter reverse-engineered analysis of architecture, PoD mining and $BEM economics.

## Related Projects

Projects outside the TapeOut protocol that share the "programs compiled to on-chain logic gates" idea.

- [nandry-core](https://github.com/NandryAI/nandry-core) - Deterministic NAND / LATCH compiler and `no_std` VM in Rust, positioned as a "tapeout layer" on Solana.

## Other Resources

- [tapeout.net](https://tapeout.net/) - Official protocol app.
- [tapeout.link](https://tapeout.link/) - Ecosystem navigation hub (sites without public source are listed there).
- [@blonskr](https://x.com/blonskr) - Protocol announcements from the TapeOut founder.

## Contributing

Contributions welcome. Read the [contribution guidelines](CONTRIBUTING.md) first.

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the contributors have waived all copyright and related rights to this work.
