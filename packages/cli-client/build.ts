import { build } from "bun";
import { writeFileSync, chmodSync, mkdirSync, copyFileSync } from "fs";

const result = await build({
  entrypoints: ["./index.ts"],
  minify: true,
  target: "node",
  banner: "#!/usr/bin/env node",
});

if (!result.success) {
  for (const msg of result.logs) console.error(msg);
  process.exit(1);
}

mkdirSync("./bin", { recursive: true });

for (const output of result.outputs) {
  const text = await output.text();
  writeFileSync("./bin/murl", text);
  chmodSync("./bin/murl", 0o755);
}

// npm only auto-includes a LICENSE located at the package root
copyFileSync("../../LICENSE", "./LICENSE");

console.log("Built ./bin/murl");
