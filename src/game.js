const IGNORED_KEYS = new Set([
  "Alt",
  "Shift",
  "Control",
  "Escape",
  "Tab",
  "CapsLock",
  "NumLock",
  "Meta",
  "OS",
  "ContextMenu",
]);

export function gameHasProgress(currentGuessIndex, currentGuess) {
  return currentGuessIndex > 0 || currentGuess.length > 0;
}

export function shouldSubmitInsteadOfButton(currentGuess, currentGuessIndex, won) {
  return currentGuess.length === 5 && currentGuessIndex < 6 && !won;
}

export function normalizeKey(key) {
  if (key === "{enter}" || key === "Enter") return "{enter}";
  if (key === "{bksp}" || key === "Backspace") return "{bksp}";
  if (typeof key !== "string" || IGNORED_KEYS.has(key)) return null;
  if (/^[a-zA-Z]$/.test(key)) return key.toLowerCase();
  return null;
}
