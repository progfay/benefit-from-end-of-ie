import {
  CompatStatement,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data/types";
import { MODERN_BROWSERS } from "./browser";

const HEADER = `
# Benefit from end of IE

"Benefit" mean...

- Feature what supported Modern browser
${MODERN_BROWSERS.map((browser) => `  - \`${browser}\``).join("\n")}
- But it's unavailable in IE...

## Features List

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
