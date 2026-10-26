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
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  locale: "it-IT",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() =>
  localStorage.setItem("@open-guess/language-v1", "it"),
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
  await page.screenshot({ path: "docs/screenshots/home-portrait-it.png" });
  assert.deepEqual(errors, []);

  if (process.argv.includes("--home-only")) {
    console.log("Home captured at full opacity after the entrance animation.");
  } else {
    await button("Nuova partita").click();
    await button("Andiamo!").click();
    await page.setViewportSize({ width: 844, height: 390 });
    await button("Andiamo! · 60s").click();
    await page.getByTestId("current-word").waitFor();
    for (const key of ["ArrowDown", "ArrowUp", "ArrowDown"]) {
      await page.keyboard.press(key);
      await page.waitForTimeout(720);
    }
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
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    await presentation.setContent(`<!doctype html><html lang="it"><head><style>
    @font-face{font-family:Outfit;src:url('${data(regular, "font/ttf")}')}
    @font-face{font-family:Outfit;src:url('${data(font, "font/ttf")}');font-weight:900}
    *{box-sizing:border-box}body{margin:0;width:390px;height:844px;background:#F7FAFF;color:#26344A;font-family:Outfit;display:flex;flex-direction:column;align-items:center;padding:40px 16px}
    .brand{display:flex;align-items:center;gap:10px;align-self:flex-start;margin-left:10px}.brand img{width:44px;height:44px;border-radius:13px}.brand strong{font-size:23px;font-weight:900}.brand small{display:block;font-size:11px;color:#5D6979}
    .eyebrow{font-size:10px;letter-spacing:1.8px;color:#285E9B;margin:53px 0 14px}
    h1{font-size:44px;line-height:1.04;letter-spacing:-1.4px;font-weight:900;text-align:center;margin:0 0 40px}
    .phone{width:100%;padding:7px;background:#26344A;border-radius:23px;box-shadow:0 16px 35px #26344A24}.phone img{display:block;width:100%;height:auto;border-radius:16px}
    .caption{font-size:11px;color:#5D6979;margin:16px 0 35px}
    .controls{display:flex;gap:12px;width:100%;padding:0 10px}.control{flex:1;padding:17px 8px;border-radius:19px;text-align:center;font-size:14px}.control b{font-size:25px;font-weight:900;display:block;margin-bottom:5px}.green{background:#A9D7AF}.red{background:#F39A93}
    .note{font-size:15px;line-height:23px;text-align:center;color:#5D6979;margin:30px 0 0}
  </style></head><body>
    <div class="brand"><img alt="" src="${data(icon, "image/png")}"><div><strong>Open GuessUp</strong><small>by Gleetch</small></div></div>
    <div class="eyebrow">IL TURNO, VISTO DAGLI AMICI</div>
    <h1>Quanto riesci<br>a indovinare?</h1>
    <div class="phone"><img alt="Schermata reale del turno" src="${data(game, "image/png")}"></div>
    <div class="caption">Schermata del turno in orizzontale</div>
    <div class="controls"><div class="control green"><b>↓ +1</b>Indovinata</div><div class="control red"><b>↑</b>Passa</div></div>
    <p class="note">Telefono in orizzontale.<br>Schermo verso gli amici.</p>
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
      path: "docs/screenshots/game-portrait-it.png",
    });
    console.log(
      "Home + real landscape game presented in portrait: two 780×1688 images.",
    );
  }
} finally {
  await browser.close();
}
