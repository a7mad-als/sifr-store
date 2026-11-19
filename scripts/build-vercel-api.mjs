// Bundles the Express API into a single Vercel function at api/index.mjs.
// Run: node scripts/build-vercel-api.mjs
import { build } from "../artifacts/api-server/node_modules/esbuild/lib/main.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

await build({
  stdin: {
    contents: `import app from "./artifacts/api-server/src/app";\nexport default app;\n`,
    resolveDir: root,
    loader: "ts",
  },
  platform: "node",
  target: "node22",
  bundle: true,
  format: "esm",
  outfile: path.join(root, "api/index.mjs"),
  nodePaths: [path.join(root, "artifacts/api-server/node_modules")],
  banner: {
    js: `import { createRequire as __cr } from "node:module"; const require = __cr(import.meta.url);`,
  },
  external: ["pino-pretty", "pg-native"],
  logLevel: "info",
});
