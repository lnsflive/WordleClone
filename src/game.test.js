import assert from "node:assert/strict";
import test from "node:test";
import { gameHasProgress, normalizeKey, shouldPreserveKeyDefault, shouldSubmitInsteadOfButton, trackDialogEnter, trapTab } from "./game.js";

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

test("trackDialogEnter ignores the Enter release that closes the dialog", () => {
  const down = trackDialogEnter(false, { type: "down", key: "Enter", dialogOpen: true, repeat: false });
  assert.equal(down.swallowEnterUp, true);
  assert.equal(down.ignore, false);

  const up = trackDialogEnter(down.swallowEnterUp, { type: "up", key: "Enter", dialogOpen: false, repeat: false });
  assert.equal(up.ignore, true);
  assert.equal(up.swallowEnterUp, false);

  const next = trackDialogEnter(up.swallowEnterUp, { type: "up", key: "Enter", dialogOpen: false, repeat: false });
  assert.equal(next.ignore, false);
});

test("trackDialogEnter does not let a held Enter clear the swallowed release", () => {
  const held = trackDialogEnter(true, { type: "down", key: "Enter", dialogOpen: false, repeat: true });
  assert.equal(held.swallowEnterUp, true);
  const fresh = trackDialogEnter(true, { type: "down", key: "Enter", dialogOpen: false, repeat: false });
  assert.equal(fresh.swallowEnterUp, false);
});

test("shouldPreserveKeyDefault lets Space activate a dialog button", () => {
  assert.equal(shouldPreserveKeyDefault(" ", true, true), true);
  assert.equal(shouldPreserveKeyDefault(" ", true, false), false);
  assert.equal(shouldPreserveKeyDefault("Enter", true, true), false);
  assert.equal(shouldPreserveKeyDefault(" ", false, true), false);
});

test("shouldPreserveKeyDefault lets Space activate a game control", () => {
  assert.equal(shouldPreserveKeyDefault(" ", false, false, true), true);
  assert.equal(shouldPreserveKeyDefault(" ", false, false, false), false);
  assert.equal(shouldPreserveKeyDefault("Enter", false, false, true), false);
  assert.equal(shouldPreserveKeyDefault(" ", true, false, true), false);
});

test("trapTab keeps Tab inside the confirmation buttons", () => {
  assert.deepEqual(trapTab(1, 2, false, true), { prevent: true, index: 0 });
  assert.deepEqual(trapTab(0, 2, true, true), { prevent: true, index: 1 });
  assert.deepEqual(trapTab(0, 2, false, true), { prevent: false, index: 0 });
  assert.deepEqual(trapTab(-1, 2, false, false), { prevent: true, index: 0 });
  assert.deepEqual(trapTab(-1, 2, true, false), { prevent: true, index: 1 });
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
