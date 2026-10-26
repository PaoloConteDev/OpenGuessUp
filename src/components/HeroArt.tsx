import { View } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Rect, Line } from "react-native-svg";
import { Txt } from "./UI";
import { C, FONT } from "../theme";
// Original, code-drawn illustration. No downloaded or generated raster artwork.
export function HeroArt({
  word = "PIZZA",
  correct = "Indovinata!",
}: {
  word?: string;
  correct?: string;
}) {
  return (
    <View
      style={{
        height: 340,
        width: "100%",
        maxWidth: 470,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 460 340">
        <Circle cx="230" cy="170" r="147" fill={C.panel} />
        <Rect
          x="66"
          y="43"
          width="9"
          height="24"
          rx="3"
          fill={C.blue}
          transform="rotate(-26 70 55)"
        />
        <Rect
          x="365"
          y="122"
          width="8"
          height="22"
          rx="3"
          fill={C.red}
          transform="rotate(31 369 133)"
        />
        <Circle cx="116" cy="283" r="5" fill={C.yellow} />
        <Circle cx="333" cy="37" r="4" fill={C.blue} />
        <Circle
          cx="230"
          cy="170"
          r="165"
          fill="none"
          stroke={C.line}
          strokeDasharray="48 12 4 12"
        />
        <Ellipse
          cx="232"
          cy="317"
          rx="120"
          ry="11"
          fill={C.primary}
          opacity="0.13"
        />
        <Path d="M120 322 Q128 237 230 240 Q331 238 341 322" fill={C.green} />
        <Path
          d="M196 245 L196 220 L266 220 L266 245 Q235 283 196 245"
          fill="#F2A77F"
        />
        <Ellipse cx="231" cy="169" rx="79" ry="93" fill="#FFC49A" />
        <Circle cx="151" cy="178" r="14" fill="#FFC49A" />
        <Circle cx="311" cy="178" r="14" fill="#FFC49A" />
        <Path
          d="M153 143 Q132 54 215 53 Q300 30 311 141 L288 126 Q245 145 175 120Z"
          fill={C.ink}
        />
        <Path
          d="M190 185 Q199 176 208 185 M253 185 Q262 176 271 185"
          fill="none"
          stroke={C.ink}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <Path d="M211 212 Q232 238 254 210Z" fill={C.ink} />
        <Path
          d="M219 219 Q234 226 246 218"
          fill="none"
          stroke={C.red}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <Path
          d="M135 295 Q97 250 92 184 Q91 162 102 143 Q115 130 122 150 L126 188 L156 247"
          fill="#FFC49A"
        />
        <Path
          d="M324 289 Q359 238 363 180 Q365 159 351 141 Q338 132 332 152 L327 187 L302 246"
          fill="#FFC49A"
        />
        <G transform="rotate(-8 230 112)">
          <Rect x="98" y="65" width="267" height="113" rx="21" fill={C.ink} />
          <Rect
            x="106"
            y="73"
            width="251"
            height="97"
            rx="15"
            fill={C.yellow}
          />
          <Rect x="112" y="100" width="5" height="38" rx="3" fill={C.ink} />
          <Circle cx="346" cy="121" r="4" fill={C.ink} />
          <Path
            d="M222 84 L236 84"
            stroke={C.ink}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </G>
        <Path
          d="M49 113 l5 -17 l6 17 l17 5 l-17 6 l-6 17 l-5 -17 l-17 -6Z"
          fill={C.red}
        />
        <Path
          d="M391 216 l4 -12 l5 12 l12 4 l-12 4 l-5 12 l-4 -12 l-12 -4Z"
          fill={C.yellow}
        />
        <Circle cx="393" cy="64" r="6" fill={C.green} />
        <Line
          x1="57"
          y1="253"
          x2="67"
          y2="263"
          stroke={C.green}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 93,
          left: "27%",
          right: "22%",
          transform: [{ rotate: "-8deg" }],
        }}
      >
        <Txt
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            color: C.ink,
            fontFamily: FONT.black,
            fontSize: 35,
            textAlign: "center",
          }}
        >
          {word}
        </Txt>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 44,
          right: 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 24,
          backgroundColor: C.green,
          transform: [{ rotate: "-5deg" }],
          shadowColor: "#26344A",
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <Txt style={{ color: C.ink, fontFamily: FONT.bold, fontSize: 14 }}>
          ✓ {correct}
        </Txt>
      </View>
    </View>
  );
}
