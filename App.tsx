import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import { StatusBar } from "expo-status-bar";
import * as Orientation from "expo-screen-orientation";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Globe,
  ExternalLink,
  Home as HomeIcon,
  Layers3,
  Play,
  Settings2,
  ScanFace,
  X,
} from "lucide-react-native";
import { LanguageProvider, useI18n, LANGUAGES } from "./src/i18n/context";
import {
  Button,
  Entrance,
  Heading,
  IconButton,
  Label,
  Panel,
  Txt,
} from "./src/components/UI";
import { C, FONT } from "./src/theme";
import { APP_VERSION } from "./src/version";
import { LanguageFlag } from "./src/components/LanguageFlag";
import { Decks, Home, Rules, Setup, Toggle } from "./src/screens/Menu";
import { Match } from "./src/screens/Match";
import { CustomDeck, customWords } from "./src/data/custom";
import { categories, categoryWords } from "./src/data/catalog";
import * as E from "./src/game/engine";
import * as Storage from "./src/storage";
import { useFeedback } from "./src/hooks/useFeedback";
type Screen =
  "home" | "decks" | "setup" | "rules" | "settings" | "languages" | "match";
export default function App() {
  const [fonts, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_900Black,
  });
  if (!fonts && !error)
    return (
      <View
        style={{ flex: 1, backgroundColor: C.bg, justifyContent: "center" }}
      >
        <ActivityIndicator color={C.text} />
      </View>
    );
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Main />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
function Main() {
  const { language, setLanguage, t, languageStorageError } = useI18n();
  const { width } = useWindowDimensions();
  const compactHeader = width < 360;
  const brandFontSize = width < 400 ? 19 : 25;
  const [screen, setScreen] = useState<Screen>("home");
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState(E.DEFAULTS);
  const [game, setGameState] = useState<E.Game | null>(null);
  const [decks, setDecks] = useState<CustomDeck[]>([]);
  const [now, setNow] = useState(Date.now());
  const [storageError, setStorageError] = useState(false);
  const ref = useRef<E.Game | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const decksRef = useRef(decks);
  decksRef.current = decks;
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const feedback = useFeedback(settings);
  const fx = useRef(feedback);
  fx.current = feedback;
  const setGame = useCallback((g: E.Game | null) => {
    ref.current = g;
    setGameState(g);
  }, []);
  const persist = useCallback(() => {
    void Storage.save(settingsRef.current, ref.current, decksRef.current)
      .then(() => setStorageError(false))
      .catch(() => setStorageError(true));
  }, []);
  useEffect(() => {
    let alive = true;
    void Storage.load().then((x) => {
      if (alive) {
        setSettings(x.settings);
        setDecks(x.decks);
        setGame(x.game);
        setLoaded(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (loaded) persist();
  }, [settings, game, decks, loaded, persist, language]);
  useEffect(() => {
    const timer = setInterval(() => {
      const time = Date.now();
      const g = ref.current;
      if (
        screenRef.current === "match" &&
        g &&
        ["active", "countdown"].includes(g.phase)
      )
        setNow(time);
      if (g) {
        const next = E.tick(g, time);
        if (next !== g) {
          if (next.phase === "review") fx.current("finish");
          if (next.phase === "active") fx.current("tick");
          setGame(next);
        }
      }
    }, 80);
    const checkpoint = setInterval(() => {
      if (ref.current?.phase === "active") persist();
    }, 2000);
    return () => {
      clearInterval(timer);
      clearInterval(checkpoint);
    };
  }, []);
  const pause = useCallback(() => {
    const g = ref.current;
    if (g) setGame(E.pause(g, Date.now()));
  }, []);
  const go = useCallback(
    (s: Screen) => {
      if (s !== "match") pause();
      setScreen(s);
    },
    [pause],
  );
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        pause();
        persist();
      }
    });
    if (Platform.OS === "web") {
      const hidden = () => {
        if (document.hidden) {
          pause();
          persist();
        }
      };
      const blur = () => {
        pause();
        persist();
      };
      document.addEventListener("visibilitychange", hidden);
      window.addEventListener("blur", blur);
      return () => {
        sub.remove();
        document.removeEventListener("visibilitychange", hidden);
        window.removeEventListener("blur", blur);
      };
    }
    return () => sub.remove();
  }, []);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screenRef.current === "home") return false;
      if (
        screenRef.current === "match" &&
        ["active", "countdown"].includes(ref.current?.phase ?? "")
      ) {
        pause();
        return true;
      }
      go("home");
      return true;
    });
    return () => sub.remove();
  }, []);
  const landscape =
    screen === "match" &&
    !!game &&
    ["preparation", "countdown", "active", "paused"].includes(game.phase);
  const orientationQueue = useRef(Promise.resolve());
  useEffect(() => {
    if (Platform.OS === "web") return;
    orientationQueue.current = orientationQueue.current
      .catch(() => {})
      .then(() =>
        Orientation.lockAsync(
          landscape
            ? Orientation.OrientationLock.LANDSCAPE
            : Orientation.OrientationLock.PORTRAIT_UP,
        ),
      )
      .catch(() => {});
  }, [landscape]);
  const keepAwake =
    screen === "match" && ["active", "countdown"].includes(game?.phase ?? "");
  const wakeQueue = useRef(Promise.resolve());
  useEffect(() => {
    wakeQueue.current = wakeQueue.current
      .catch(() => {})
      .then(() =>
        keepAwake
          ? activateKeepAwakeAsync("open-guess-turn")
          : deactivateKeepAwake("open-guess-turn"),
      )
      .catch(() => {});
  }, [keepAwake]);
  const answer = useCallback((o: "correct" | "skip") => {
    const g = ref.current;
    if (!g) return;
    const next = E.answer(g, o, Date.now(), g.serial);
    if (next !== g) {
      setGame(next);
      if (next.entries.length > g.entries.length)
        fx.current(o === "correct" ? "correct" : "skip");
    }
  }, []);
  const start = useCallback(() => {
    const g = ref.current;
    if (g) {
      setNow(Date.now());
      setGame(E.startCountdown(g, Date.now()));
      fx.current("tick");
    }
  }, []);
  const pool = () =>
    settings.decks.flatMap((id) => {
      const d = decks.find((d) => d.id === id && d.language === language);
      return d ? customWords(d, "Indizi liberi") : categoryWords(id, language);
    });
  const startGame = () => {
    const words = pool();
    if (!words.length) return;
    setGame(E.createGame(settings, words, language));
    setScreen("match");
  };
  const replay = () => {
    if (game) {
      setGame(E.createGame(game.settings, game.pool, game.language));
      setScreen("match");
    }
  };
  const selectedCount = pool().length;
  const saveDeck = (d: CustomDeck) =>
    setDecks((ds) => [...ds.filter((x) => x.id !== d.id), d]);
  const deleteDeck = (id: string) => {
    setDecks((ds) => ds.filter((d) => d.id !== id));
    setSettings((s) => ({ ...s, decks: s.decks.filter((x) => x !== id) }));
  };
  const changeLanguage = (l: typeof language) => {
    pause();
    setLanguage(l);
    setSettings((s) => {
      const selected = s.decks.filter(
        (id) =>
          categories(l).some((c) => c.id === id) ||
          decks.some((d) => d.id === id && d.language === l),
      );
      return { ...s, decks: selected.length ? selected : ["animals"] };
    });
    go("home");
  };
  if (!loaded)
    return (
      <View
        style={{ flex: 1, backgroundColor: C.bg, justifyContent: "center" }}
      >
        <ActivityIndicator color={C.text} />
      </View>
    );
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.bg }}
      edges={
        landscape
          ? ["left", "right", "top", "bottom"]
          : ["top", "left", "right"]
      }
    >
      <StatusBar style="dark" hidden={landscape} />
      {screen === "match" && game ? (
        <Match
          game={game}
          now={now}
          onStart={start}
          onPause={pause}
          onAnswer={answer}
          onEnd={() => setGame(E.endTurn(ref.current!))}
          onCommit={() => {
            setGame(E.commit(ref.current!));
          }}
          onEdit={(i, o) => setGame(E.edit(ref.current!, i, o))}
          onHome={() => go("home")}
          onReplay={replay}
          onSound={() => setSettings((s) => ({ ...s, sound: !s.sound }))}
          sound={settings.sound}
        />
      ) : (
        <>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: C.line,
              paddingVertical: 14,
              paddingHorizontal: compactHeader ? 12 : 20,
            }}
          >
            <View
              style={{
                maxWidth: 1100,
                width: "100%",
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: compactHeader ? 8 : 10,
              }}
            >
              {screen !== "home" && (
                <IconButton
                  icon={ArrowLeft}
                  label={t("Torna alla home")}
                  onPress={() => go("home")}
                />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open GuessUp by Gleetch, home"
                onPress={() => go("home")}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: C.yellow,
                    paddingHorizontal: 11,
                    paddingVertical: 7,
                    borderRadius: 14,
                    transform: [{ rotate: "-5deg" }],
                  }}
                >
                  <ScanFace color={C.ink} size={27} strokeWidth={2.4} />
                </View>
                <View style={{ flexShrink: 1, minWidth: 0 }}>
                  <Txt
                    style={{
                      fontFamily: FONT.semibold,
                      fontSize: 9,
                      letterSpacing: 3.5,
                      lineHeight: 13,
                    }}
                  >
                    OPEN
                  </Txt>
                  <Txt
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontFamily: FONT.black,
                      fontSize: brandFontSize,
                      lineHeight: 26,
                      letterSpacing: -0.8,
                    }}
                  >
                    GuessUp
                  </Txt>
                  <Txt
                    style={{
                      fontFamily: FONT.medium,
                      fontSize: 10,
                      lineHeight: 12,
                      letterSpacing: 0.5,
                      color: C.muted,
                      marginTop: 2,
                    }}
                  >
                    by Gleetch
                  </Txt>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("Lingua")}
                accessibilityValue={{
                  text: LANGUAGES.find((item) => item.id === language)!.name,
                }}
                onPress={() => go("languages")}
                style={{
                  backgroundColor: C.panel,
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: C.line,
                  borderRadius: 14,
                }}
              >
                <LanguageFlag language={language} size={24} />
              </Pressable>
              <IconButton
                icon={Settings2}
                label={t("Impostazioni")}
                onPress={() => go("settings")}
              />
            </View>
          </View>
          {(storageError || languageStorageError) && (
            <Txt
              accessibilityRole="alert"
              style={{ padding: 10, color: C.text, fontSize: 12 }}
            >
              {t(
                "Archiviazione non disponibile: mantieni aperta l’app per conservare la partita.",
              )}
            </Txt>
          )}
          <ScrollView
            key={screen}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 22, paddingBottom: 36 }}
          >
            <View
              style={{ width: "100%", maxWidth: 1100, alignSelf: "center" }}
            >
              <Entrance key={screen}>
                {screen === "home" && (
                  <Home
                    game={game}
                    onStart={(mode) => {
                      if (mode) setSettings((s) => ({ ...s, mode }));
                      go("setup");
                    }}
                    onResume={() => go("match")}
                    onDecks={() => go("decks")}
                    onRules={() => go("rules")}
                  />
                )}{" "}
                {screen === "decks" && (
                  <Decks
                    settings={settings}
                    onChange={setSettings}
                    decks={decks}
                    onSave={saveDeck}
                    onDelete={deleteDeck}
                    onNext={() => go("setup")}
                  />
                )}{" "}
                {screen === "setup" && (
                  <Setup
                    settings={settings}
                    onChange={setSettings}
                    onStart={startGame}
                    onDecks={() => go("decks")}
                    count={selectedCount}
                  />
                )}{" "}
                {screen === "rules" && <Rules onStart={() => go("setup")} />}{" "}
                {screen === "languages" && (
                  <View>
                    <Heading title={t("Lingua")} />
                    <View style={{ gap: 12 }}>
                      {LANGUAGES.map((l) => (
                        <Button
                          key={l.id}
                          title={l.name}
                          leading={<LanguageFlag language={l.id} size={28} />}
                          icon={l.id === language ? Check : null}
                          style={{ justifyContent: "flex-start" }}
                          color={l.id === language ? C.primary : C.green}
                          secondary={l.id !== language}
                          onPress={() => changeLanguage(l.id)}
                        />
                      ))}
                    </View>
                  </View>
                )}{" "}
                {screen === "settings" && (
                  <View style={{ maxWidth: 650, width: "100%", gap: 20 }}>
                    <Heading title={t("Impostazioni")} />
                    <Panel>
                      <Toggle
                        title={t("Effetti sonori")}
                        value={settings.sound}
                        onChange={(v) =>
                          setSettings((s) => ({ ...s, sound: v }))
                        }
                      />
                      <Toggle
                        title={t("Vibrazione")}
                        value={settings.haptics}
                        onChange={(v) =>
                          setSettings((s) => ({ ...s, haptics: v }))
                        }
                      />
                      {Platform.OS !== "web" ? (
                        <Toggle
                          title={t("Inclinazione")}
                          value={settings.sensors}
                          onChange={(v) =>
                            setSettings((s) => ({ ...s, sensors: v }))
                          }
                        />
                      ) : (
                        <Txt
                          style={{
                            color: C.muted,
                            fontSize: 13,
                            lineHeight: 20,
                          }}
                        >
                          {t(
                            "Il sensore è disponibile nell’app Android. Nel browser usa i comandi manuali.",
                          )}
                        </Txt>
                      )}
                      <Button
                        title={t("Lingua")}
                        secondary
                        icon={Globe}
                        onPress={() => go("languages")}
                      />
                      <Button
                        title={t("Codice sorgente su GitHub")}
                        secondary
                        icon={ExternalLink}
                        onPress={() => {
                          void Linking.openURL(
                            "https://github.com/PaoloConteDev/OpenGuessUp",
                          ).catch(() =>
                            Alert.alert(
                              t("Impossibile aprire il link."),
                              "https://github.com/PaoloConteDev/OpenGuessUp",
                            ),
                          );
                        }}
                      />
                    </Panel>
                    <Txt
                      style={{
                        color: C.muted,
                        textAlign: "center",
                        lineHeight: 24,
                      }}
                    >
                      {t(
                        "Versione {{0}} · Fatto per stare insieme.",
                        APP_VERSION,
                      )}
                      {"\n"}Open GuessUp · Gleetch{"\n"}
                      {t("Zero pubblicità")} · 100% offline
                    </Txt>
                  </View>
                )}
              </Entrance>
            </View>
          </ScrollView>
          <View
            style={{
              borderWidth: 1,
              borderColor: C.line,
              flexDirection: "row",
              justifyContent: "space-evenly",
              backgroundColor: C.panel,
              borderRadius: 24,
              marginHorizontal: 16,
              marginBottom: Platform.OS === "android" ? 20 : 12,
              padding: 7,
              gap: 4,
            }}
          >
            {[
              [Play, "Nuova partita", "setup"],
              [Layers3, "Categorie", "decks"],
              [BookOpen, "Come si gioca", "rules"],
            ].map(([I, label, to], i) => {
              const Icon = I as typeof Play;
              const active = screen === to;
              return (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={t(label as string)}
                  onPress={() => go(to as Screen)}
                  style={{
                    alignItems: "center",
                    gap: 5,
                    flex: 1,
                    minWidth: 0,
                    paddingVertical: 9,
                    borderRadius: 17,
                    backgroundColor:
                      active || (screen === "home" && to === "setup")
                        ? C.green
                        : "transparent",
                  }}
                >
                  <Icon
                    size={20}
                    color={
                      active || (screen === "home" && to === "setup")
                        ? C.ink
                        : C.muted
                    }
                  />
                  <Txt
                    style={{
                      fontSize: 10,
                      fontFamily: FONT.medium,
                      color:
                        active || (screen === "home" && to === "setup")
                          ? C.ink
                          : C.muted,
                    }}
                  >
                    {t(label as string)}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
