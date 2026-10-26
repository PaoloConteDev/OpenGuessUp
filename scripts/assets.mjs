import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("assets/sounds", { recursive: true });
const mark = `<g transform="rotate(-7 512 512)"><rect x="200" y="324" width="624" height="376" rx="96" fill="#286554"/><rect x="229" y="353" width="566" height="318" rx="68" fill="#FFB05A"/><path d="M350 444 Q384 415 418 444 M606 444 Q640 415 674 444" stroke="#422339" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M418 537 Q512 628 606 537" stroke="#422339" stroke-width="27" fill="none" stroke-linecap="round"/><rect x="244" y="464" width="11" height="72" rx="5" fill="#422339"/></g><path d="M687 230 h91 v91 M772 236 l-88 88" stroke="#AF2F63" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="245" cy="748" r="17" fill="#9AD7C7"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" rx="216" fill="#FFF9F0"/><circle cx="512" cy="512" r="419" stroke="#FFB05A" stroke-width="3" fill="none"/>${mark}</svg>`;
await writeFile("assets/icon.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("assets/icon.png");
await sharp(Buffer.from(svg)).resize(64).png().toFile("assets/favicon.png");
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><g transform="translate(110 110) scale(.785)">${mark}</g></svg>`,
  ),
)
  .png()
  .toFile("assets/adaptive-icon.png");
function wav(notes, duration) {
  const rate = 22050,
    count = Math.floor(rate * duration),
    b = Buffer.alloc(44 + count * 2);
  b.write("RIFF");
  b.writeUInt32LE(b.length - 8, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    let a = 0;
    for (const [f, s, d] of notes) {
      const x = t - s;
      if (x >= 0 && x < d)
        a +=
          Math.sin(x * f * Math.PI * 2) *
          Math.min(1, x / 0.008, (d - x) / 0.04) *
          0.19;
    }
    b.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, a)) * 32767),
      44 + i * 2,
    );
  }
  return b;
}
for (const [name, notes, d] of [
  [
    "correct",
    [
      [587, 0, 0.13],
      [880, 0.08, 0.18],
      [1175, 0.18, 0.16],
    ],
    0.36,
  ],
  [
    "skip",
    [
      [440, 0, 0.12],
      [294, 0.09, 0.18],
    ],
    0.3,
  ],
  ["tick", [[660, 0, 0.065]], 0.09],
  [
    "finish",
    [
      [523, 0, 0.17],
      [392, 0.14, 0.17],
      [262, 0.28, 0.33],
    ],
    0.64,
  ],
])
  await writeFile(`assets/sounds/${name}.wav`, wav(notes, d));
console.log("Original Open GuessUp icons and PCM sounds generated.");
