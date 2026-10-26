import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

// Capture the public portrait gallery. Gameplay keeps its real landscape layout.
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
await page.addInitScript(() => {
  localStorage.setItem("@open-guess/language-v1", "it");
});
const button = (name) =>
  page.getByRole("button", { name, exact: true }).first();
await mkdir("docs/screenshots", { recursive: true });
const capture = async (name) => {
  assert.deepEqual(page.viewportSize(), { width: 390, height: 844 });
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    for (const element of document.querySelectorAll("*")) {
      if (element instanceof HTMLElement && element.scrollTop > 0)
        element.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    for (const element of document.querySelectorAll("*")) {
      if (element instanceof HTMLElement && element.scrollTop > 0)
        element.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `${name}: horizontal overflow`,
  );
  await page.screenshot({ path: `docs/screenshots/${name}-portrait-it.png` });
};
try {
  await page.goto("http://127.0.0.1:4174");
  await page
    .getByTestId("home-illustration")
    .locator("img")
    .evaluate((img) => img.decode());
  await capture("home");
  await button("Categorie").click();
  await page.getByRole("checkbox", { name: "Animali", exact: true }).waitFor();
  await capture("categories");
  await button("Gioca con questi mazzi").click();
  await page
    .getByText("La vostra partita. Il vostro delirio.", { exact: true })
    .waitFor();
  await capture("setup");

  await button("Andiamo!").click();
  await page.setViewportSize({ width: 844, height: 390 });
  await button("Andiamo! · 60s").click();
  await page.getByTestId("current-word").waitFor();
  for (const key of [
    "ArrowDown",
    "ArrowDown",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
  ]) {
    await page.keyboard.press(key);
    await page.waitForTimeout(720);
  }
  await button("Pausa").click();
  await button("Concludi questo turno").click();
  await button("Conferma turno").click();
  await page
    .getByText("Partita finita. Risate infinite.", { exact: true })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await capture("results");
  assert.deepEqual(errors, []);
  console.log(
    "Four real portrait screenshots saved at 780×1688 px; no overflow or JavaScript errors.",
  );
} finally {
  await browser.close();
}
