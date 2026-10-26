export const C = {
  bg: "#F7FAFF",
  panel: "#FFFFFF",
  panelLight: "#E9F2FC",
  red: "#F39A93",
  green: "#A9D7AF",
  blue: "#A4C8F0",
  yellow: "#F4D875",
  discovery: "#E1EEFC",
  discoveryPressed: "#D0E3FA",
  text: "#26344A",
  muted: "#5D6979",
  line: "#D8E1EC",
  ink: "#26344A",
  cream: "#FFFFFF",
  primary: "#285E9B",
  onPrimary: "#FFFFFF",
  accent: "#285E9B",
  success: "#286A42",
  danger: "#B63C36",
};
export const TEAM_COLORS = [C.primary, C.danger, C.success, "#755900"];
export function accentInk(color: string): string {
  const tones: Record<string, string> = {
    [C.green]: C.success,
    [C.red]: C.danger,
    [C.blue]: C.primary,
    [C.yellow]: "#755900",
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
