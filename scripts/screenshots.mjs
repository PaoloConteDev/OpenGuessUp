import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";

// Public gallery: portrait home + a portrait presentation of real landscape play.
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 2,
  locale: "en-GB",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() =>
  localStorage.setItem("@open-guess/language-v1", "en"),
);
const button = (name) =>
  page.getByRole("button", { name, exact: true }).first();
const data = (bytes, mime) => `data:${mime};base64,${bytes.toString("base64")}`;
await mkdir("docs/screenshots", { recursive: true });
try {
  await page.goto("http://127.0.0.1:4174");
  await page
    .getByTestId("home-illustration")
    .locator("img")
    .evaluate((img) => img.decode());
  await page.evaluate(() => document.fonts.ready);
  // Font/image decoding may finish before React Native's JS fade-in. Wait
  // for the actual ancestor opacity, then let the final frame reach the screen.
  await page.waitForFunction(() => {
    const illustration = document.querySelector(
      '[data-testid="home-illustration"]',
    );
    if (!illustration) return false;
    for (
      let node = illustration;
      node instanceof HTMLElement;
      node = node.parentElement
    ) {
      if (Number(getComputedStyle(node).opacity) < 1) return false;
    }
    return true;
  });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await page.getByText("You can't see it.", { exact: false }).first().waitFor();
  await page
    .getByRole("button", { name: "New game", exact: true })
    .first()
    .waitFor();
  await page.screenshot({ path: "docs/screenshots/home-portrait-en.png" });
  assert.deepEqual(errors, []);

  if (process.argv.includes("--home-only")) {
    console.log("Home captured at full opacity after the entrance animation.");
  } else {
    await button("New game").click();
    await button("Let's go!").click();
    await page.setViewportSize({ width: 844, height: 390 });
    await button("Let's go! · 60s").click();
    await page.getByTestId("current-word").waitFor();
    for (const key of ["ArrowDown", "ArrowUp", "ArrowDown"]) {
      await page.keyboard.press(key);
      await page.waitForTimeout(720);
    }
    await page.getByText("Animals", { exact: false }).first().waitFor();
    await page.getByRole("button", { name: /^↑ Skip/ }).waitFor();
    await page.getByRole("button", { name: /^↓ Got it!/ }).waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    const game = await page.screenshot();
    assert.deepEqual(errors, []);

    const [font, regular, icon] = await Promise.all([
      readFile(
        "node_modules/@expo-google-fonts/outfit/900Black/Outfit_900Black.ttf",
      ),
      readFile(
        "node_modules/@expo-google-fonts/outfit/400Regular/Outfit_400Regular.ttf",
      ),
      readFile("assets/icon.png"),
    ]);
    const presentation = await browser.newPage({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 2,
    });
    await presentation.setContent(`<!doctype html><html lang="en"><head><style>
    @font-face{font-family:Outfit;src:url('${data(regular, "font/ttf")}')}
    @font-face{font-family:Outfit;src:url('${data(font, "font/ttf")}');font-weight:900}
    *{box-sizing:border-box}body{margin:0;width:430px;height:932px;background:#F7FAFF;color:#26344A;font-family:Outfit;display:flex;flex-direction:column;align-items:center;padding:40px 16px}
    .brand{display:flex;align-items:center;gap:10px;align-self:flex-start;margin-left:10px}.brand img{width:44px;height:44px;border-radius:13px}.brand strong{font-size:23px;font-weight:900}.brand small{display:block;font-size:11px;color:#5D6979}
    .eyebrow{font-size:10px;letter-spacing:1.8px;color:#285E9B;margin:53px 0 14px}
    h1{font-size:44px;line-height:1.04;letter-spacing:-1.4px;font-weight:900;text-align:center;margin:0 0 40px}
    .phone{width:100%;padding:7px;background:#26344A;border-radius:23px;box-shadow:0 16px 35px #26344A24}.phone img{display:block;width:100%;height:auto;border-radius:16px}
    .caption{font-size:11px;color:#5D6979;margin:16px 0 35px}
    .controls{display:flex;gap:12px;width:100%;padding:0 10px}.control{flex:1;padding:17px 8px;border-radius:19px;text-align:center;font-size:14px}.control b{font-size:25px;font-weight:900;display:block;margin-bottom:5px}.green{background:#A9D7AF}.red{background:#F39A93}
    .note{font-size:15px;line-height:23px;text-align:center;color:#5D6979;margin:30px 0 0}
  </style></head><body>
    <div class="brand"><img alt="" src="${data(icon, "image/png")}"><div><strong>Open GuessUp</strong><small>by Gleetch</small></div></div>
    <div class="eyebrow">YOUR TURN, AS FRIENDS SEE IT</div>
    <h1>How many can<br>you guess?</h1>
    <div class="phone"><img alt="Actual gameplay screen" src="${data(game, "image/png")}"></div>
    <div class="caption">Gameplay in landscape</div>
    <div class="controls"><div class="control green"><b>↓ +1</b>Got it!</div><div class="control red"><b>↑</b>Skip</div></div>
    <p class="note">Hold the phone horizontally.<br>Screen facing your friends.</p>
  </body></html>`);
    await presentation.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    assert.ok(
      await presentation.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    );
    await presentation.screenshot({
      path: "docs/screenshots/game-portrait-en.png",
    });
    console.log(
      "English home + real landscape game presented in portrait: two 860×1864 images.",
    );
  }
} finally {
  await browser.close();
}
