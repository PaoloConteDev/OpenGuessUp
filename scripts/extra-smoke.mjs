import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  locale: "it-IT",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(() => {
  if (!localStorage.getItem("@open-guess/language-v1")) {
    localStorage.setItem("@open-guess/language-v1", "it");
    localStorage.setItem("@open-guess/state-v1", "{not valid json");
  }
});
const b = (s) => page.getByRole("button", { name: s, exact: true }).first();
const wait = () => page.waitForTimeout(350);
const long =
  "Un astronauta prepara una torta al cioccolato mentre un drago cerca gli occhiali sulla navicella";
try {
  await page.goto("http://127.0.0.1:4174");
  await b("Categorie").click();
  await b("Crea un mazzo").click();
  await page
    .getByRole("textbox", { name: "Nome del mazzo", exact: true })
    .fill("Vuoto");
  await b("Salva mazzo").click();
  await page.getByRole("checkbox", { name: "Vuoto", exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("checkbox", { name: "Vuoto", exact: true })
      .getAttribute("aria-disabled"),
    "true",
  );
  await b("Modifica mazzo").click();
  await page
    .getByRole("textbox", { name: "Nome del mazzo", exact: true })
    .fill("Lunghissimo");
  await page
    .getByRole("textbox", { name: "Parole ed espressioni", exact: true })
    .fill(long);
  await b("Salva mazzo").click();
  await page.getByRole("checkbox", { name: "Animali", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Lunghissimo", exact: true })
    .click();
  await b("Gioca con questi mazzi").click();
  await b("Andiamo!").click();
  await page.setViewportSize({ width: 844, height: 390 });
  await b("Andiamo! · 60s").click();
  await page.getByTestId("current-word").waitFor();
  await wait();
  await page.screenshot({ path: "docs/long-word-landscape-it.png" });
  assert.ok(
    await page
      .getByTestId("current-word")
      .evaluate((el) => el.scrollHeight <= el.clientHeight + 2),
    "Long word vertically clipped",
  );
  await b("Pausa").click();
  await b("Esci e salva").click();
  await b("Categorie").click();
  await b("Modifica mazzo").click();
  await page
    .getByRole("textbox", { name: "Parole ed espressioni", exact: true })
    .fill("Una parola diversa");
  await b("Salva mazzo").click();
  await b("Modifica mazzo").click();
  await b("Elimina mazzo").click();
  await b("Conferma eliminazione").click();
  await b("Torna alla home").click();
  await b("Riprendi la partita").click();
  await b("Riprendi il turno").click();
  await page.getByTestId("current-word").waitFor();
  assert.equal(
    await page.getByTestId("current-word").textContent(),
    long.toUpperCase(),
  );
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await page.getByText("In pausa. Fiato alle idee.", { exact: true }).waitFor();
  assert.equal(await page.getByTestId("current-word").count(), 0);
  await b("Esci e salva").click();
  await page.setViewportSize({ width: 1280, height: 1000 });
  await b("Categorie").click();
  await wait();
  await page.screenshot({ path: "docs/categories-desktop-it.png" });
  await page.getByRole("checkbox", { name: "Animali", exact: true }).click();
  await b("Gioca con questi mazzi").click();
  await wait();
  await page.screenshot({ path: "docs/setup-desktop-it.png" });
  assert.deepEqual(errors, []);
  await writeFile(
    "docs/extra-validation.json",
    JSON.stringify(
      {
        passed: true,
        errors,
        checks: [
          "corrupt save",
          "empty custom deck",
          "edit/delete custom deck",
          "immutable saved content",
          "long expression fit",
          "blur pause",
          "desktop categories and setup",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: corrupted save, empty deck, edit/delete, immutable match snapshot, long expression fit, background pause, desktop layouts.",
  );
} catch (e) {
  await page.screenshot({ path: "docs/extra-failure.png" });
  throw e;
} finally {
  await browser.close();
}
