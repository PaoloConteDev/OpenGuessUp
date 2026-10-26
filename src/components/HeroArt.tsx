import { Image, View } from "react-native";

// Original generated artwork, bundled locally for offline Android and web.
// Decorative: the adjacent copy already explains the game to screen readers.
export function HeroArt() {
  return (
    <View
      testID="home-illustration"
      pointerEvents="none"
      style={{
        width: "100%",
        maxWidth: 470,
        aspectRatio: 4 / 3,
        alignSelf: "center",
      }}
    >
      <Image
        source={require("../../assets/hero-party.png")}
        accessible={false}
        resizeMode="contain"
        fadeDuration={0}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
