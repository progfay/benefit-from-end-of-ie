import compatData from "@mdn/browser-compat-data";
import { Identifier } from "@mdn/browser-compat-data/types";
import { isSupportedBy, isSupportedByModernBrowsers } from "./browser";
import { renderFeatureTableRow, renderHeader } from "./render";

function visitIdentifier(path: string, identifier: Identifier): void {
  const { __compat, ...identifiers } = identifier;
  if (
    __compat &&
    __compat.status?.deprecated !== true &&
    !isSupportedBy(__compat, "ie") &&
    isSupportedByModernBrowsers(__compat)
  ) {
    console.log(renderFeatureTableRow(path, __compat));
    return;
  }

  for (const [key, value] of Object.entries(identifiers)) {
    visitIdentifier(`${path} > ${key}`, value);
  }
}

type CompatDataIdentifierKey = keyof Omit<typeof compatData, "browsers">;
type CompatDataKey = CompatDataIdentifierKey | "browsers" | "__meta";

const EXCLUDE_COMPAT_DATA_IDENTIFIER_KEYS: CompatDataIdentifierKey[] = [
  "webdriver",
  "webextensions",
];

function main() {
  console.log(renderHeader());
  for (const key of Object.keys(compatData) as CompatDataKey[]) {
    if (key === "__meta" || key === "browsers") continue;
    if (EXCLUDE_COMPAT_DATA_IDENTIFIER_KEYS.includes(key)) continue;

    visitIdentifier(key, compatData[key]);
  }
}

main();
