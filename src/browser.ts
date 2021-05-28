import { BrowserNames, CompatStatement } from "@mdn/browser-compat-data/types";

export const MODERN_BROWSERS: BrowserNames[] = [
  "chrome",
  "chrome_android",
  "edge",
  "firefox",
  "firefox_android",
  "safari",
  "safari_ios",
  "webview_android",
];

export function isSupportedBy(
  compat: CompatStatement,
  browser: BrowserNames
): boolean {
  const statement = compat.support[browser];
  if (!statement) return false;
  if (Array.isArray(statement)) {
    return statement.every(s => s.version_added !== false);
  }

  return statement.version_added !== false;
}

export function isSupportedByModernBrowsers(compat: CompatStatement): boolean {
  return MODERN_BROWSERS.every((browser) => isSupportedBy(compat, browser));
}
