#!/usr/bin/env python3
"""Refresh orbit-mcp.mcpb from the repo without repacking the dependency tree.

The Smithery listing does not read npm: it serves this hand-packaged bundle, and the 2026-10-02
E2E rerun showed what a stale bundle costs — it still carried the 0.4.0 schema (required:
["id"] with no `symbol`) while the skill that routes to the server had moved on, so every
documented `{ symbol }` call was rejected by the harness. Bundles drift because repacking the
whole tree needs an external tool; this script keeps the installed dependency tree exactly as it
is and refreshes everything the repo owns.

Usage: python3 scripts/refresh-bundle.py   (from the repo root)
"""
import json
import os
import shutil
import sys
import zipfile

BUNDLE = "orbit-mcp.mcpb"
KEEP_PREFIXES = ("node_modules/",)


def entries_to_refresh(names):
    refreshed, dropped = [], []
    for name in names:
        if name.startswith(KEEP_PREFIXES):
            continue
        if name.endswith("/"):
            continue
        if os.path.exists(name):
            refreshed.append(name)
        else:
            dropped.append(name)
    return refreshed, dropped


def main():
    if not os.path.exists(BUNDLE):
        sys.exit("no bundle to refresh: " + BUNDLE)
    manifest = json.load(open("manifest.json"))
    version = json.load(open("package.json"))["version"]
    if manifest["version"] != version:
        sys.exit("manifest version %s does not match package.json %s" % (manifest["version"], version))
    source = zipfile.ZipFile(BUNDLE)
    names = source.namelist()
    refreshed, dropped = entries_to_refresh(names)
    tmp = BUNDLE + ".tmp"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as target:
        written = set()
        for name in names:
            if name in dropped:
                continue
            info = source.getinfo(name)
            if name in refreshed:
                target.writestr(info, open(name, "rb").read())
            else:
                target.writestr(info, source.read(name))
            written.add(name)
    source.close()
    shutil.move(tmp, BUNDLE)
    print("bundle refreshed: %s" % BUNDLE)
    print("  version        : %s (manifest + package.json agree)" % version)
    print("  refreshed      : %d entries from the repo" % len(refreshed))
    print("  dropped        : %s" % (", ".join(dropped) if dropped else "none"))
    print("  dependency tree: kept as packaged")


if __name__ == "__main__":
    main()
