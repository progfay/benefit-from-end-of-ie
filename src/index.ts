import * as compatData from "@mdn/browser-compat-data";
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
    !isSupportedBy(__compat, "ie") &&
    isSupportedByModernBrowsers(__compat)
  ) {
    console.log(path);
    return;
  }

  for (const [key, value] of Object.entries(identifiers)) {
    visitIdentifier(`${path} > ${key}`, value);
  }
}

function main() {
  for (const [key, value] of Object.entries(compatData)) {
    if (["browsers", "default", "webextensions"].includes(key)) continue;
    visitIdentifier(key, value);
  }
}

main();
