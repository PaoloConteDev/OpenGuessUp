import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import { ArrowRight, ChevronLeft, type LucideIcon } from "lucide-react-native";
import { C, FONT, accentInk, textOn } from "../theme";
export function Txt({ style, ...p }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      {...p}
      style={[{ fontFamily: FONT.regular, fontSize: 16, color: C.text }, style]}
    />
  );
}
export function Button({
  title,
  onPress,
  color = C.primary,
  secondary = false,
  icon: Icon = ArrowRight,
  leading,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  secondary?: boolean;
  icon?: LucideIcon | null;
  leading?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const foreground = secondary ? C.text : textOn(color);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: secondary ? C.panel : color,
          borderColor: secondary ? C.line : color,
          borderWidth: 1,
          borderBottomWidth: 1,
          shadowColor: secondary ? "transparent" : color,
          shadowOpacity: pressed ? 0 : 0.12,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 5 },
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
          transform: [{ translateY: pressed ? 2 : 0 }],
        },
        style,
      ]}
    >
      {leading}
      <Txt
        style={{
          fontFamily: FONT.bold,
          color: foreground,
          fontSize: 16,
          flexShrink: 1,
          textAlign: "center",
        }}
      >
        {title}
      </Txt>
      {Icon && <Icon size={21} color={foreground} />}
    </Pressable>
  );
}
export function IconButton({
  icon: Icon,
  label,
  onPress,
  color = C.text,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        s.icon,
        { backgroundColor: pressed ? C.panelLight : C.panel },
      ]}
    >
      <Icon size={21} color={color} />
    </Pressable>
  );
}
export function Pill({
  children,
  color = C.raspberry,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color + "45",
        backgroundColor: color + "10",
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
      }}
    >
      <View
        style={{
          width: 5,
          height: 13,
          borderRadius: 2,
          backgroundColor: color,
          transform: [{ rotate: "15deg" }],
        }}
      />
      <Txt
        style={{
          fontSize: 10,
          letterSpacing: 1.5,
          fontFamily: FONT.bold,
          color,
        }}
      >
        {children}
      </Txt>
    </View>
  );
}
export function Heading({
  title,
  sub,
  eyebrow,
}: {
  title: string;
  sub?: string;
  eyebrow?: string;
}) {
  return (
    <View style={{ gap: 10, marginBottom: 24 }}>
      {eyebrow && <Label color={C.apricot}>{eyebrow}</Label>}
      <Txt
        accessibilityRole="header"
        style={{
          fontSize: 34,
          lineHeight: 38,
          fontFamily: FONT.black,
          letterSpacing: -1,
        }}
      >
        {title}
      </Txt>
      {sub && <Txt style={{ color: C.muted, lineHeight: 24 }}>{sub}</Txt>}
    </View>
  );
}
export function Label({
  children,
  color = C.muted,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <Txt
      style={{
        fontSize: 11,
        fontFamily: FONT.bold,
        color: accentInk(color),
        letterSpacing: 1.5,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Txt>
  );
}
export function Panel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[s.panel, style]}>{children}</View>;
}
export function Field({
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Label>{label}</Label>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={C.muted}
        style={[s.input, props.style]}
      />
    </View>
  );
}
export function Choices<T extends string | number>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {items.map((x) => (
          <Pressable
            key={x.value}
            accessibilityRole="radio"
            accessibilityLabel={`${label}: ${x.label}`}
            accessibilityState={{ checked: value === x.value }}
            onPress={() => onChange(x.value)}
            style={({ pressed }) => ({
              minWidth: 46,
              paddingVertical: 12,
              paddingHorizontal: 15,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: value === x.value ? C.primary : C.line,
              backgroundColor: value === x.value ? C.primary : C.panel,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Txt
              style={{
                color: value === x.value ? C.onPrimary : C.muted,
                fontFamily: FONT.semibold,
                fontSize: 14,
              }}
            >
              {x.label}
            </Txt>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function Entrance({ children }: { children: React.ReactNode }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: a,
        transform: [
          {
            translateY: a.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
export const s = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 20,
    paddingHorizontal: 23,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    padding: 22,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    backgroundColor: C.panel,
    gap: 20,
  },
  input: {
    color: C.text,
    fontFamily: FONT.medium,
    fontSize: 16,
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.bg,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
});
