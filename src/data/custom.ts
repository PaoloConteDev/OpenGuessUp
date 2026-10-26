import type { Language } from "../i18n";
import type { Word } from "../game/engine";
export type CustomDeck = {
  id: string;
  name: string;
  color: string;
  language: Language;
  words: { id: string; text: string }[];
};
export const clean = (text: string) =>
  text.normalize("NFKC").trim().replace(/\s+/g, " ");
export function parseWords(text: string, old: CustomDeck["words"] = []) {
  const seen = new Set<string>();
  const lookup = new Map(
    old.map((w) => [clean(w.text).toLocaleLowerCase(), w.id]),
  );
  return text
    .split(/\r?\n/)
    .map(clean)
    .filter((t) => {
      const k = t.toLocaleLowerCase();
      if (!t || seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((text) => ({
      id:
        lookup.get(text.toLocaleLowerCase()) ??
        `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
      text,
    }));
}
export function validDeck(d: unknown): d is CustomDeck {
  const x = d as CustomDeck;
  return (
    !!x &&
    typeof x.id === "string" &&
    x.id.startsWith("custom-") &&
    typeof x.name === "string" &&
    !!clean(x.name) &&
    x.name.length <= 50 &&
    /^#[0-9a-f]{6}$/i.test(x.color) &&
    ["it", "en", "es", "fr", "de"].includes(x.language) &&
    Array.isArray(x.words) &&
    x.words.length <= 3000 &&
    x.words.every(
      (w) =>
        w &&
        typeof w.id === "string" &&
        typeof w.text === "string" &&
        !!clean(w.text) &&
        w.text.length <= 100,
    ) &&
    new Set(x.words.map((w) => w.id)).size === x.words.length &&
    new Set(x.words.map((w) => clean(w.text).toLocaleLowerCase())).size ===
      x.words.length
  );
}
export const customWords = (d: CustomDeck, clue: string): Word[] =>
  d.words.map((w) => ({
    ...w,
    text: w.text,
    id: `${d.id}/${w.id}`,
    category: d.name,
    clue,
  }));
