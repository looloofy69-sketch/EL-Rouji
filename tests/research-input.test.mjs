import test from "node:test";
import assert from "node:assert/strict";

import { isDirectUrlResearchQuery } from "../backend/research-input.ts";

test("recognizes direct HTTP(S) URLs case-insensitively", () => {
  for (const value of [
    "https://example.org/article",
    "http://example.org/article",
    "HTTPS://example.org/article",
    "  https://example.org/article  ",
  ]) {
    assert.equal(isDirectUrlResearchQuery(value), true, value);
  }
});

test("does not classify ordinary research questions as direct URLs", () => {
  for (const value of [
    "What changed in Algerian labour law this year?",
    "Compare these sources: https://example.org/article",
    "ftp://example.org/article",
    "https is a secure web protocol",
  ]) {
    assert.equal(isDirectUrlResearchQuery(value), false, value);
  }
});

test("keeps the helper's scope explicit: it classifies input, not remote destinations", () => {
  assert.equal(isDirectUrlResearchQuery("https://attacker.example/path"), true);
});
