import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const designSystemDir = join(rootDir, "design-system");
const tokensPath = join(designSystemDir, "tokens.json");
const scssVariablesPath = join(rootDir, "src", "scss", "abstracts", "_variables.scss");

const mode = process.argv[2];

if (!["build", "check"].includes(mode)) {
  console.error("Usage: node scripts/design-system-tokens.js <build|check>");
  process.exit(1);
}

const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));

validateJsonDocuments();

const scss = renderScssVariables(tokens);

if (mode === "build") {
  writeFileSync(scssVariablesPath, scss);
  process.exit(0);
}

const currentScss = readFileSync(scssVariablesPath, "utf8");

if (currentScss !== scss) {
  console.error(
    "Design tokens are out of sync. Run `npm run build:tokens` and commit the generated SCSS.",
  );
  process.exit(1);
}

function validateJsonDocuments() {
  for (const fileName of readdirSync(designSystemDir)) {
    if (fileName === "tokens.json" || fileName.endsWith(".dsds.json")) {
      JSON.parse(readFileSync(join(designSystemDir, fileName), "utf8"));
    }
  }
}

function renderScssVariables(tokenTree) {
  const lines = [
    "/* Generated from design-system/tokens.json. Do not edit token values here. */",
    ":root {",
  ];

  lines.push(`  --font-family: ${formatFontFamily(tokenTree.font.family.$value)};`, "");

  appendGroup(lines, "color", tokenTree.color);
  lines.push("");
  appendGroup(lines, "size", tokenTree.size, { omitGroupPrefix: true });
  appendGroup(lines, "space", tokenTree.space);
  lines.push("");
  appendGroup(lines, "radius", tokenTree.radius, { suffixGroupName: true });
  lines.push("");
  appendGroup(lines, "motion", tokenTree.motion, { omitGroupPrefix: true });

  lines.push("}", "");

  return lines.join("\n");
}

function appendGroup(lines, groupName, groupTokens, options = {}) {
  for (const [tokenName, token] of Object.entries(groupTokens)) {
    const cssName = getCssVariableName(groupName, tokenName, options);
    lines.push(`  --${cssName}: ${token.$value};`);
  }
}

function getCssVariableName(groupName, tokenName, options) {
  if (tokenName.startsWith("page-")) {
    return tokenName;
  }

  if (options.omitGroupPrefix) {
    return tokenName;
  }

  if (options.suffixGroupName) {
    return `${tokenName}-${groupName}`;
  }

  return `${groupName}-${tokenName}`;
}

function formatFontFamily(fontFamilies) {
  return fontFamilies.map((fontFamily) => (fontFamily.includes(" ") ? `"${fontFamily}"` : fontFamily)).join(", ");
}
