import type {
  CompatStatement,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data/types";
import { readFileSync } from "fs";
import path from "path";
import { MODERN_BROWSERS } from "./browser";

function getPackageVersion(packageName: string): string {
  const filePath = path.resolve("./node_modules", packageName, "package.json");
  const packageJson = readFileSync(filePath, { encoding: "ascii" });
  const { version } = JSON.parse(packageJson) as { version?: unknown };
  return typeof version === "string" ? version : "unknown";
}

const HEADER = `
# Benefit from end of IE

## Description

- Support of IE will be end on [2022/06/15](https://death-to-ie11.com/).
- This changes should improve browser compatibility.

> Not only is Microsoft Edge a faster, more secure and more modern browsing experience than Internet Explorer, but it is also able to address a key concern: compatibility for older, legacy websites and applications.

Ref. [The future of Internet Explorer on Windows 10 is in Microsoft Edge | Windows Experience Blog](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge/)

## "Benefit" means...

- Feature what supported Modern browser
${MODERN_BROWSERS.map((browser) => `  - \`${browser}\``).join("\n")}
- But it's unavailable in IE...

## Features List

- Version of [@mdn/browser-compat-data](https://github.com/mdn/browser-compat-data): ${getPackageVersion(
  "@mdn/browser-compat-data"
)}
- Generated date: ${new Date().toUTCString()}

| Feature | ${MODERN_BROWSERS.join(" | ")} |
| :------ | ${" :-: |".repeat(MODERN_BROWSERS.length)}
`.trim();

export function renderHeader(): string {
  return HEADER;
}

function renderFeature(text: string, url?: string): string {
  return url !== undefined ? `[${text}](${url})` : text;
}

function getVersionAdded(support: SupportStatement): VersionValue {
  const version = Array.isArray(support)
    ? support[0].version_added
    : support.version_added;
  return version !== true ? version : "Yes";
}

function renderSupport(support: SupportStatement | undefined): string {
  if (support === undefined) return "❌";
  const version = getVersionAdded(support);
  return version === null
    ? "❓"
    : version === true
    ? "Yes"
    : version === false
    ? "❌"
    : version;
}

export function renderFeatureTableRow(
  path: string,
  compat: CompatStatement
): string {
  return `| ${renderFeature(path, compat.mdn_url)} | ${MODERN_BROWSERS.map(
    (browser) => renderSupport(compat.support[browser])
  ).join(" | ")} |`;
}
