#!/usr/bin/env node
/**
 * Fail CI if the locked PostCSS selector parser drops below a published
 * security fix, or if Tailwind leaves v3 before AppDeploy supports v4.
 *
 * npm audit may still report GHSA-rj75-hqrm-r3gf against 6.1.5 because its
 * advisory range has not yet incorporated the maintained 6.x backport.
 */
import { readFileSync } from "node:fs";

const lockUrl = new URL("../package-lock.json", import.meta.url);
const lock = JSON.parse(readFileSync(lockUrl, "utf8"));
const packages = lock.packages ?? {};

function parseVersion(raw) {
  const match = typeof raw === "string" && /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(raw);
  if (!match) throw new Error("Unexpected package version: " + String(raw));
  return match.slice(1, 4).map(Number);
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function parserIsPatched(rawVersion) {
  const actual = parseVersion(rawVersion);
  if (actual[0] === 6) return compareVersions(actual, [6, 1, 5]) >= 0;
  if (actual[0] === 7) return compareVersions(actual, [7, 1, 6]) >= 0;
  return actual[0] > 7;
}

const parserEntries = Object.entries(packages).filter(([path]) =>
  /(^|\/)node_modules\/postcss-selector-parser$/.test(path)
);
if (parserEntries.length === 0) {
  console.error("SECURITY FLOOR FAIL: package-lock.json has no postcss-selector-parser entry.");
  process.exit(1);
}

const parserFailures = parserEntries.filter(([, pkg]) =>
  typeof pkg.version !== "string" || !parserIsPatched(pkg.version)
);
if (parserFailures.length > 0) {
  for (const [path, pkg] of parserFailures) {
    console.error("SECURITY FLOOR FAIL: " + path + " resolves " + (pkg.version ?? "an unknown version") + ".");
  }
  console.error("Require postcss-selector-parser >=6.1.5 on the maintained 6.x line or >=7.1.6 on the 7.x line.");
  process.exit(1);
}

const tailwind = packages["node_modules/tailwindcss"];
if (!tailwind || typeof tailwind.version !== "string") {
  console.error("COMPATIBILITY GUARD FAIL: tailwindcss is absent from the lockfile.");
  process.exit(1);
}
const tailwindVersion = parseVersion(tailwind.version);
if (tailwindVersion[0] !== 3) {
  console.error(
    "COMPATIBILITY GUARD FAIL: Tailwind " + tailwind.version +
    " is not approved for the current AppDeploy CSS entry. Keep major version 3 until a hosted v4 validation succeeds."
  );
  process.exit(1);
}

console.log(
  "Dependency floors OK: postcss-selector-parser " +
  parserEntries.map(([, pkg]) => pkg.version).join(", ") +
  "; Tailwind CSS " + tailwind.version + "."
);
