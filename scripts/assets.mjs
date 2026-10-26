import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("assets/sounds", { recursive: true });
// Exact Lucide ScanFace geometry, stroke and rotation used beside the name
// in App.tsx. Keep the adaptive foreground inside Android's safe area.
const paths = [
  "M3 7V5a2 2 0 0 1 2-2h2",
  "M17 3h2a2 2 0 0 1 2 2v2",
  "M21 17v2a2 2 0 0 1-2 2h-2",
  "M7 21H5a2 2 0 0 1-2-2v-2",
  "M8 14s1.5 2 4 2 4-2 4-2",
  "M9 9h.01",
  "M15 9h.01",
];
const mark = (size) =>
  `<g transform="rotate(-5 512 512) translate(${(1024 - size) / 2} ${(1024 - size) / 2}) scale(${size / 24})" fill="none" stroke="#422339" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${paths.map((d) => `<path d="${d}"/>`).join("")}</g>`;
// Android shows the inner 72dp of the 108dp adaptive layers. The 532px
// foreground therefore matches the 800px legacy mark after that crop and
// stays inside the 66dp-diameter safe circle (radius 313px at this size).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="#FFB05A"/>${mark(800)}</svg>`;
await writeFile("assets/icon.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("assets/icon.png");
await sharp(Buffer.from(svg)).resize(64).png().toFile("assets/favicon.png");
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${mark(532)}</svg>`,
  ),
)
  .png()
  .toFile("assets/adaptive-icon.png");
await mkdir("docs", { recursive: true });
const preview = await sharp(Buffer.from(svg)).resize(256).png().toBuffer();
const roundMask = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><circle cx="128" cy="128" r="128" fill="white"/></svg>',
);
await sharp(preview)
  .composite([{ input: roundMask, blend: "dest-in" }])
  .png()
  .toFile("docs/app-icon-preview.png");
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
