import pathlib, re
root = pathlib.Path(".")
cs_path = root / "memory/CURRENT_STATE.md"
cs = cs_path.read_text(encoding="utf-8")
cs2 = cs
old_h = None
for line in cs.splitlines():
    if line.startswith("> Updated"):
        old_h = line
        break
if old_h:
    cs2 = cs2.replace(old_h, "> Updated **2026-08-30 evening** - registerWasm **2126** landed; miner still unlisted on dispatcher.", 1)
rows = cs2.splitlines()
out = []
for line in rows:
    if line.startswith("| GRADELOCK WASM |"):
        out.append("| GRADELOCK WASM | Hosted + Pinata CID QmWVPg; keccak 0x8d295d46; registerWasm id 2126 on console Diamond 0x5a2324 (tx 0x43d0c770); docs Diamond 0x122396 has no registerWasm facet |")
    elif line.startswith("| Integrations listing |"):
        out.append("| Integrations listing | Poll 2026-08-30T20:06Z dispatcher /miner-dispatcher/integrations 200, count 93 - NOT listed (no caliber-truthport / 20260830 / QmVTkd) |")
    else:
        out.append(line)
text = "\n".join(out)
if "## Blocker" in text:
    parts = text.split("## Blocker", 1)
    rest = parts[1].lstrip("\n")
    # replace first paragraph after Blocker
    lines2 = rest.splitlines()
    # skip blank
    i = 0
    while i < len(lines2) and lines2[i].strip() == "":
        i += 1
    if i < len(lines2):
        lines2[i] = "Off-chain activation into dispatcher /integrations still absent after Reg 55 Pinata. Discord if still missing. Script track on-chain registerWasm is done (id 2126)."
    text = parts[0] + "## Blocker\n\n" + "\n".join(lines2)
cs_path.write_text(text if text.endswith("\n") else text + "\n", encoding="utf-8")
print("CURRENT_STATE ok")
fc_path = root / "memory/FACT_CHECK.md"
fc = fc_path.read_text(encoding="utf-8")
fc = fc.replace("| registerWasm on-chain | **NOT DONE** | needs Henry wallet console |", "| registerWasm on-chain | **VERIFIED (2026-08-30)** | id **2126**; tx 0x43d0c770beab5c453aaac2f86dc426d4d0f90f092ee3315f5778c8cd0bf6a572; Diamond 0x5a2324 (console); keccak 0x8d295d46 Pinata URL |")
fc = fc.replace("| CALIBER in dispatcher /integrations | **UNVERIFIED (poll timeout)** | dispatcher 13.237.89.59 timed out 20s from agent host |", "| CALIBER in dispatcher /integrations | **FALSE (poll 20:06Z)** | 200 OK count 93; no 20260830 / QmVTkd / caliber-truthport |")
block = """
### 2026-08-30 Script track (registerWasm)

| Claim | Status | Evidence |
|---|---|---|
| Truthport v2 live | **VERIFIED** | prod smoke + CURRENT_STATE |
| registerMiner 55 Pinata YAML | **VERIFIED on-chain** | tx 0xda07a128; CID QmVTkd |
| Console ABI registerWasm(bytes32,string,string) | **VERIFIED** | integrate wasm page chunk 1319 |
| WASM hash keccak256 file bytes | **VERIFIED** | match prior console hash 0x8d295d46 |
| Docs Diamond 0x122396 has registerWasm | **FALSE** | simulate: Function does not exist |
| Console Diamond 0x5a2324 has registerWasm | **VERIFIED** | simulate OK + successful tx |
| registerWasm id 2126 | **VERIFIED on-chain** | WasmRegistered; tx 0x43d0c770 block 46175866 |
| Miner listed in /integrations | **FALSE** | poll dump integrations-poll-wasm-reg.json |
"""
if "Script track (registerWasm)" not in fc:
    fc = fc.rstrip() + "\n" + block + "\n"
fc_path.write_text(fc, encoding="utf-8")
print("FACT_CHECK ok")
entry = """
## 2026-08-30 ~20:00 - Script track registerWasm + integrations poll

### Done
- Console ABI: registerWasm(bytes32 wasmHash, string wasmUrl, string intent) + WasmRegistered (chunk 1319).
- Keccak256 gradelock.wasm = 0x8d295d467f4002271feb29bc089471453972419b0d02b15da3c3c737b36bb416 (local=Pinata=Vercel). /api/hash-remote was 502.
- Docs Diamond 0x122396 rejects registerWasm (Function does not exist). Console Diamond 0x5a2324 accepts.
- registerWasm Pinata URL + AI_TEXT_DETECTION -> registrationId 2126, tx 0x43d0c770beab5c453aaac2f86dc426d4d0f90f092ee3315f5778c8cd0bf6a572, block 46175866.
- Dispatcher poll: integrations 200 count 93 - miner NOT listed (no caliber-truthport / 20260830 / QmVTkd).
- Updated protocol-status, CURRENT_STATE, FACT_CHECK.

### Miner listed
No.

### Next
Discord activation for Reg 55; Stage 1/2 WASM eval; X after lock.
"""
sl_path = root / "memory/SESSION_LOG.md"
sl = sl_path.read_text(encoding="utf-8")
if "Script track registerWasm + integrations poll" not in sl:
    sl_path.write_text(sl.rstrip() + "\n" + entry + "\n", encoding="utf-8")
    print("SESSION_LOG ok")
else:
    print("SESSION_LOG already")
