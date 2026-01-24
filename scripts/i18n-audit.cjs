const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const LOCALES_DIR = path.join(ROOT, "src", "assets", "locales");
const LOCALES = ["en", "hr", "de"];

const regexT = /\bt\(\s*["']([^"']+)["']/g;
const regexTrans = /i18nKey=\{?["']([^"']+)["']\}?/g;
const regexKeyProp = /\b\w+Key\s*[:=]\s*["']([^"']+)["']/g;

const readJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"));

const flatten = (obj, prefix = "") => {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      return acc.concat(flatten(value, next));
    }, []);
  }
  return [prefix];
};

const walkFiles = (dir, entries = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, entries);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      entries.push(full);
    }
  }
  return entries;
};

const extractKeys = () => {
  const keys = new Set();
  for (const file of walkFiles(SRC_DIR)) {
    const content = fs.readFileSync(file, "utf8");
    for (const match of content.matchAll(regexT)) {
      keys.add(match[1]);
    }
    for (const match of content.matchAll(regexTrans)) {
      keys.add(match[1]);
    }
    for (const match of content.matchAll(regexKeyProp)) {
      if (match[1].includes(".")) {
        keys.add(match[1]);
      }
    }
  }
  return keys;
};

const extractInterpolations = (value) => {
  if (typeof value !== "string") return [];
  const matches = [...value.matchAll(/\{\{\s*([^}\s]+)\s*\}\}/g)];
  return matches.map((match) => match[1]).sort();
};

const printList = (title, items) => {
  if (!items.length) return;
  console.log(`\n${title}`);
  for (const item of items) console.log(`  - ${item}`);
};

const locales = LOCALES.reduce((acc, locale) => {
  acc[locale] = readJson(path.join(LOCALES_DIR, locale, "common.json"));
  return acc;
}, {});

const flattened = LOCALES.reduce((acc, locale) => {
  acc[locale] = new Set(flatten(locales[locale]));
  return acc;
}, {});

const usedKeys = extractKeys();

let hasError = false;

for (const locale of LOCALES) {
  const missing = [...usedKeys].filter((key) => !flattened[locale].has(key));
  if (missing.length) {
    hasError = true;
    printList(`[${locale}] Missing keys`, missing);
  }
}

const unused = [...flattened.en].filter((key) => !usedKeys.has(key));
if (unused.length) {
  hasError = true;
  printList("[en] Unused keys", unused);
}

for (const locale of LOCALES) {
  const extra = [...flattened[locale]].filter((key) => !flattened.en.has(key));
  if (extra.length) {
    hasError = true;
    printList(`[${locale}] Extra keys`, extra);
  }
}

for (const key of flattened.en) {
  const base = extractInterpolations(
    key.split(".").reduce((acc, part) => acc?.[part], locales.en),
  );
  for (const locale of LOCALES) {
    const value = key
      .split(".")
      .reduce((acc, part) => acc?.[part], locales[locale]);
    const current = extractInterpolations(value);
    if (base.join("|") !== current.join("|")) {
      hasError = true;
      console.log(
        `\n[${locale}] Interpolation mismatch for ${key}:` +
          ` expected ${base.join(", ") || "∅"}, got ${current.join(", ") || "∅"}`,
      );
    }
  }
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log("i18n audit: OK");
}
