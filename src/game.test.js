import assert from "node:assert/strict";
import test from "node:test";
import { gameHasProgress, normalizeKey, shouldSubmitInsteadOfButton } from "./game.js";

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

test("shouldSubmitInsteadOfButton keeps Enter for a finished guess", () => {
  assert.equal(shouldSubmitInsteadOfButton("crane", 0, false), true);
  assert.equal(shouldSubmitInsteadOfButton("cat", 0, false), false);
  assert.equal(shouldSubmitInsteadOfButton("", 0, false), false);
  assert.equal(shouldSubmitInsteadOfButton("crane", 6, false), false);
  assert.equal(shouldSubmitInsteadOfButton("crane", 1, true), false);
});

test("gameHasProgress asks for a new game only after the round has started", () => {
  assert.equal(gameHasProgress(0, ""), false);
  assert.equal(gameHasProgress(0, "ab"), true);
  assert.equal(gameHasProgress(1, ""), true);
  assert.equal(gameHasProgress(6, ""), true);
});

test("normalizeKey ignores modifier, navigation, and multi-character keys", () => {
  for (const key of ["ArrowLeft", "ArrowUp", "F1", "Meta", "Shift", "Tab", "Escape", "Home", " ", "ab", "Dead"]) {
    assert.equal(normalizeKey(key), null, key);
  }
});
