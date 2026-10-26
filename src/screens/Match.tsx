import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Flag,
  Home,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Smartphone,
  Trophy,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import { C, FONT, TEAM_COLORS } from "../theme";
import {
  Button,
  Choices,
  Heading,
  IconButton,
  Label,
  Panel,
  Pill,
  Txt,
} from "../components/UI";
import { useI18n } from "../i18n/context";
import {
  Game,
  Outcome,
  points,
  remaining,
  round,
  skipsLeft,
  teamIndex,
  winners,
} from "../game/engine";
import { useTilt } from "../hooks/useTilt";
import { Recording } from "../components/Recording";
export function Match({
  game,
  now,
  onStart,
  onPause,
  onAnswer,
  onEnd,
  onCommit,
  onEdit,
  onHome,
  onReplay,
  onSound,
  sound,
}: {
  game: Game;
  now: number;
  onStart: () => void;
  onPause: () => void;
  onAnswer: (o: "correct" | "skip") => void;
  onEnd: () => void;
  onCommit: () => void;
  onEdit: (i: number, o: Outcome) => void;
  onHome: () => void;
  onReplay: () => void;
  onSound: () => void;
  sound: boolean;
}) {
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const sensorRequested =
    game.settings.sensors &&
    ["preparation", "countdown", "active", "paused"].includes(game.phase);
  const feedback = game.phase === "active" && now < game.lockUntil;
  const tilt = useTilt(
    sensorRequested,
    game.phase === "active" && !feedback && landscape,
    onAnswer,
  );
  const [recordEnabled, setRecordEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(true);
  const [notice, setNotice] = useState("");
  const [manual, setManual] = useState(false);
  const phase = game.phase;
  const team = game.teams[teamIndex(game)] ?? game.teams[0]!;
  const turnScore = points(game.entries, game.settings);
  const wordSize =
    Math.min(height * 0.23, width * 0.105, 112) *
    Math.min(1, Math.sqrt(16 / Math.max(1, game.current.text.length)));
  const color = TEAM_COLORS[teamIndex(game)] ?? C.apricot;
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    a.setValue(0.95);
    Animated.timing(a, {
      toValue: 1,
      duration: 150,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [game.serial]);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handle = (e: KeyboardEvent) => {
      if (
        e.repeat ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName,
        )
      )
        return;
      if (["ArrowDown", "ArrowUp", " "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowDown") onAnswer("correct");
      if (e.key === "ArrowUp") onAnswer("skip");
      if (e.code === "Space") {
        if (game.phase === "active" || game.phase === "countdown") onPause();
        else if (game.phase === "paused") onStart();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [game.phase, onAnswer, onPause, onStart]);
  const showSensor =
    sensorRequested && Platform.OS !== "web" && tilt.available && !manual;
  const readyToStart =
    (!showSensor || tilt.calibrated) && (!recordEnabled || cameraReady);
  if (phase === "finished") {
    const win = winners(game);
    const ranked = [...game.teams].sort((a, b) => b.score - a.score);
    return (
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 50,
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%", maxWidth: 650, gap: 22, paddingTop: 30 }}>
          <View style={{ alignItems: "center", gap: 18, marginBottom: 12 }}>
            <View
              style={{
                padding: 25,
                backgroundColor: "#FFB05A14",
                borderRadius: 60,
                borderWidth: 1,
                borderColor: "#FFB05A35",
              }}
            >
              <Trophy size={55} color={C.text} />
            </View>
            <Label color={C.text}>
              {t("Partita finita. Risate infinite.")}
            </Label>
            <Txt
              accessibilityRole="header"
              style={{
                fontFamily: FONT.black,
                fontSize: 39,
                textAlign: "center",
                lineHeight: 43,
              }}
            >
              {game.settings.mode === "quick"
                ? `${game.teams[0]!.score} ${t("punti")}`
                : win.length > 1
                  ? t("Pari merito!")
                  : `${t("Vince")} ${win[0]!.name}`}
            </Txt>
            {win.length > 1 && (
              <Txt style={{ color: C.muted, textAlign: "center" }}>
                {win.map((x) => x.name).join(" · ")}
              </Txt>
            )}
          </View>
          {ranked.map((team, i) => (
            <Panel
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderColor:
                  team.score === ranked[0]!.score ? C.apricot : C.line,
              }}
            >
              <Txt
                style={{
                  fontFamily: FONT.bold,
                  color: C.accent,
                  fontSize: 24,
                  width: 30,
                }}
              >
                {ranked.findIndex((x) => x.score === team.score) + 1}
              </Txt>
              <Txt style={{ flex: 1, fontFamily: FONT.bold, fontSize: 22 }}>
                {team.name}
              </Txt>
              <Txt
                style={{
                  fontFamily: FONT.black,
                  color: C.success,
                  fontSize: 34,
                }}
              >
                {team.score}
              </Txt>
            </Panel>
          ))}
          <Button title={t("Rivincita")} icon={RotateCcw} onPress={onReplay} />
          <Button
            title={t("Torna alla home")}
            secondary
            icon={Home}
            onPress={onHome}
          />
        </View>
      </ScrollView>
    );
  }
  const stage = ["preparation", "countdown", "active", "paused"].includes(
    phase,
  );
  const content =
    phase === "review" ? (
      <View
        style={{ maxWidth: 760, width: "100%", alignSelf: "center", gap: 20 }}
      >
        <Heading
          eyebrow={team.name}
          title={t("Tempo! Come è andata?")}
          sub={t(
            "Controlla gli esiti. Tocca un risultato per correggerlo prima di confermare.",
          )}
        />
        <Panel
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View>
            <Label>{t("Punti del turno")}</Label>
            <Txt
              style={{
                fontFamily: FONT.black,
                fontSize: 42,
                color: C.success,
                marginTop: 7,
              }}
            >
              {turnScore > 0 ? "+" : ""}
              {turnScore}
            </Txt>
          </View>
          <View style={{ justifyContent: "center", gap: 8 }}>
            <Txt style={{ color: C.success }}>
              {game.entries.filter((e) => e.outcome === "correct").length}{" "}
              {t("Indovinate")}
            </Txt>
            <Txt style={{ color: C.danger }}>
              {game.entries.filter((e) => e.outcome === "skip").length}{" "}
              {t("Passate")}
            </Txt>
          </View>
        </Panel>
        {game.entries.map((entry, i) => (
          <Panel key={i} style={{ padding: 16, gap: 12 }}>
            <Txt style={{ fontFamily: FONT.bold, fontSize: 22 }}>
              {entry.word.text}
            </Txt>
            <Choices
              label={t("Parola da indovinare")}
              items={[
                { value: "correct", label: t("Indovinata") },
                { value: "skip", label: t("Passa") },
                { value: "open", label: t("Senza risposta") },
              ]}
              value={entry.outcome}
              onChange={(v) => onEdit(i, v as Outcome)}
            />
          </Panel>
        ))}
        <Button title={t("Conferma turno")} icon={Check} onPress={onCommit} />
      </View>
    ) : phase === "active" ? (
      <View
        style={{
          flex: 1,
          gap: height < 450 ? 10 : 18,
          paddingHorizontal: width < 500 ? 12 : 30,
          paddingBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
          }}
        >
          <View style={{ flex: 1, gap: 5 }}>
            <Label color={C.accent}>
              {game.current.category} · {t(game.current.clue)}
            </Label>
            <Txt style={{ fontSize: 12, color: C.muted }}>
              {team.name} · {t("Round")} {round(game)}
            </Txt>
          </View>
          <Txt
            accessibilityLabel={t("Durata del turno")}
            style={{
              fontFamily: FONT.black,
              fontSize: height < 450 ? 34 : 46,
              color: remaining(game, now) <= 10000 ? C.danger : C.text,
            }}
          >
            {Math.ceil(remaining(game, now) / 1000)}
            <Txt style={{ color: C.muted, fontSize: 16 }}>s</Txt>
          </Txt>
          <View style={{ alignItems: "center", minWidth: 48 }}>
            <Label>+1</Label>
            <Txt
              style={{ fontFamily: FONT.bold, fontSize: 29, color: C.success }}
            >
              {turnScore}
            </Txt>
          </View>
          <IconButton
            icon={sound ? Volume2 : VolumeX}
            label={t("Effetti sonori")}
            onPress={onSound}
          />
          <IconButton icon={Pause} label={t("Pausa")} onPress={onPause} />
        </View>
        <View
          style={{
            flex: 1,
            minHeight: 100,
            borderWidth: 1,
            borderColor: feedback ? "transparent" : C.line,
            borderRadius: 24,
            backgroundColor: feedback
              ? game.entries.at(-1)?.outcome === "correct"
                ? C.mint
                : C.rose
              : C.panel,
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            overflow: "hidden",
          }}
        >
          {feedback ? (
            <View style={{ alignItems: "center", gap: 4 }}>
              {game.entries.at(-1)?.outcome === "correct" ? (
                <Check size={height < 450 ? 36 : 64} color={C.ink} />
              ) : (
                <SkipForward size={height < 450 ? 36 : 64} color={C.ink} />
              )}
              <Txt
                accessibilityLiveRegion="assertive"
                style={{
                  fontFamily: FONT.black,
                  fontSize: height < 450 ? 32 : 50,
                  color: C.ink,
                }}
              >
                {t(
                  game.entries.at(-1)?.outcome === "correct"
                    ? "Indovinata"
                    : "Passa",
                )}
              </Txt>
              <Txt style={{ color: C.ink, fontSize: 13 }}>
                {t("Torna al centro")}
              </Txt>
            </View>
          ) : (
            <Animated.View style={{ width: "100%", transform: [{ scale: a }] }}>
              <Txt
                testID="current-word"
                accessibilityRole="header"
                numberOfLines={Platform.OS === "web" ? undefined : 3}
                adjustsFontSizeToFit
                minimumFontScale={0.3}
                style={{
                  fontFamily: FONT.black,
                  fontSize: wordSize,
                  lineHeight: wordSize * 1.12,
                  textAlign: "center",
                  color: C.text,
                  letterSpacing: -1,
                }}
              >
                {game.current.text.toLocaleUpperCase(game.language)}
              </Txt>
            </Animated.View>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <Button
            title={`↑ ${t("Passa")} ${skipsLeft(game) === Infinity ? "∞" : skipsLeft(game)}`}
            color={C.rose}
            icon={SkipForward}
            disabled={feedback || skipsLeft(game) === 0}
            onPress={() => onAnswer("skip")}
            style={{ flex: 1, minHeight: 48, paddingVertical: 10 }}
          />
          <Button
            title={`↓ ${t("Indovinata")} +1`}
            color={C.mint}
            icon={Check}
            disabled={feedback}
            onPress={() => onAnswer("correct")}
            style={{ flex: 1, minHeight: 48, paddingVertical: 10 }}
          />
        </View>
      </View>
    ) : phase === "countdown" ? (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Label color={C.text}>
          {t("Nessuna parola prima del via. Promesso.")}
        </Label>
        <Txt
          accessibilityLiveRegion="assertive"
          style={{
            fontFamily: FONT.black,
            fontSize: Math.min(150, height * 0.42),
            color: C.text,
          }}
        >
          {Math.max(1, Math.ceil(((game.countdownEnd ?? now) - now) / 1000))}
        </Txt>
        <Button title={t("Pausa")} secondary icon={Pause} onPress={onPause} />
      </View>
    ) : phase === "paused" ? (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 20,
        }}
      >
        <Pause size={34} color={C.text} />
        <Txt
          style={{ fontFamily: FONT.black, fontSize: 30, textAlign: "center" }}
        >
          {t("In pausa. Fiato alle idee.")}
        </Txt>
        <Txt style={{ color: C.muted, textAlign: "center" }}>
          {t("La parola è nascosta. Riprendi quando siete pronti.")} ·{" "}
          {Math.ceil(game.remainingMs / 1000)}s
        </Txt>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Button
            title={t("Riprendi il turno")}
            icon={Play}
            onPress={onStart}
          />
          <Button
            title={t("Ricalibra")}
            secondary
            icon={RotateCcw}
            onPress={() => {
              tilt.reset();
              setManual(false);
              void tilt.calibrate();
            }}
          />
          <Button
            title={t("Concludi questo turno")}
            secondary
            icon={Flag}
            onPress={onEnd}
          />
          <Button
            title={t("Esci e salva")}
            secondary
            icon={Home}
            onPress={onHome}
          />
        </View>
        {tilt.calibrating && (
          <Txt>
            {t("Mantieni il telefono fermo sulla fronte per un secondo.")}
          </Txt>
        )}
        {tilt.error && (
          <Txt style={{ color: C.danger }}>
            {t("Tieni il telefono più verticale e fermo, poi riprova.")}
          </Txt>
        )}
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 20,
          gap: 16,
          maxWidth: 900,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              padding: 18,
              borderRadius: 20,
              backgroundColor: C.panelLight,
              transform: [{ rotate: "-8deg" }],
            }}
          >
            <Smartphone
              size={40}
              color={C.text}
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Label color={color}>
              {t("Round")} {round(game)} · {t("Tocca a")} {team.name}
            </Label>
            <Txt
              style={{
                fontSize: height < 450 ? 28 : 35,
                fontFamily: FONT.black,
              }}
            >
              {t("Telefono sulla fronte.")}
            </Txt>
          </View>
        </View>
        <Txt style={{ color: C.muted, fontSize: 15, lineHeight: 22 }}>
          {t(
            "Tienilo in orizzontale, schermo verso gli amici. Giù per indovinata, su per passare. Torna dritto dopo ogni gesto.",
          )}
        </Txt>
        {showSensor ? (
          <View style={{ gap: 8 }}>
            <Button
              title={t(
                tilt.calibrated
                  ? "Posizione calibrata"
                  : "Calibra posizione neutra",
              )}
              color={tilt.calibrated ? C.mint : C.mint}
              icon={RotateCcw}
              disabled={tilt.calibrating}
              onPress={() => void tilt.calibrate()}
            />
            {tilt.calibrating && (
              <Txt style={{ color: C.muted, fontSize: 13 }}>
                {t("Mantieni il telefono fermo sulla fronte per un secondo.")}
              </Txt>
            )}
            {tilt.error && (
              <Txt style={{ color: C.danger, fontSize: 13 }}>
                {t("Tieni il telefono più verticale e fermo, poi riprova.")}
              </Txt>
            )}
            <Button
              title={t("Manuali")}
              secondary
              icon={null}
              onPress={() => setManual(true)}
            />
          </View>
        ) : (
          <Txt style={{ fontSize: 13, color: C.muted }}>
            {t(
              Platform.OS === "web"
                ? "Il browser usa pulsanti e tastiera: ↓ corretta, ↑ passa, spazio pausa."
                : sensorRequested
                  ? "Sensore non disponibile. Usa i pulsanti."
                  : "Manuali",
            )}
          </Txt>
        )}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button
            title={`${t("Andiamo!")} · ${game.settings.seconds}s`}
            icon={Play}
            disabled={!readyToStart || tilt.calibrating}
            onPress={onStart}
            style={{ flex: 1 }}
          />
          <IconButton icon={Home} label={t("Esci e salva")} onPress={onHome} />
        </View>
      </View>
    );
  const rotateWarning = stage && width < height && width < 700;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {rotateWarning && (
        <View style={{ padding: 10, backgroundColor: C.panelLight }}>
          <Txt style={{ fontSize: 13, textAlign: "center", color: C.text }}>
            {t("Ruota il dispositivo in orizzontale per giocare.")}
          </Txt>
        </View>
      )}
      {phase === "active" || phase === "countdown" || phase === "paused" ? (
        content
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: phase === "review" ? 24 : 0,
            flexGrow: 1,
          }}
        >
          {content}
        </ScrollView>
      )}
      {Platform.OS === "android" && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 8,
            maxHeight: phase === "review" ? 240 : undefined,
          }}
        >
          <ScrollView>
            <Recording
              key={game.turn}
              phase={phase}
              enabled={recordEnabled}
              onEnabled={setRecordEnabled}
              onReady={setCameraReady}
              onStatus={setNotice}
            />
          </ScrollView>
        </View>
      )}
      {notice && (
        <View style={{ padding: 10, backgroundColor: C.panelLight }}>
          <Txt
            style={{ fontSize: 12, color: C.text, textAlign: "center" }}
            onPress={() => setNotice("")}
          >
            {notice}
          </Txt>
        </View>
      )}
    </View>
  );
}
