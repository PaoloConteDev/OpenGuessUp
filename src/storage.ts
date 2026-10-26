import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Game,
  Settings,
  normalizeSettings,
  restoreGame,
  remaining,
} from "./game/engine";
import { CustomDeck, validDeck } from "./data/custom";
const KEY = "@open-guess/state-v1";
let writes = Promise.resolve();
export function decode(raw: string | null) {
  try {
    const x = JSON.parse(raw ?? "{}");
    return {
      settings: normalizeSettings(x.settings),
      game: restoreGame(x.game),
      decks: Array.isArray(x.decks)
        ? (x.decks.filter(validDeck) as CustomDeck[])
        : [],
    };
  } catch {
    return {
      settings: normalizeSettings(),
      game: null,
      decks: [] as CustomDeck[],
    };
  }
}
export async function load() {
  try {
    return decode(await AsyncStorage.getItem(KEY));
  } catch {
    return decode(null);
  }
}
export function save(
  settings: Settings,
  game: Game | null,
  decks: CustomDeck[],
) {
  const snapshot = game
    ? { ...game, remainingMs: remaining(game, Date.now()) }
    : null;
  const raw = JSON.stringify({ settings, game: snapshot, decks });
  writes = writes.catch(() => {}).then(() => AsyncStorage.setItem(KEY, raw));
  return writes;
}
