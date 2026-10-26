import { test } from "node:test";
import assert from "node:assert/strict";
import * as E from "../src/game/engine";
import { TiltGate } from "../src/game/tilt";
import { parseWords, validDeck, customWords } from "../src/data/custom";
import {
  normalizeLanguage,
  resolveInitialLanguage,
  translate,
} from "../src/i18n";
import { CATEGORIES, categories, categoryWords } from "../src/data/catalog";
const words: E.Word[] = Array.from({ length: 5 }, (_, i) => ({
  id: `w${i}`,
  text: `word ${i}`,
  category: "test",
  clue: "Mimica",
}));
function create(s: Partial<E.Settings> = {}, pool = words) {
  return E.createGame({ ...E.DEFAULTS, ...s }, pool, "it", () => 0.4);
}
function active(g = create(), now = 0) {
  return E.tick(E.startCountdown(g, now), now + 3000);
}
test("Preparation and countdown never accept answers", () => {
  let g = create();
  assert.equal(E.answer(g, "correct", 0), g);
  g = E.startCountdown(g, 0);
  assert.equal(g.phase, "countdown");
  assert.equal(E.answer(g, "correct", 2999), g);
});
test("Countdown starts timer at actual activation time", () => {
  const g = E.tick(E.startCountdown(create(), 0), 3500);
  assert.equal(g.deadline, 63500);
});
test("Correct +1; skip zero by default", () => {
  let g = active();
  g = E.answer(g, "correct", 3100);
  g = E.answer(g, "skip", 3800);
  assert.equal(E.points(g.entries, g.settings), 1);
});
test("Skip penalty can produce negative scores", () => {
  let g = active(create({ skipPenalty: 1 }));
  g = E.answer(g, "skip", 3100);
  assert.equal(E.points(g.entries, g.settings), -1);
});
test("Simultaneous touch and sensor are deduplicated by serial and feedback lock", () => {
  const g = active();
  const a = E.answer(g, "correct", 3100, g.serial);
  assert.equal(E.answer(a, "skip", 3100, g.serial), a);
  assert.equal(E.answer(a, "correct", 3200), a);
  assert.equal(E.answer(a, "correct", 4000, g.serial), a);
});
test("No response is accepted at or after the deadline", () => {
  const g = active();
  const a = E.answer(g, "correct", 63000);
  assert.equal(a.phase, "review");
  assert.equal(a.entries.length, 1);
  assert.equal(a.entries[0]!.outcome, "open");
  assert.equal(E.points(a.entries, a.settings), 0);
});
test("Open word receives no skip penalty", () => {
  const g = E.endTurn(active(create({ skipPenalty: 1 })));
  assert.equal(E.points(g.entries, g.settings), 0);
});
test("Elapsed time does not depend on tick frequency", () => {
  const g = active();
  assert.equal(E.remaining(g, 34999), 28001);
  assert.equal(E.tick(g, 63001).phase, "review");
});
test("Pause freezes time and explicit resume uses countdown", () => {
  const g = E.pause(active(), 10000);
  assert.equal(g.remainingMs, 53000);
  assert.equal(E.remaining(g, 1000000), 53000);
  assert.equal(E.answer(g, "correct", 10001), g);
  const r = E.tick(E.startCountdown(g, 100000), 103000);
  assert.equal(r.deadline, 156000);
});
test("Pausing countdown hides words without spending turn time", () => {
  const g = E.pause(E.startCountdown(create(), 0), 2000);
  assert.equal(g.phase, "paused");
  assert.equal(g.remainingMs, 60000);
});
test("Pausing after expiry produces review", () => {
  assert.equal(E.pause(active(), 64000).phase, "review");
});
test("Skip limits do not block correct answers", () => {
  let g = active(create({ maxSkips: 0 }));
  assert.equal(E.answer(g, "skip", 3100), g);
  assert.equal(E.answer(g, "correct", 3100).entries.length, 1);
});
test("Review edits recalculate score before confirmation", () => {
  let g = E.endTurn(E.answer(active(create({ skipPenalty: 1 })), "skip", 3100));
  assert.equal(E.points(g.entries, g.settings), -1);
  g = E.edit(g, 0, "correct");
  g = E.edit(g, 1, "open");
  assert.equal(E.points(g.entries, g.settings), 1);
  assert.equal(E.commit(g).teams[0]!.score, 1);
});
test("A reviewed open word can be corrected", () => {
  const g = E.edit(E.endTurn(active()), 0, "correct");
  assert.equal(E.points(g.entries, g.settings), 1);
});
test("Confirm is idempotent outside review", () => {
  const g = E.commit(E.endTurn(active()));
  assert.equal(E.commit(g), g);
});
for (const count of [2, 3, 4])
  for (const rounds of [1, 3, 5, 7])
    test(`Equal turns: ${count} teams, ${rounds} rounds`, () => {
      let g = create({ mode: "teams", teamCount: count, rounds });
      for (let n = 0; n < count * rounds; n++) {
        assert.equal(E.teamIndex(g), n % count);
        assert.equal(E.round(g), Math.floor(n / count) + 1);
        g = E.commit(E.endTurn(active(g)));
      }
      assert.equal(g.phase, "finished");
      assert.equal(g.history.length, count * rounds);
      for (let i = 0; i < count; i++)
        assert.equal(g.history.filter((t) => t.team === i).length, rounds);
    });
test("Quick play finishes after one turn", () => {
  const g = E.commit(E.endTurn(active()));
  assert.equal(g.phase, "finished");
  assert.equal(g.history.length, 1);
});
test("Ties include all teams at highest score, even negative", () => {
  const g = create({ mode: "teams", teamCount: 3 });
  g.teams[0]!.score = -1;
  g.teams[1]!.score = -2;
  g.teams[2]!.score = -1;
  assert.deepEqual(
    E.winners(g).map((t) => t.name),
    ["Coral", "Mango"],
  );
});
test("A unique winner is identified", () => {
  const g = create({ mode: "teams" });
  g.teams[1]!.score = 4;
  assert.deepEqual(
    E.winners(g).map((t) => t.name),
    ["Violet"],
  );
});
test("Pool has no repeats before exhaustion and no boundary repeat", () => {
  let g = active();
  const cycle = [];
  for (let i = 0; i < 6; i++) {
    cycle.push(g.current.id);
    g = E.answer(g, "correct", 3100 + i * 700);
  }
  assert.equal(new Set(cycle.slice(0, 5)).size, 5);
  assert.notEqual(cycle[4], cycle[5]);
});
test("Single-word pools remain playable indefinitely", () => {
  let g = active(create({}, words.slice(0, 1)));
  for (let i = 0; i < 12; i++) g = E.answer(g, "correct", 3100 + i * 700);
  assert.equal(g.entries.length, 12);
  assert.equal(g.current.id, "w0");
});
test("Empty pool rejected; repeated text deduplicated", () => {
  assert.throws(() => create({}, []));
  assert.equal(
    create({}, [words[0]!, { ...words[1]!, text: "WORD 0" }]).pool.length,
    1,
  );
});
test("Saved active match recovers paused", () => {
  const g = active();
  const r = E.restoreGame(JSON.parse(JSON.stringify(g)))!;
  assert.equal(r.phase, "paused");
  assert.equal(r.deadline, null);
});
test("Corrupt and unsupported saves are rejected", () => {
  for (const x of [
    null,
    {},
    "oops",
    { ...create(), queue: [99] },
    { ...create(), teams: [] },
    { ...create(), entries: [{ outcome: "bad" }] },
    { ...create(), version: 4 },
  ])
    assert.equal(E.restoreGame(x), null);
});
test("Match contains an immutable copy of a custom deck", () => {
  const d = {
    id: "custom-test",
    name: "Mine",
    color: "#FF817C",
    language: "it" as const,
    words: parseWords("Alpha\nBeta"),
  };
  const g = create({}, customWords(d, "Indizi liberi"));
  d.words[0]!.text = "Changed";
  d.words = [];
  assert.equal(g.pool.length, 2);
  assert.ok(g.pool.some((w) => w.text === "Alpha"));
});
test("Bulk words normalize whitespace, Unicode and case duplicates", () => {
  const w = parseWords("  Ciao   mondo\nciao mondo\n\nCaffè\nＣａｆｆè");
  assert.deepEqual(
    w.map((x) => x.text),
    ["Ciao mondo", "Caffè"],
  );
});
test("Editing preserves stable custom word IDs", () => {
  const old = parseWords("Alpha\nBeta");
  const next = parseWords("Beta\nAlpha\nGamma", old);
  assert.equal(next[0]!.id, old[1]!.id);
  assert.equal(next[1]!.id, old[0]!.id);
});
test("Empty decks valid, missing name/invalid color/oversized entry rejected", () => {
  const d = {
    id: "custom-test",
    name: "Mine",
    language: "it",
    color: "#FF817C",
    words: [],
  };
  assert.ok(validDeck(d));
  assert.ok(!validDeck({ ...d, name: " " }));
  assert.ok(!validDeck({ ...d, color: "red" }));
  assert.ok(!validDeck({ ...d, words: [{ id: "a", text: "x".repeat(101) }] }));
});
test("Unsupported device language falls back to English and manual selection wins", () => {
  assert.equal(normalizeLanguage("fr-CA"), "fr");
  assert.equal(normalizeLanguage("ja-JP"), "en");
  assert.equal(resolveInitialLanguage("it", "de-DE"), "it");
  assert.equal(resolveInitialLanguage("broken", "es_ES"), "es");
});
test("All included categories have 300 unique localized entries and stable IDs", () => {
  assert.equal(CATEGORIES.length, 12);
  const ids = new Set<string>();
  for (const language of ["it", "en", "es", "de", "fr"] as const) {
    assert.equal(categories(language).length, 12);
    for (const cat of categories(language)) {
      const words = categoryWords(cat.id, language);
      assert.equal(cat.count, 300);
      assert.equal(words.length, 300);
      assert.equal(
        new Set(words.map((w) => w.text.toLocaleLowerCase(language))).size,
        300,
      );
      for (const word of words) {
        assert.ok(word.text.trim());
        assert.ok(
          !/^(?:entry|voce|animale|animal|parola|word) \d+$/i.test(word.text),
        );
        if (language === "it") {
          assert.ok(!ids.has(word.id));
          ids.add(word.id);
        }
      }
    }
  }
  assert.equal(ids.size, 3600);
});
test("All new messages have exactly five nonempty languages", async () => {
  const { MESSAGE_ROWS } = await import("../src/i18n/messages");
  for (const row of MESSAGE_ROWS) {
    assert.equal(row.length, 5, row[0]);
    assert.ok(
      row.every((s) => s.trim().length),
      row[0],
    );
  }
});
test("Categories, rules and headline have translated interface strings", () => {
  for (const l of ["en", "es", "de", "fr"] as const) {
    assert.notEqual(translate(l, "Tu non vedi."), "Tu non vedi.");
    assert.notEqual(
      translate(l, "Come si gioca in 4 mosse."),
      "Come si gioca in 4 mosse.",
    );
  }
});
test("Tilt filters jitter, emits once, requires neutral rearm", () => {
  const gate = new TiltGate();
  gate.calibrate(0);
  const events = [];
  for (let i = 0; i < 12; i++)
    events.push(gate.sample(i % 2 ? 0.05 : -0.05, true));
  assert.ok(events.every((x) => x === null));
  let hits = 0;
  for (let i = 0; i < 40; i++) if (gate.sample(-1, true) === "correct") hits++;
  assert.equal(hits, 1);
  for (let i = 0; i < 30; i++) gate.sample(0, true);
  for (let i = 0; i < 20; i++) if (gate.sample(1, true) === "skip") hits++;
  assert.equal(hits, 2);
});
test("Tilt remains inactive in countdown, pause and feedback", () => {
  const g = new TiltGate();
  g.calibrate(0);
  for (let i = 0; i < 20; i++) g.sample(0, true);
  for (let i = 0; i < 20; i++) assert.equal(g.sample(-1, false), null);
  for (let i = 0; i < 20; i++) assert.equal(g.sample(-1, true), null);
});
test("Tilt is relative to calibrated baseline and ignores invalid measurements", () => {
  const g = new TiltGate();
  assert.equal(g.sample(-1, true), null);
  g.calibrate(0.1);
  assert.equal(g.sample(NaN, true), null);
  for (let i = 0; i < 10; i++) g.sample(0.1, true);
  let hit = false;
  for (let i = 0; i < 25; i++)
    if (g.sample(-0.8, true) === "correct") hit = true;
  assert.ok(hit);
});
