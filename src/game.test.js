import assert from "node:assert/strict";
import test from "node:test";
import { normalizeKey } from "./game.js";

test("normalizeKey accepts a single letter and lowercases it", () => {
  assert.equal(normalizeKey("A"), "a");
  assert.equal(normalizeKey("z"), "z");
});

test("normalizeKey maps enter and backspace from the keyboard and the on-screen keys", () => {
  assert.equal(normalizeKey("Enter"), "{enter}");
  assert.equal(normalizeKey("{enter}"), "{enter}");
  assert.equal(normalizeKey("Backspace"), "{bksp}");
  assert.equal(normalizeKey("{bksp}"), "{bksp}");
});

test("normalizeKey ignores modifier, navigation, and multi-character keys", () => {
  for (const key of ["ArrowLeft", "ArrowUp", "F1", "Meta", "Shift", "Tab", "Escape", "Home", " ", "ab", "Dead"]) {
    assert.equal(normalizeKey(key), null, key);
  }
});
