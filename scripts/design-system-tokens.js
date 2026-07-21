import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const designSystemDir = join(rootDir, "design-system");
const tokensPath = join(designSystemDir, "tokens.json");
const scssVariablesPath = join(rootDir, "src", "scss", "abstracts", "_variables.scss");
const scssDir = join(rootDir, "src", "scss");

const mode = process.argv[2];

if (!["build", "check"].includes(mode)) {
  console.error("Usage: node scripts/design-system-tokens.js <build|check>");
  process.exit(1);
}

const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));

validateJsonDocuments();
validateTokenTree(tokens);

const scss = renderScssVariables(tokens);
const declaredVariables = new Set(getDeclaredCssVariables(tokens));

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

validateDsdsContracts(tokens);
validateScssTokenUsage(declaredVariables);

function validateJsonDocuments() {
  for (const fileName of readdirSync(designSystemDir)) {
    if (fileName === "tokens.json" || fileName.endsWith(".dsds.json")) {
      JSON.parse(readFileSync(join(designSystemDir, fileName), "utf8"));
    }
  }
}

function validateTokenTree(tokenTree) {
  const requiredGroups = ["font", "color", "size", "space", "radius", "motion"];

  for (const groupName of requiredGroups) {
    if (!isPlainObject(tokenTree[groupName])) {
      fail(`Missing design token group: ${groupName}`);
    }
  }

  for (const [path, token] of getLeafTokens(tokenTree)) {
    if (!isPlainObject(token)) {
      fail(`Invalid token at ${path}: expected an object.`);
    }

    if (!("$type" in token) || !("$value" in token) || !("$description" in token)) {
      fail(`Invalid token at ${path}: $type, $value, and $description are required.`);
    }
  }
}

function validateDsdsContracts(tokenTree) {
  for (const fileName of readdirSync(designSystemDir)) {
    if (!fileName.endsWith(".dsds.json")) {
      continue;
    }

    const documentPath = join(designSystemDir, fileName);
    const contract = JSON.parse(readFileSync(documentPath, "utf8"));
    const sources = findValues(contract, "source");

    for (const source of sources) {
      if (!source.startsWith("./tokens.json#/")) {
        continue;
      }

      const tokenPath = source.replace("./tokens.json#/", "").split("/");
      const resolved = tokenPath.reduce((value, segment) => value?.[segment], tokenTree);

      if (resolved === undefined) {
        fail(`${fileName} references a missing token source: ${source}`);
      }
    }

    for (const link of findValues(contract, "url")) {
      if (!link.startsWith("../")) {
        continue;
      }

      const targetPath = join(designSystemDir, link);

      if (!existsSync(targetPath)) {
        fail(`${fileName} references a missing file: ${link}`);
      }
    }
  }
}

function validateScssTokenUsage(declaredVariables) {
  const sourceFiles = getFiles(scssDir).filter((filePath) => filePath.endsWith(".scss"));
  const hardcodedColorPattern = /(?<![\w-])(?:#[0-9a-fA-F]{3,8}|rgba?\()/g;

  for (const filePath of sourceFiles) {
    const source = readFileSync(filePath, "utf8");
    const relativePath = relative(rootDir, filePath);

    for (const variable of source.matchAll(/var\((--[a-z0-9-]+)/g)) {
      if (!declaredVariables.has(variable[1])) {
        fail(`${relativePath} uses undeclared design token ${variable[1]}.`);
      }
    }

    if (filePath === scssVariablesPath) {
      continue;
    }

    const hardcodedColor = source.match(hardcodedColorPattern)?.[0];

    if (hardcodedColor) {
      fail(
        `${relativePath} contains hard-coded color ${hardcodedColor}; add or reuse a semantic token.`,
      );
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

function getDeclaredCssVariables(tokenTree) {
  const names = ["--font-family"];

  names.push(...getGroupCssVariableNames("color", tokenTree.color).map(toCustomPropertyName));
  names.push(
    ...getGroupCssVariableNames("size", tokenTree.size, { omitGroupPrefix: true }).map(
      toCustomPropertyName,
    ),
  );
  names.push(...getGroupCssVariableNames("space", tokenTree.space).map(toCustomPropertyName));
  names.push(
    ...getGroupCssVariableNames("radius", tokenTree.radius, { suffixGroupName: true }).map(
      toCustomPropertyName,
    ),
  );
  names.push(
    ...getGroupCssVariableNames("motion", tokenTree.motion, { omitGroupPrefix: true }).map(
      toCustomPropertyName,
    ),
  );

  return names;
}

function appendGroup(lines, groupName, groupTokens, options = {}) {
  for (const cssName of getGroupCssVariableNames(groupName, groupTokens, options)) {
    const tokenName = getTokenNameFromCssName(groupName, cssName, options);
    lines.push(`  --${cssName}: ${groupTokens[tokenName].$value};`);
  }
}

function getGroupCssVariableNames(groupName, groupTokens, options = {}) {
  const names = [];

  for (const [tokenName, token] of Object.entries(groupTokens)) {
    if (!isPlainObject(token) || !("$value" in token)) {
      continue;
    }

    names.push(getCssVariableName(groupName, tokenName, options));
  }

  return names;
}

function getTokenNameFromCssName(groupName, cssName, options) {
  if (cssName.startsWith("page-")) {
    return cssName;
  }

  if (options.omitGroupPrefix) {
    return cssName;
  }

  if (options.suffixGroupName) {
    return cssName.replace(new RegExp(`-${groupName}$`), "");
  }

  return cssName.replace(new RegExp(`^${groupName}-`), "");
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
  return fontFamilies
    .map((fontFamily) => (fontFamily.includes(" ") ? `"${fontFamily}"` : fontFamily))
    .join(", ");
}

function toCustomPropertyName(cssName) {
  return `--${cssName}`;
}

function getLeafTokens(value, path = []) {
  if (isPlainObject(value) && "$value" in value) {
    return [[path.join("."), value]];
  }

  if (!isPlainObject(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, child]) => getLeafTokens(child, [...path, key]));
}

function findValues(value, key) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => findValues(item, key));
  }

  if (!isPlainObject(value)) {
    return [];
  }

  return [
    ...(Object.hasOwn(value, key) ? [value[key]] : []),
    ...Object.values(value).flatMap((child) => findValues(child, key)),
  ].filter((item) => typeof item === "string");
}

function getFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name);

    return entry.isDirectory() ? getFiles(filePath) : [filePath];
  });
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
