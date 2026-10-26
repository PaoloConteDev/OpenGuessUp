export const C = {
  bg: "#FFF9F0",
  panel: "#FFFFFF",
  panelLight: "#E4F3EC",
  mint: "#9AD7C7",
  raspberry: "#AF2F63",
  text: "#422339",
  muted: "#6B6267",
  line: "#DDDCD2",
  rose: "#F5C3AA",
  apricot: "#FFB05A",
  peach: "#FFD4AC",
  ink: "#422339",
  cream: "#FFFFFF",
  primary: "#286554",
  onPrimary: "#FFFFFF",
  accent: "#286554",
  success: "#286554",
  danger: "#9C2854",
};
export const TEAM_COLORS = [C.text, C.raspberry, C.success, "#855023"];
export function accentInk(color: string): string {
  const tones: Record<string, string> = {
    [C.mint]: C.success,
    [C.raspberry]: C.raspberry,
    [C.peach]: C.text,
    [C.apricot]: C.text,
    [C.rose]: C.danger,
  };
  const normalized = color.toUpperCase();
  if (tones[normalized]) return tones[normalized]!;
  if (!/^#[0-9A-F]{6}$/.test(normalized)) return C.text;
  const values = normalized
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255);
  return 0.2126 * values[0]! + 0.7152 * values[1]! + 0.0722 * values[2]! > 0.5
    ? C.text
    : color;
}
export function textOn(color: string): string {
  const luminance = (value: string) => {
    const channels = value
      .replace("#", "")
      .match(/../g)
      ?.slice(0, 3)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    if (!channels || channels.length !== 3) return 0;
    return (
      0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
    );
  };
  const background = luminance(color),
    dark = luminance(C.ink),
    light = luminance(C.cream);
  return (background + 0.05) / (dark + 0.05) >=
    (light + 0.05) / (background + 0.05)
    ? C.ink
    : C.cream;
}
export const FONT = {
  regular: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  black: "Outfit_900Black",
};
