import compatData from "@mdn/browser-compat-data";
import {
  BrowserNames,
  CompatStatement,
  Identifier,
} from "@mdn/browser-compat-data/types";

function isSupportedBy(
  compat: CompatStatement,
  browser: BrowserNames
): boolean {
  const statement = compat.support[browser];
  if (!statement) return false;
  if (Array.isArray(statement)) {
    return statement.some((state) => state.version_added);
  }

  return statement.version_added !== false;
}

const modernBrowsers: BrowserNames[] = [
  "chrome",
  "chrome_android",
  "edge",
  "firefox",
  "firefox_android",
  "safari",
  "safari_ios",
  "webview_android",
];
function isSupportedByModernBrowsers(compat: CompatStatement): boolean {
  return modernBrowsers.every((browser) => isSupportedBy(compat, browser));
}

function visitIdentifier(path: string, identifier: Identifier): void {
  const { __compat, ...identifiers } = identifier;
  if (
    __compat &&
    __compat.status?.deprecated !== true &&
    !isSupportedBy(__compat, "ie") &&
    isSupportedByModernBrowsers(__compat)
  ) {
    const { mdn_url } = __compat;
    if (mdn_url) {
      console.log(`- [${path}](${__compat.mdn_url})`);
    } else {
      console.log(`- ${path}`);
    }
    return;
  }

  for (const [key, value] of Object.entries(identifiers)) {
    visitIdentifier(`${path} > ${key}`, value);
  }
}

const header = `
# Benefit from end of IE

"Benefit" mean...

- Feature what supported Modern browser
${modernBrowsers.map((browser) => `  - \`${browser}\``).join("\n")}
- But it's unavailable in IE...

## Features List
`.trimStart();

function main() {
  console.log(header);
  for (const key of Object.keys(compatData)) {
    if (
      ["browsers", "webdriver", "webextensions", "xpath", "xslt"].includes(key)
    )
      continue;
    visitIdentifier(key, compatData[key]);
  }
}

main();
