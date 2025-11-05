import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const tokensPath = path.join(rootDir, "tokens.json");
const cssPath = path.join(rootDir, "tokens.css");
const tsPath = path.join(rootDir, "tokens.ts");

const tokens = JSON.parse(await fs.readFile(tokensPath, "utf8"));

const cssLines = [];

const flattenTokens = (node, segments = []) => {
  if (node && typeof node === "object" && "value" in node) {
    const name = [...segments].join("-");
    cssLines.push(`  --${name}: ${node.value};`);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    flattenTokens(value, [...segments, key]);
  }
};

flattenTokens(tokens, []);

const cssOutput = `:root {\n${cssLines.join("\n")}\n}\n`;
await fs.writeFile(cssPath, cssOutput, "utf8");

const extractValues = (node) => {
  if (node && typeof node === "object" && "value" in node) {
    return node.value;
  }
  if (node && typeof node === "object") {
    const result = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = extractValues(value);
    }
    return result;
  }
  return node;
};

const valueTree = extractValues(tokens);
const tsObjectLiteral = JSON.stringify(valueTree, null, 2);
const tsOutput = `export const tokens = ${tsObjectLiteral} as const;\n\nexport type Tokens = typeof tokens;\n`;

await fs.writeFile(tsPath, tsOutput, "utf8");

console.log("✓ tokens.css and tokens.ts regenerated from tokens.json");
