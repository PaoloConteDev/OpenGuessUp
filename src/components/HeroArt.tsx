import { View } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Rect, Text } from "react-native-svg";
import { C, FONT } from "../theme";

const SKIN = "#F8BD91";
const SKIN_SHADE = "#E69E76";

// Original vector artwork. One coordinate system keeps the face, hands and
// phone lettering aligned at every screen width, including native Android.
export function HeroArt({
  word = "PIZZA",
  correct = "Indovinata!",
}: {
  word?: string;
  correct?: string;
}) {
  return (
    <View
      testID="home-illustration"
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${word} · ${correct}`}
      style={{
        width: "100%",
        maxWidth: 470,
        aspectRatio: 460 / 360,
        alignSelf: "center",
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 460 360">
        <Circle cx="232" cy="181" r="151" fill={C.discovery} />
        <Circle cx="232" cy="181" r="131" fill={C.panel} opacity={0.65} />
        <Path
          d="M78 214A159 159 0 0 1 291 33M382 127A159 159 0 0 1 322 312"
          fill="none"
          stroke={C.line}
          strokeWidth="1.5"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
        <Ellipse
          cx="232"
          cy="339"
          rx="112"
          ry="9"
          fill={C.ink}
          opacity={0.08}
        />

        {/* Raised forearms sit behind the shoulders and the phone. */}
        <Path
          d="M155 286C127 272 108 244 102 214L91 160C89 148 94 139 103 140L118 157L128 208C133 231 147 245 171 254Z"
          fill={SKIN}
          stroke={C.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <Path
          d="M295 257C318 242 331 219 336 195L346 144C348 134 357 131 365 141L372 156L361 214C356 244 342 269 314 285Z"
          fill={SKIN}
          stroke={C.ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <Path
          d="M103 177L111 214Q117 248 141 263"
          fill="none"
          stroke={SKIN_SHADE}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <Path
          d="M355 176L349 211Q342 243 323 260"
          fill="none"
          stroke={SKIN_SHADE}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Shirt, neck and seams give the silhouette a finished shape. */}
        <Path
          d="M188 263C164 264 141 274 122 294L145 319L160 310L153 338H310L303 311L319 320L343 293C325 275 300 265 274 263Z"
          fill={C.green}
          stroke={C.ink}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <Path
          d="M159 300L166 283M303 300L295 283"
          fill="none"
          stroke={C.success}
          strokeOpacity={0.45}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M153 331H310"
          fill="none"
          stroke={C.success}
          strokeOpacity={0.2}
          strokeWidth="5"
        />
        <Path
          d="M205 239L203 269Q230 295 260 268L258 238Z"
          fill={SKIN}
          stroke={C.ink}
          strokeWidth="3"
        />
        <Path
          d="M205 245Q232 268 258 245L259 257Q230 278 204 257Z"
          fill={SKIN_SHADE}
        />
        <Path
          d="M193 268Q231 310 272 268"
          fill="none"
          stroke={C.success}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <G transform="rotate(8 278 311)">
          <Rect x="265" y="298" width="26" height="26" rx="8" fill={C.blue} />
          <Path
            d="M278 303L280 309L286 311L280 313L278 319L276 313L270 311L276 309Z"
            fill={C.yellow}
          />
        </G>

        <G transform="rotate(-4 231 181)">
          <Ellipse
            cx="163"
            cy="184"
            rx="13"
            ry="20"
            fill={SKIN}
            stroke={C.ink}
            strokeWidth="3"
          />
          <Ellipse
            cx="297"
            cy="184"
            rx="13"
            ry="20"
            fill={SKIN}
            stroke={C.ink}
            strokeWidth="3"
          />
          <Path
            d="M160 179Q171 176 166 190M300 179Q289 176 294 190"
            fill="none"
            stroke={SKIN_SHADE}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d="M166 142C166 106 193 84 229 84C269 84 295 109 295 145L292 194C289 235 264 260 231 262C197 261 173 236 169 200Z"
            fill={SKIN}
            stroke={C.ink}
            strokeWidth="3.5"
          />
          <Path
            d="M177 199C180 227 199 250 231 253C253 254 273 242 285 222C275 247 254 261 231 262C198 261 175 238 170 210Z"
            fill={SKIN_SHADE}
            opacity={0.5}
          />
          <Path
            d="M166 166C151 141 157 105 172 88C164 76 177 62 197 67C202 48 224 49 236 61C256 42 282 56 281 72C307 76 317 106 297 151L284 134C256 145 236 128 218 123C199 137 181 133 177 154L174 169Z"
            fill={C.ink}
          />
          <Path
            d="M188 91Q212 69 234 80M247 79Q266 71 281 92"
            fill="none"
            stroke={C.primary}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={0.65}
          />
          <Path
            d="M188 183Q199 177 210 182M253 182Q265 176 276 182"
            fill="none"
            stroke={C.ink}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Path
            d="M190 196Q200 185 210 196M253 196Q264 185 274 196"
            fill="none"
            stroke={C.ink}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M230 196L225 210Q230 214 237 210"
            fill="none"
            stroke={SKIN_SHADE}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Ellipse
            cx="188"
            cy="211"
            rx="11"
            ry="5"
            fill={C.red}
            opacity={0.6}
          />
          <Ellipse
            cx="275"
            cy="211"
            rx="11"
            ry="5"
            fill={C.red}
            opacity={0.6}
          />
          <Path
            d="M209 219Q231 231 255 218C252 250 215 251 209 219Z"
            fill={C.ink}
          />
          <Path
            d="M215 223Q231 230 249 222L247 229Q230 235 218 229Z"
            fill={C.panel}
          />
          <Path d="M221 241Q234 229 246 239Q234 247 221 241Z" fill={C.red} />
        </G>

        <G transform="rotate(-8 230 126)">
          <Rect
            x="107"
            y="88"
            width="252"
            height="94"
            rx="21"
            fill={C.ink}
            opacity={0.12}
          />
          <Rect x="104" y="79" width="252" height="94" rx="21" fill={C.ink} />
          <Rect
            x="111"
            y="86"
            width="238"
            height="80"
            rx="15"
            fill={C.yellow}
          />
          <Path
            d="M127 89H310L236 163H127Q114 163 114 150V102Q114 89 127 89Z"
            fill={C.panel}
            opacity={0.16}
          />
          <Rect x="117" y="114" width="4" height="24" rx="2" fill={C.ink} />
          <Circle cx="340" cy="126" r="3.5" fill={C.ink} />
          <Text
            x="232"
            y="143"
            textAnchor="middle"
            fill={C.ink}
            fontFamily={FONT.black}
            fontSize={Math.min(43, 350 / Math.max(word.length, 1))}
            letterSpacing="1"
          >
            {word}
          </Text>
          {/* Fingers overlap the case so the phone is visibly held. */}
          <Path
            d="M105 121C97 118 91 124 94 134L101 160C104 170 114 169 119 161L124 151C127 143 119 138 114 145L110 151L109 130Q109 123 105 121Z"
            fill={SKIN}
            stroke={C.ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <Path
            d="M101 131L105 143M103 148L107 156"
            fill="none"
            stroke={SKIN_SHADE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <G transform="translate(460 0) scale(-1 1)">
            <Path
              d="M105 121C97 118 91 124 94 134L101 160C104 170 114 169 119 161L124 151C127 143 119 138 114 145L110 151L109 130Q109 123 105 121Z"
              fill={SKIN}
              stroke={C.ink}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <Path
              d="M101 131L105 143M103 148L107 156"
              fill="none"
              stroke={SKIN_SHADE}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </G>
        </G>

        {/* Four quiet confetti colors frame the character. */}
        <Path
          d="M53 133L58 148L73 153L58 158L53 173L48 158L33 153L48 148Z"
          fill={C.red}
        />
        <Path
          d="M393 197L397 209L409 213L397 217L393 229L389 217L377 213L389 209Z"
          fill={C.yellow}
        />
        <Rect
          x="82"
          y="63"
          width="8"
          height="22"
          rx="3"
          fill={C.blue}
          transform="rotate(-28 86 74)"
        />
        <Rect
          x="370"
          y="79"
          width="8"
          height="21"
          rx="3"
          fill={C.red}
          transform="rotate(26 374 89)"
        />
        <Rect
          x="73"
          y="270"
          width="7"
          height="18"
          rx="3"
          fill={C.green}
          transform="rotate(-40 76 279)"
        />
        <Circle cx="327" cy="43" r="5" fill={C.green} />
        <Circle cx="113" cy="236" r="4" fill={C.yellow} />
        <Circle
          cx="399"
          cy="111"
          r="5"
          fill="none"
          stroke={C.blue}
          strokeWidth="3"
        />

        <G transform="rotate(6 365 285)">
          <Rect
            x="298"
            y="267"
            width="137"
            height="43"
            rx="21.5"
            fill={C.ink}
            opacity={0.08}
          />
          <Rect
            x="296"
            y="262"
            width="137"
            height="43"
            rx="21.5"
            fill={C.green}
            stroke={C.panel}
            strokeWidth="3"
          />
          <Path
            d="M309 283L314 288L323 277"
            fill="none"
            stroke={C.ink}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Text
            x="372"
            y="289"
            textAnchor="middle"
            fill={C.ink}
            fontFamily={FONT.bold}
            fontSize={Math.min(14, 148 / Math.max(correct.length, 1))}
          >
            {correct}
          </Text>
        </G>
      </Svg>
    </View>
  );
}
