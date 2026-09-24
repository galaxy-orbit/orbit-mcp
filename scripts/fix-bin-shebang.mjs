// bun build may drop a preceding --banner shebang from bin outputs when the
// bundle already carries its own header (for example "// @bun"). npm runs bin
// files through the shell, so a missing shebang makes the file unexecutable.
// Ensure both bin entry points always start with the Node shebang.
import { readFile, writeFile } from "node:fs/promises";
const SHEBANG = "#!/usr/bin/env node\n";
for (const file of ["dist/cli.js", "dist/index.js"]) {
  const source = await readFile(file, "utf8");
  if (source.startsWith(SHEBANG)) continue;
  const stripped = source.replace(/^#!.*\n/, "");
  await writeFile(file, SHEBANG + stripped, { mode: 0o755 });
  console.error(`fix-bin-shebang: restored shebang in ${file}`);
}
