#!/usr/bin/env bun
// Installs a tagged Lucid CV release (lucidcv.cls, fonts/, LICENSE).
// Usage: bun scripts/update-template.ts VERSION|latest
import { mkdtempSync, rmSync, readdirSync, cpSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const version = process.argv[2];
if (!version) {
  console.error("Usage: bun scripts/update-template.ts VERSION|latest");
  process.exit(1);
}
const root = join(import.meta.dir, "..");

let tag: string;
if (version === "latest") {
  const res = await fetch("https://github.com/xGoldy/lucidcv/releases/latest", {
    redirect: "manual",
  });
  const location = res.headers.get("location") ?? "";
  tag = location.split("/").pop() ?? "";
} else {
  tag = version.startsWith("v") ? version : `v${version}`;
}
if (!/^v[^\s/]+$/.test(tag)) {
  console.error(`Could not determine a valid release tag for '${version}'`);
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), "lucidcv-"));
try {
  const tarball = join(tmp, "lucidcv.tar.gz");
  const res = await fetch(`https://github.com/xGoldy/lucidcv/archive/refs/tags/${tag}.tar.gz`);
  if (!res.ok) {
    console.error(`Download failed for ${tag}: HTTP ${res.status}`);
    process.exit(1);
  }
  await Bun.write(tarball, res);

  const tar = Bun.spawnSync(["tar", "-xzf", tarball, "-C", tmp]);
  if (!tar.success) {
    console.error(tar.stderr.toString());
    process.exit(1);
  }
  const src = readdirSync(tmp)
    .map((d) => join(tmp, d))
    .find((p) => statSync(p).isDirectory() && p.includes("lucidcv-"));
  if (
    !src ||
    !existsSync(join(src, "lucidcv.cls")) ||
    !existsSync(join(src, "LICENSE")) ||
    !existsSync(join(src, "fonts"))
  ) {
    console.error(`Release ${tag} does not contain the expected Lucid CV files`);
    process.exit(1);
  }

  cpSync(join(src, "lucidcv.cls"), join(root, "lucidcv.cls"));
  cpSync(join(src, "LICENSE"), join(root, "LICENSE.lucidcv"));
  rmSync(join(root, "fonts"), { recursive: true, force: true });
  cpSync(join(src, "fonts"), join(root, "fonts"), { recursive: true });

  console.log(`Updated Lucid CV to ${tag}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
