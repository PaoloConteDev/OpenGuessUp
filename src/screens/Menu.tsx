import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  View,
  useWindowDimensions,
} from "react-native";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Check,
  Compass,
  Drama,
  Layers3,
  Lamp,
  Leaf,
  Lightbulb,
  Music,
  PawPrint,
  Pencil,
  Plane,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Trash2,
  Trophy,
  Users,
  Utensils,
  WandSparkles,
  WifiOff,
  X,
  Zap,
} from "lucide-react-native";
import {
  Button,
  Choices,
  Field,
  Heading,
  IconButton,
  Label,
  Panel,
  Pill,
  Txt,
  s,
} from "../components/UI";
import { HeroArt } from "../components/HeroArt";
import { C, FONT, accentInk } from "../theme";
import { APP_VERSION } from "../version";
import { LANGUAGES, useI18n } from "../i18n/context";
import { categories } from "../data/catalog";
import { CustomDeck, parseWords, validDeck } from "../data/custom";
import type { Game, Settings } from "../game/engine";
import { Platform } from "react-native";
export const icons: Record<string, typeof PawPrint> = {
  PawPrint,
  Utensils,
  Lamp,
  Compass,
  Leaf,
  Lightbulb,
  Trophy,
  Music,
  Drama,
  Briefcase,
  WandSparkles,
  Smile,
  Plane,
  Layers3,
};
export function Home({
  game,
  onStart,
  onResume,
  onDecks,
  onRules,
}: {
  game: Game | null;
  onStart: (mode?: Settings["mode"]) => void;
  onResume: () => void;
  onDecks: () => void;
  onRules: () => void;
}) {
  const { t } = useI18n();
  const mobile = useWindowDimensions().width < 760;
  return (
    <View style={{ gap: 32 }}>
      <View
        style={{
          flexDirection: mobile ? "column" : "row",
          alignItems: "center",
          gap: mobile ? 8 : 30,
          paddingTop: mobile ? 18 : 38,
        }}
      >
        <View
          style={{
            flex: mobile ? undefined : 1,
            width: mobile ? "100%" : undefined,
          }}
        >
          <Pill>{t("SULLA FRONTE. NELLA FESTA.")}</Pill>
          <Txt
            accessibilityRole="header"
            style={{
              fontFamily: FONT.black,
              fontSize: mobile ? 49 : 67,
              lineHeight: mobile ? 51 : 69,
              letterSpacing: -2,
              marginTop: 23,
            }}
          >
            {t("Tu non vedi.")}
            <Txt
              style={{
                fontFamily: FONT.black,
                fontSize: mobile ? 49 : 67,
                lineHeight: mobile ? 51 : 69,
                color: C.accent,
              }}
            >
              {"\n"}
              {t("Loro ridono.")}
            </Txt>
          </Txt>
          <Txt
            style={{
              color: C.muted,
              lineHeight: 25,
              fontSize: 17,
              marginTop: 19,
              maxWidth: 430,
            }}
          >
            {t(
              "Un telefono sulla fronte, gli amici davanti. Indovina la parola prima che finiscano il fiato. O il tempo.",
            )}
          </Txt>
          <View
            style={{
              marginTop: 26,
              gap: 12,
              alignSelf: mobile ? "stretch" : "flex-start",
            }}
          >
            <Button
              title={t("Nuova partita")}
              color={C.yellow}
              icon={Play}
              onPress={() => onStart()}
            />
            {game && game.phase !== "finished" && (
              <Button
                secondary
                title={t("Riprendi la partita")}
                icon={Play}
                onPress={onResume}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 18,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            {[
              [WifiOff, "100% offline"],
              [Users, t("Un solo telefono")],
            ].map(([I, title], i) => {
              const Icon = I as typeof WifiOff;
              return (
                <View
                  key={i}
                  style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
                >
                  <Icon size={14} color={C.muted} />
                  <Txt style={{ fontSize: 12, color: C.muted }}>
                    {title as string}
                  </Txt>
                </View>
              );
            })}
          </View>
        </View>
        <View
          style={{
            flex: mobile ? undefined : 1,
            width: mobile ? "100%" : undefined,
            marginTop: mobile ? 12 : 0,
          }}
        >
          <HeroArt />
        </View>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: C.line,
          paddingVertical: 20,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "space-between",
        }}
      >
        {[
          [
            Layers3,
            t("12 categorie · 5 lingue"),
            t("Tutte incluse. Anche le tue."),
          ],
          [ShieldCheck, t("Zero pubblicità"), "100% offline"],
        ].map(([I, title, sub], i) => {
          const Icon = I as typeof WifiOff;
          return (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              <View
                style={{
                  backgroundColor: C.panelLight,
                  padding: 11,
                  borderRadius: 13,
                }}
              >
                <Icon size={21} color={C.accent} />
              </View>
              <View>
                <Txt style={{ fontFamily: FONT.bold, fontSize: 14 }}>
                  {title as string}
                </Txt>
                <Txt style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                  {sub as string}
                </Txt>
              </View>
            </View>
          );
        })}
      </View>
      <View>
        <Label>{t("La festa è nelle tue mani.")}</Label>
        <Txt
          style={{
            fontFamily: FONT.bold,
            fontSize: 27,
            marginTop: 7,
            marginBottom: 20,
          }}
        >
          {t("Scegli il tuo caos.")}
        </Txt>
        <View style={{ flexDirection: mobile ? "column" : "row", gap: 16 }}>
          {[
            [Zap, "Rapida", "Un turno, tutti contro il timer.", C.yellow],
            [
              Users,
              "A squadre",
              "2–4 squadre. Una fronte alla volta.",
              C.green,
            ],
          ].map(([I, title, sub, color], i) => {
            const Icon = I as typeof Users;
            return (
              <Pressable
                accessibilityRole="button"
                key={i}
                onPress={() => onStart(i === 0 ? "quick" : "teams")}
                style={({ pressed }) => ({
                  flex: 1,
                  padding: 22,
                  borderWidth: 1,
                  borderColor: C.line,
                  borderRadius: 23,
                  backgroundColor: pressed ? C.panelLight : C.panel,
                  gap: 13,
                })}
              >
                <Icon color={accentInk(color as string)} size={25} />
                <Txt style={{ fontFamily: FONT.bold, fontSize: 23 }}>
                  {t(title as string)}
                </Txt>
                <Txt style={{ color: C.muted, fontSize: 14, lineHeight: 22 }}>
                  {t(sub as string)}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onDecks}
        style={({ pressed }) => ({
          padding: 25,
          borderRadius: 24,
          backgroundColor: pressed ? C.discoveryPressed : C.discovery,
          borderWidth: 1,
          borderColor: C.ink + "20",
          gap: 10,
        })}
      >
        <Label color={C.text}>{t("Mima. Descrivi. Canta. Imita.")}</Label>
        <Txt style={{ fontSize: 28, fontFamily: FONT.bold }}>
          {t("La tua prossima ossessione?")}
        </Txt>
        <Txt style={{ color: C.text }}>{t("Categorie")} →</Txt>
        <View style={{ flexDirection: "row", gap: 13, marginTop: 12 }}>
          {[PawPrint, Music, Drama, Compass].map((Icon, i) => (
            <View
              key={i}
              style={{
                backgroundColor: [C.green, C.yellow, C.red, C.blue][i],
                padding: 13,
                borderRadius: 14,
                transform: [{ rotate: `${i % 2 ? 8 : -8}deg` }],
              }}
            >
              <Icon color={C.ink} size={26} />
            </View>
          ))}
        </View>
      </Pressable>
      <Button
        title={t("Come si gioca")}
        secondary
        icon={Sparkles}
        onPress={onRules}
      />
      <Txt
        style={{
          fontSize: 12,
          textAlign: "center",
          color: C.muted,
          paddingBottom: 12,
        }}
      >
        {t("Versione {{0}} · Fatto per stare insieme.", APP_VERSION)}
      </Txt>
    </View>
  );
}
export function Decks({
  settings,
  onChange,
  decks,
  onSave,
  onDelete,
  onNext,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
  decks: CustomDeck[];
  onSave: (d: CustomDeck) => void;
  onDelete: (id: string) => void;
  onNext: () => void;
}) {
  const { language, t } = useI18n();
  const width = useWindowDimensions().width;
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CustomDeck | "new" | null>(null);
  const catalog = [
    ...categories(language),
    ...decks
      .filter((d) => d.language === language)
      .map((d) => ({
        id: d.id,
        name: d.name,
        description: t("Mazzo personalizzato"),
        color: d.color,
        count: d.words.length,
        clue: "Indizi liberi",
        icon: "Layers3",
        custom: true,
      })),
  ];
  const selected = catalog.filter(
    (c) => settings.decks.includes(c.id) && c.count > 0,
  );
  const toggle = (id: string) =>
    onChange({
      ...settings,
      decks: settings.decks.includes(id)
        ? settings.decks.filter((x) => x !== id)
        : [...settings.decks, id],
    });
  return (
    <View>
      <Heading
        eyebrow={t("Mima. Descrivi. Canta. Imita.")}
        title={t("Scegli il tuo caos.")}
        sub={t(
          "Parole, scene e situazioni da far indovinare. Mescola le categorie e segui il tipo di indizio sulla carta.",
        )}
      />
      <Field
        label={t("Cerca una categoria")}
        value={query}
        onChangeText={setQuery}
        placeholder={t("Cerca una categoria")}
      />
      {[false, true].map((custom) => (
        <View key={String(custom)} style={{ marginTop: 28, gap: 16 }}>
          <Txt
            accessibilityRole="header"
            style={{ fontFamily: FONT.bold, fontSize: 23 }}
          >
            {t(custom ? "Mazzi personalizzati" : "Mazzi inclusi")}
          </Txt>
          {custom && (
            <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>
              {t(
                "I mazzi personalizzati compaiono solo nella lingua in cui li crei. Puoi mescolarli con gli altri mazzi.",
              )}
            </Txt>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
            {catalog
              .filter(
                (c) =>
                  c.custom === custom &&
                  `${c.name} ${c.description} ${t(c.clue)}`
                    .toLocaleLowerCase(language)
                    .includes(query.toLocaleLowerCase(language)),
              )
              .map((cat) => {
                const Icon = icons[cat.icon] ?? Layers3;
                const checked =
                  settings.decks.includes(cat.id) && cat.count > 0;
                return (
                  <View
                    key={cat.id}
                    style={{
                      width:
                        width < 520 ? "100%" : width < 950 ? "48%" : "31.9%",
                      flexGrow: 1,
                      minWidth: 230,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: checked ? accentInk(cat.color) : C.line,
                      backgroundColor: C.panel,
                      overflow: "hidden",
                    }}
                  >
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityLabel={cat.name}
                      accessibilityState={{ checked, disabled: !cat.count }}
                      disabled={!cat.count}
                      onPress={() => toggle(cat.id)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                    >
                      <View
                        style={{
                          height: 90,
                          backgroundColor: cat.color + "30",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          paddingLeft: 19,
                          borderBottomWidth: 1,
                          borderBottomColor: cat.color + "25",
                        }}
                      >
                        <View
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: 18,
                            backgroundColor: cat.color,
                            justifyContent: "center",
                            alignItems: "center",
                            transform: [{ rotate: "-4deg" }],
                          }}
                        >
                          <Icon
                            size={28}
                            strokeWidth={1.8}
                            color={accentInk(cat.color)}
                          />
                        </View>
                        <View
                          style={{
                            position: "absolute",
                            right: 16,
                            top: 31,
                            width: 24,
                            height: 24,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: checked
                              ? accentInk(cat.color)
                              : C.line,
                            backgroundColor: checked
                              ? cat.color
                              : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {checked && <Check size={18} color={C.ink} />}
                        </View>
                      </View>
                      <View style={{ padding: 19, gap: 9 }}>
                        <Txt style={{ fontFamily: FONT.bold, fontSize: 22 }}>
                          {cat.name}
                        </Txt>
                        <Txt
                          style={{
                            fontSize: 13,
                            color: C.muted,
                            lineHeight: 20,
                            minHeight: 40,
                          }}
                        >
                          {cat.description}
                        </Txt>
                        <Txt
                          style={{
                            color: accentInk(cat.color),
                            fontFamily: FONT.semibold,
                            fontSize: 12,
                          }}
                        >
                          {cat.count} {t("parole")} · {t(cat.clue)}
                        </Txt>
                        {!cat.count && (
                          <Txt style={{ color: C.danger, fontSize: 12 }}>
                            {t("Mazzo vuoto · aggiungi parole per giocare")}
                          </Txt>
                        )}
                      </View>
                    </Pressable>
                    {custom && (
                      <View style={{ padding: 14, paddingTop: 0 }}>
                        <Button
                          secondary
                          title={t("Modifica mazzo")}
                          icon={Pencil}
                          onPress={() =>
                            setEditing(decks.find((d) => d.id === cat.id)!)
                          }
                        />
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
          {custom && (
            <Button
              title={t("Crea un mazzo")}
              secondary
              icon={Plus}
              onPress={() => setEditing("new")}
            />
          )}
        </View>
      ))}
      {!catalog.some((c) =>
        c.name
          .toLocaleLowerCase(language)
          .includes(query.toLocaleLowerCase(language)),
      ) &&
        query && (
          <Txt style={{ marginTop: 20, color: C.muted }}>
            {t("Nessun risultato")}
          </Txt>
        )}
      <Panel style={{ marginTop: 24 }}>
        <Txt style={{ color: C.muted }}>
          {selected.length} {t("selezionate")} ·{" "}
          {selected.reduce((n, c) => n + c.count, 0)} {t("parole")}
        </Txt>
        <Button
          title={t("Gioca con questi mazzi")}
          disabled={!selected.length}
          onPress={onNext}
        />
      </Panel>
      {editing && (
        <DeckEditor
          deck={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            onSave(d);
            setEditing(null);
          }}
          onDelete={(id) => {
            onDelete(id);
            setEditing(null);
          }}
        />
      )}
    </View>
  );
}
function DeckEditor({
  deck,
  onSave,
  onDelete,
  onClose,
}: {
  deck?: CustomDeck;
  onSave: (d: CustomDeck) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const { t, language } = useI18n();
  const [name, setName] = useState(deck?.name ?? "");
  const [color, setColor] = useState(deck?.color ?? C.red);
  const [text, setText] = useState(
    deck?.words.map((w) => w.text).join("\n") ?? "",
  );
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const count = parseWords(text, deck?.words).length;
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#26344AE8",
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            maxWidth: 600,
            width: "100%",
            maxHeight: "94%",
            backgroundColor: C.panel,
            borderWidth: 1,
            borderColor: C.line,
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Txt style={{ fontFamily: FONT.bold, fontSize: 24 }}>
              {t(deck ? "Modifica mazzo" : "Crea un mazzo")}
            </Txt>
            <IconButton
              icon={X}
              label={t("Chiudi finestra")}
              onPress={onClose}
            />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 20 }}
          >
            <Txt style={{ color: C.muted, fontSize: 13 }}>
              {
                LANGUAGES.find((l) => l.id === (deck?.language ?? language))!
                  .name
              }
            </Txt>
            <Field
              label={t("Nome del mazzo")}
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
            <Label>{t("Colore del mazzo")}</Label>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {[C.red, C.yellow, C.green, C.blue].map((c, i) => (
                <Pressable
                  key={c}
                  accessibilityRole="radio"
                  accessibilityLabel={t("Colore {{0}}", i + 1)}
                  accessibilityState={{ checked: c === color }}
                  onPress={() => setColor(c)}
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: c,
                    borderRadius: 13,
                    borderWidth: 3,
                    borderColor: c === color ? C.text : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {c === color && <Check size={23} color={C.ink} />}
                </Pressable>
              ))}
            </View>
            <Txt style={{ color: C.muted, fontSize: 14, lineHeight: 22 }}>
              {t(
                "Una voce per riga. Spazi e doppioni vengono sistemati automaticamente.",
              )}
            </Txt>
            <Field
              label={t("Parole ed espressioni")}
              value={text}
              onChangeText={setText}
              multiline
              style={{ minHeight: 220, textAlignVertical: "top" }}
            />
            <Txt style={{ color: C.muted }}>
              {count} {t("parole")}
            </Txt>
            {error && (
              <Txt accessibilityRole="alert" style={{ color: C.danger }}>
                {t(
                  "Nome obbligatorio · massimo 100 caratteri per voce, 3000 voci.",
                )}
              </Txt>
            )}
            <Button
              title={t("Salva mazzo")}
              icon={Check}
              onPress={() => {
                const d = {
                  id:
                    deck?.id ??
                    `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                  name: name.trim(),
                  color,
                  language: deck?.language ?? language,
                  words: parseWords(text, deck?.words),
                };
                if (validDeck(d)) onSave(d);
                else setError(true);
              }}
            />
            {deck && (
              <Button
                title={t(deleting ? "Conferma eliminazione" : "Elimina mazzo")}
                secondary
                icon={Trash2}
                onPress={() =>
                  deleting ? onDelete(deck.id) : setDeleting(true)
                }
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function Toggle({
  title,
  sub,
  value,
  onChange,
}: {
  title: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Txt style={{ fontFamily: FONT.medium }}>{title}</Txt>
        {sub && (
          <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>
            {sub}
          </Txt>
        )}
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.line, true: C.green }}
        thumbColor={value ? C.text : C.muted}
      />
    </View>
  );
}
export function Setup({
  settings,
  onChange,
  onStart,
  onDecks,
  count,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
  onStart: () => void;
  onDecks: () => void;
  count: number;
}) {
  const { t } = useI18n();
  const update = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    onChange({ ...settings, [k]: v });
  const wide = useWindowDimensions().width > 850;
  return (
    <View>
      <Heading
        title={t("La vostra partita. Il vostro delirio.")}
        sub={t("Risposta corretta: +1 · parola aperta: 0")}
      />
      <View
        style={{
          flexDirection: wide ? "row" : "column",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1, gap: 20, width: wide ? undefined : "100%" }}>
          <Panel>
            <Choices
              label={t("Modalità")}
              items={[
                { value: "quick", label: t("Rapida") },
                { value: "teams", label: t("A squadre") },
              ]}
              value={settings.mode}
              onChange={(v) => update("mode", v as Settings["mode"])}
            />
            {settings.mode === "teams" && (
              <>
                <Choices
                  label={t("Squadre")}
                  items={[2, 3, 4].map((n) => ({ value: n, label: String(n) }))}
                  value={settings.teamCount}
                  onChange={(v) => update("teamCount", v)}
                />
                {settings.names.slice(0, settings.teamCount).map((name, i) => (
                  <Field
                    key={i}
                    label={t("Squadra {{0}}", i + 1)}
                    value={name}
                    maxLength={24}
                    onChangeText={(v) =>
                      update(
                        "names",
                        settings.names.map((n, j) => (j === i ? v : n)),
                      )
                    }
                  />
                ))}
              </>
            )}
          </Panel>
          <Panel>
            <Choices
              label={t("Durata del turno")}
              items={[30, 45, 60, 90, 120].map((n) => ({
                value: n,
                label: n + "s",
              }))}
              value={settings.seconds}
              onChange={(v) => update("seconds", v)}
            />
            {settings.mode === "teams" && (
              <Choices
                label={t("Round per squadra")}
                items={[1, 3, 5, 7].map((n) => ({
                  value: n,
                  label: String(n),
                }))}
                value={settings.rounds}
                onChange={(v) => update("rounds", v)}
              />
            )}
            <Choices
              label={t("Penalità passaggio")}
              items={[
                { value: 0, label: t("Nessuna") },
                { value: 1, label: "−1" },
              ]}
              value={settings.skipPenalty}
              onChange={(v) => update("skipPenalty", v)}
            />
            <Choices
              label={t("Passaggi per turno")}
              items={[-1, 0, 3, 5, 10].map((n) => ({
                value: n,
                label: n < 0 ? "∞" : String(n),
              }))}
              value={settings.maxSkips}
              onChange={(v) => update("maxSkips", v)}
            />
          </Panel>
        </View>
        <View
          style={{
            flex: wide ? 0.9 : 1,
            width: wide ? undefined : "100%",
            gap: 20,
          }}
        >
          <Panel>
            <Choices
              label={t("Controlli")}
              items={
                Platform.OS === "web"
                  ? [{ value: 0, label: t("Manuali") }]
                  : [
                      { value: 1, label: t("Inclinazione") },
                      { value: 0, label: t("Manuali") },
                    ]
              }
              value={Platform.OS !== "web" && settings.sensors ? 1 : 0}
              onChange={(v) => update("sensors", !!v)}
            />
            {Platform.OS === "web" && (
              <Txt style={{ color: C.muted, lineHeight: 22, fontSize: 13 }}>
                {t(
                  "Il browser usa pulsanti e tastiera: ↓ corretta, ↑ passa, spazio pausa.",
                )}
              </Txt>
            )}
            <Toggle
              title={t("Effetti sonori")}
              value={settings.sound}
              onChange={(v) => update("sound", v)}
            />
            <Toggle
              title={t("Vibrazione")}
              value={settings.haptics}
              onChange={(v) => update("haptics", v)}
            />
          </Panel>
          <Panel
            style={{ borderColor: "#F4D87555", backgroundColor: "#F4D8750D" }}
          >
            <Label color={C.primary}>{t("TUTTO PRONTO?")}</Label>
            <Txt style={{ fontFamily: FONT.bold, fontSize: 28 }}>
              {count} {t("parole")}
            </Txt>
            <Button
              secondary
              title={t("Categorie")}
              icon={Layers3}
              onPress={onDecks}
            />
            {!count && (
              <Txt style={{ color: C.danger }}>
                {t("Seleziona almeno una categoria non vuota.")}
              </Txt>
            )}
            <Button
              title={t("Andiamo!")}
              disabled={!count}
              icon={Play}
              onPress={onStart}
            />
          </Panel>
        </View>
      </View>
    </View>
  );
}
export function Rules({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  return (
    <View>
      <Heading
        title={t("Come si gioca in 4 mosse.")}
        sub={t("O meglio, sulla tua fronte.")}
      />
      <View style={{ gap: 16 }}>
        {[
          "Scegli le categorie e una partita rapida o a squadre. Ogni squadra ha un turno per round.",
          "Metti il telefono sulla fronte. Non sbirciare: gli amici vedono la parola, tu no!",
          "Segui l’indizio: descrivi senza dire la risposta, mima senza parlare, canta senza dire il titolo o imita senza fare il nome.",
          "Giù: +1. Su: passa. Ritorna al centro. Alla fine correggete gli esiti insieme e confermate. Vince chi ha più punti; il pareggio si festeggia insieme.",
        ].map((key, i) => (
          <Panel key={key}>
            <Label color={[C.red, C.yellow, C.green, C.blue][i]}>
              0{i + 1}
            </Label>
            <Txt style={{ lineHeight: 26 }}>{t(key)}</Txt>
          </Panel>
        ))}
        <Button title={t("Nuova partita")} onPress={onStart} />
      </View>
    </View>
  );
}
