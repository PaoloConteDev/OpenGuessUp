import type { Language } from "../i18n";
export type Word = { id: string; text: string; category: string; clue: string };
export type Outcome = "correct" | "skip" | "open";
export type Settings = {
  mode: "quick" | "teams";
  teamCount: number;
  names: string[];
  seconds: number;
  rounds: number;
  skipPenalty: number;
  maxSkips: number;
  sound: boolean;
  haptics: boolean;
  sensors: boolean;
  recording: boolean;
  decks: string[];
};
export const DEFAULTS: Settings = {
  mode: "quick",
  teamCount: 2,
  names: ["Coral", "Violet", "Mango", "Mint"],
  seconds: 60,
  rounds: 3,
  skipPenalty: 0,
  maxSkips: -1,
  sound: true,
  haptics: true,
  sensors: true,
  recording: false,
  decks: ["animals"],
};
export function normalizeSettings(raw: Partial<Settings> = {}): Settings {
  const one = (v: unknown, choices: number[], fallback: number) =>
    choices.includes(Number(v)) ? Number(v) : fallback;
  return {
    ...DEFAULTS,
    mode: raw.mode === "teams" ? "teams" : "quick",
    teamCount: one(raw.teamCount, [2, 3, 4], 2),
    names: DEFAULTS.names.map((n, i) =>
      typeof raw.names?.[i] === "string"
        ? raw.names[i]!.trim().slice(0, 24) || n
        : n,
    ),
    seconds: one(raw.seconds, [30, 45, 60, 90, 120], 60),
    rounds: one(raw.rounds, [1, 3, 5, 7], 3),
    skipPenalty: one(raw.skipPenalty, [0, 1], 0),
    maxSkips: one(raw.maxSkips, [-1, 0, 3, 5, 10], -1),
    decks: Array.isArray(raw.decks)
      ? [...new Set(raw.decks.filter((x) => typeof x === "string"))]
      : DEFAULTS.decks,
    ...Object.fromEntries(
      ["sound", "haptics", "sensors", "recording"].map((k) => [
        k,
        typeof raw[k as keyof Settings] === "boolean"
          ? raw[k as keyof Settings]
          : DEFAULTS[k as keyof Settings],
      ]),
    ),
  } as Settings;
}
export type Entry = { word: Word; outcome: Outcome };
export type Turn = { team: number; entries: Entry[] };
export type Phase =
  "preparation" | "countdown" | "active" | "paused" | "review" | "finished";
export type Game = {
  version: 1;
  language: Language;
  settings: Settings;
  phase: Phase;
  teams: { name: string; score: number }[];
  turn: number;
  pool: Word[];
  queue: number[];
  cursor: number;
  current: Word;
  entries: Entry[];
  history: Turn[];
  remainingMs: number;
  deadline: number | null;
  countdownEnd: number | null;
  lockUntil: number;
  serial: number;
};
export function shuffle<T>(items: T[], rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
export function createGame(
  settings: Settings,
  words: Word[],
  language: Language,
  rng = Math.random,
): Game {
  if (!words.length) throw new Error("Empty pool");
  const pool = [
    ...new Map(
      words.map((w) => [
        w.text.normalize("NFKC").toLocaleLowerCase(language),
        { ...w },
      ]),
    ).values(),
  ];
  const queue = shuffle(
    pool.map((_, i) => i),
    rng,
  );
  const s = normalizeSettings(settings);
  return {
    version: 1,
    language,
    settings: s,
    phase: "preparation",
    teams: (s.mode === "quick"
      ? ["Open GuessUp"]
      : s.names.slice(0, s.teamCount)
    ).map((name) => ({ name, score: 0 })),
    turn: 0,
    pool,
    queue,
    cursor: 0,
    current: pool[queue[0]!]!,
    entries: [],
    history: [],
    remainingMs: s.seconds * 1000,
    deadline: null,
    countdownEnd: null,
    lockUntil: 0,
    serial: 0,
  };
}
export const teamIndex = (g: Game) => g.turn % g.teams.length;
export const round = (g: Game) => Math.floor(g.turn / g.teams.length) + 1;
export const points = (entries: Entry[], s: Settings) =>
  entries.reduce(
    (n, e) =>
      n +
      (e.outcome === "correct" ? 1 : e.outcome === "skip" ? -s.skipPenalty : 0),
    0,
  );
export const skipsLeft = (g: Game) =>
  g.settings.maxSkips < 0
    ? Infinity
    : Math.max(
        0,
        g.settings.maxSkips -
          g.entries.filter((e) => e.outcome === "skip").length,
      );
export const remaining = (g: Game, now: number) =>
  g.phase === "active" ? Math.max(0, (g.deadline ?? now) - now) : g.remainingMs;
function nextWord(g: Game, rng = Math.random): Game {
  let queue = g.queue,
    cursor = g.cursor + 1;
  if (cursor >= queue.length) {
    queue = shuffle(
      g.pool.map((_, i) => i),
      rng,
    );
    cursor = 0;
    if (queue.length > 1 && g.pool[queue[0]!]!.id === g.current.id)
      [queue[0], queue[1]] = [queue[1]!, queue[0]!];
  }
  return {
    ...g,
    queue,
    cursor,
    current: g.pool[queue[cursor]!]!,
    serial: g.serial + 1,
  };
}
export function endTurn(g: Game): Game {
  if (!["active", "paused"].includes(g.phase)) return g;
  return {
    ...g,
    phase: "review",
    entries: [...g.entries, { word: g.current, outcome: "open" }],
    remainingMs: 0,
    deadline: null,
    lockUntil: 0,
  };
}
export function tick(g: Game, now: number): Game {
  if (g.phase === "countdown" && now >= (g.countdownEnd ?? Infinity))
    return {
      ...g,
      phase: "active",
      deadline: now + g.remainingMs,
      countdownEnd: null,
      lockUntil: 0,
    };
  if (g.phase === "active" && remaining(g, now) <= 0) return endTurn(g);
  return g;
}
export function startCountdown(g: Game, now: number): Game {
  if (!["preparation", "paused"].includes(g.phase)) return g;
  return { ...g, phase: "countdown", countdownEnd: now + 3000, deadline: null };
}
export function answer(
  g: Game,
  outcome: "correct" | "skip",
  now: number,
  serial = g.serial,
): Game {
  g = tick(g, now);
  if (
    g.phase !== "active" ||
    now < g.lockUntil ||
    serial !== g.serial ||
    (outcome === "skip" && skipsLeft(g) === 0)
  )
    return g;
  return nextWord({
    ...g,
    entries: [...g.entries, { word: g.current, outcome }],
    lockUntil: now + 650,
  });
}
export function pause(g: Game, now: number): Game {
  if (g.phase === "countdown")
    return { ...g, phase: "paused", countdownEnd: null };
  if (g.phase !== "active") return g;
  const r = remaining(g, now);
  return r <= 0
    ? endTurn(g)
    : { ...g, phase: "paused", remainingMs: r, deadline: null };
}
export function edit(g: Game, index: number, outcome: Outcome): Game {
  if (g.phase !== "review") return g;
  return {
    ...g,
    entries: g.entries.map((e, i) => (i === index ? { ...e, outcome } : e)),
  };
}
export function commit(g: Game): Game {
  if (g.phase !== "review") return g;
  const team = teamIndex(g),
    turn = g.turn + 1;
  const finished =
    turn >=
    g.teams.length * (g.settings.mode === "quick" ? 1 : g.settings.rounds);
  const next = nextWord(g);
  return {
    ...next,
    teams: g.teams.map((t, i) =>
      i === team ? { ...t, score: t.score + points(g.entries, g.settings) } : t,
    ),
    history: [...g.history, { team, entries: g.entries }],
    entries: [],
    turn,
    phase: finished ? "finished" : "preparation",
    remainingMs: g.settings.seconds * 1000,
    deadline: null,
    countdownEnd: null,
    lockUntil: 0,
  };
}
export function winners(g: Game) {
  const max = Math.max(...g.teams.map((t) => t.score));
  return g.teams.filter((t) => t.score === max);
}
export function restoreGame(raw: unknown): Game | null {
  try {
    const g = raw as Game;
    if (
      g.version !== 1 ||
      !["it", "en", "es", "de", "fr"].includes(g.language) ||
      ![
        "preparation",
        "countdown",
        "active",
        "paused",
        "review",
        "finished",
      ].includes(g.phase) ||
      !Array.isArray(g.pool) ||
      !g.pool.length ||
      g.pool.some(
        (w) =>
          !w ||
          typeof w.id !== "string" ||
          typeof w.text !== "string" ||
          !w.text ||
          typeof w.category !== "string" ||
          typeof w.clue !== "string",
      ) ||
      !g.current ||
      !g.pool.some((w) => w.id === g.current.id) ||
      !Array.isArray(g.teams) ||
      g.teams.length < 1 ||
      g.teams.length > 4 ||
      g.teams.some(
        (t) => typeof t.name !== "string" || !Number.isFinite(t.score),
      ) ||
      !Array.isArray(g.queue) ||
      g.queue.length !== g.pool.length ||
      new Set(g.queue).size !== g.pool.length ||
      g.queue.some(
        (i) => !Number.isInteger(i) || i < 0 || i >= g.pool.length,
      ) ||
      !Number.isInteger(g.cursor) ||
      g.cursor < 0 ||
      g.cursor >= g.queue.length ||
      !Number.isInteger(g.turn) ||
      g.turn < 0 ||
      !Number.isFinite(g.remainingMs) ||
      !Number.isFinite(g.serial) ||
      !Array.isArray(g.entries) ||
      !Array.isArray(g.history)
    )
      return null;
    const settings = normalizeSettings(g.settings);
    if (
      g.pool[g.queue[g.cursor]!]!.id !== g.current.id ||
      g.turn >
        g.teams.length * (settings.mode === "quick" ? 1 : settings.rounds)
    )
      return null;
    const validEntry = (e: Entry) =>
      e &&
      ["correct", "skip", "open"].includes(e.outcome) &&
      e.word &&
      typeof e.word.text === "string";
    if (
      !g.entries.every(validEntry) ||
      !g.history.every(
        (t) => Array.isArray(t.entries) && t.entries.every(validEntry),
      )
    )
      return null;
    return {
      ...g,
      settings,
      current: g.pool[g.queue[g.cursor]!]!,
      phase: ["active", "countdown"].includes(g.phase) ? "paused" : g.phase,
      deadline: null,
      countdownEnd: null,
      lockUntil: 0,
      remainingMs: Math.max(
        0,
        Math.min(settings.seconds * 1000, g.remainingMs),
      ),
    };
  } catch {
    return null;
  }
}
