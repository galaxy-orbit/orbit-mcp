#!/usr/bin/env python3
"""Refresh orbit-mcp.mcpb from the repo, optionally pruning the dependency tree.

The Smithery listing does not read npm: it serves this hand-packaged bundle, and the 2026-10-02
E2E rerun showed what a stale bundle costs — it still carried the 0.4.0 schema (required:
["id"] with no `symbol`) while the skill that routes to the server had moved on, so every
documented `{ symbol }` call was rejected by the harness.

Two modes:

  refresh (default)  every repo-owned entry is taken from the checkout; the packaged dependency
                     tree is kept byte-identical.
  --slim             additionally drops node_modules/**. bun inlines the runtime dependencies into
                     dist/cli.js, so the tree is dead weight: the extract was 45 MB and the upload
                     to Smithery timed out twice at that size. Before the slim bundle replaces the
                     previous one, dist/cli.js is executed in a temporary extraction and must answer
                     initialize + tools/list; a bundle that cannot serve is never written.

Usage: python3 scripts/refresh-bundle.py [--slim]
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile

BUNDLE = "orbit-mcp.mcpb"
KEEP_PREFIXES = ("node_modules/",)


def entries_to_refresh(names):
    refreshed, dropped = [], []
    for name in names:
        if name.startswith(KEEP_PREFIXES) or name.endswith("/"):
            continue
        (refreshed if os.path.exists(name) else dropped).append(name)
    return refreshed, dropped


def verify(entries):
    """Run the candidate cli.js in a throwaway extraction; it must answer a handshake."""
    with tempfile.TemporaryDirectory() as tmp:
        for name, payload in entries.items():
            target = os.path.join(tmp, name)
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, "wb") as handle:
                handle.write(payload)
        script = (
            "const {spawn}=require('child_process');"
            "const c=spawn('node',['" + os.path.join(tmp, "dist/cli.js").replace("'", "") + "'],{stdio:['pipe','pipe','pipe']});"
            "let o='';c.stdout.on('data',d=>o+=d);"
            "c.stdin.write(JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'verify',version:'1'}}})+'\\n');"
            "setTimeout(()=>c.stdin.write(JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})+'\\n'),600);"
            "setTimeout(()=>{c.kill('SIGKILL');"
            "const m=o.split('\\n').filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);"
            "const init=m.find(x=>x.id===1);const tools=m.find(x=>x.id===2);"
            "console.log(JSON.stringify({version:init?.result?.serverInfo?.version,tools:(tools?.result?.tools??[]).length}))},5000);"
        )
        result = subprocess.run(["node", "-e", script], capture_output=True, text=True, timeout=60)
        print("  verification:", (result.stdout or result.stderr).strip()[:120])
        payload = json.loads(result.stdout or "{}")
        if not payload.get("version") or not payload.get("tools"):
            raise SystemExit("slim bundle failed verification; the previous bundle is untouched")
        return payload


def main():
    if not os.path.exists(BUNDLE):
        sys.exit("no bundle to refresh: " + BUNDLE)
    slim = "--slim" in sys.argv
    manifest = json.load(open("manifest.json"))
    version = json.load(open("package.json"))["version"]
    if manifest["version"] != version:
        sys.exit("manifest version %s does not match package.json %s" % (manifest["version"], version))
    source = zipfile.ZipFile(BUNDLE)
    names = source.namelist()
    infos = {name: source.getinfo(name) for name in names}
    refreshed, dropped = entries_to_refresh(names)
    candidate = {}
    for name in names:
        if name in dropped:
            continue
        if name.startswith(KEEP_PREFIXES) and slim:
            continue
        candidate[name] = open(name, "rb").read() if name in refreshed else source.read(name)
    source.close()
    if slim:
        candidate = {name: payload for name, payload in candidate.items() if not name.startswith(KEEP_PREFIXES)}
        print("slim verification before writing:")
        verify(candidate)
    tmp = BUNDLE + ".tmp"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as target:
        for name in names:
            if name not in candidate:
                continue
            target.writestr(infos.get(name, name), candidate[name])
    shutil.move(tmp, BUNDLE)
    size = os.path.getsize(BUNDLE)
    print("bundle refreshed: %s (%.1f MB%s)" % (BUNDLE, size / 1e6, ", slim" if slim else ""))
    print("  version        : %s (manifest + package.json agree)" % version)
    print("  refreshed      : %d entries from the repo" % len(refreshed))
    print("  dropped        : %s" % (", ".join(dropped) if dropped else "none"))
    print("  dependency tree: %s" % ("pruned" if slim else "kept as packaged"))


if __name__ == "__main__":
    main()
