import { CompatStatement } from "@mdn/browser-compat-data/types";
import { MODERN_BROWSERS } from "./browser";

const HEADER = `
# Benefit from end of IE

"Benefit" mean...

- Feature what supported Modern browser
${MODERN_BROWSERS.map((browser) => `  - \`${browser}\``).join("\n")}
- But it's unavailable in IE...

## Features List
`.trimStart();

export function renderHeader(): string {
  return HEADER;
}

function renderFeature(text: string, url?: string): string {
  return url !== undefined ? `[${text}](${url})` : text;
}

export function renderFeatureTableRow(
  path: string,
  compat: CompatStatement
): string {
  return `- ${renderFeature(path, compat.mdn_url)}`;
}
