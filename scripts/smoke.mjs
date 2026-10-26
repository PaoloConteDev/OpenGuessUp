import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: "it-IT",
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(() => {
  if (!localStorage.getItem("@open-guess/language-v1"))
    localStorage.setItem("@open-guess/language-v1", "it");
});
const button = (s) =>
  page.getByRole("button", { name: s, exact: true }).first();
const snap = async (name) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: `docs/${name}.png` });
};
const overflow = async () =>
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Horizontal overflow",
  );
try {
  await page.goto("http://127.0.0.1:4174");
  await page.getByText("Tu non vedi.", { exact: false }).first().waitFor();
  await page.waitForTimeout(350);
  await snap("home-mobile-it");
  await overflow();
  await page.setViewportSize({ width: 1280, height: 900 });
  await snap("home-desktop-it");
  await page.setViewportSize({ width: 390, height: 844 });
  await button("Categorie").click();
  await page.getByRole("checkbox", { name: "Animali", exact: true }).waitFor();
  await snap("categories-mobile-it");
  await overflow();
  await page
    .getByRole("textbox", { name: "Cerca una categoria", exact: true })
    .fill("Musica");
  assert.equal(await page.getByRole("checkbox").count(), 1);
  await page
    .getByRole("textbox", { name: "Cerca una categoria", exact: true })
    .fill("");
  await button("Crea un mazzo").click();
  await page
    .getByRole("textbox", { name: "Nome del mazzo", exact: true })
    .fill("Gli amici");
  await page
    .getByRole("textbox", { name: "Parole ed espressioni", exact: true })
    .fill("  Una pizza volante  \nUNA PIZZA VOLANTE\nIl divano magico\n");
  await button("Salva mazzo").click();
  await page
    .getByRole("checkbox", { name: "Gli amici", exact: true })
    .waitFor();
  await page.getByRole("checkbox", { name: "Animali", exact: true }).click();
  await page.getByRole("checkbox", { name: "Gli amici", exact: true }).click();
  await button("Gioca con questi mazzi").click();
  await page
    .getByRole("radio", { name: "Durata del turno: 30s", exact: true })
    .click();
  await page
    .getByText("La vostra partita. Il vostro delirio.", { exact: true })
    .scrollIntoViewIfNeeded();
  await snap("setup-mobile-it");
  await overflow();
  await button("Andiamo!").click();
  await page.setViewportSize({ width: 844, height: 390 });
  await button("Andiamo! · 30s").waitFor();
  await snap("preparation-landscape-it");
  assert.equal(await page.getByTestId("current-word").count(), 0);
  await button("Andiamo! · 30s").click();
  assert.equal(await page.getByTestId("current-word").count(), 0);
  await page.getByTestId("current-word").waitFor();
  await snap("turn-landscape-it");
  await overflow();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(720);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(720);
  await button("Pausa").click();
  await page.getByText("In pausa. Fiato alle idee.", { exact: true }).waitFor();
  assert.equal(await page.getByTestId("current-word").count(), 0);
  await snap("pause-landscape-it");
  await button("Esci e salva").click();
  await page.reload();
  await button("Riprendi la partita").click();
  await page.getByText("In pausa. Fiato alle idee.", { exact: true }).waitFor();
  await button("Riprendi il turno").click();
  await page.getByTestId("current-word").waitFor();
  await page.waitForTimeout(32000);
  await page.getByText("Tempo! Come è andata?", { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await snap("review-mobile-it");
  await overflow();
  await page
    .getByRole("radio", {
      name: "Parola da indovinare: Indovinata",
      exact: true,
    })
    .nth(1)
    .click();
  await button("Conferma turno").click();
  await page
    .getByText("Partita finita. Risate infinite.", { exact: true })
    .waitFor();
  await snap("results-mobile-it");
  await button("Rivincita").click();
  await button("Andiamo! · 30s").waitFor();
  await button("Esci e salva").click();
  await button("Lingua").click();
  await button("English").click();
  await page.getByText("You can't see it.", { exact: false }).first().waitFor();
  await button("Language").click();
  await button("Español").click();
  await page.getByText("Tú no lo ves.", { exact: false }).first().waitFor();
  await button("Idioma").click();
  await button("Français").click();
  await page.getByText("Tu ne vois rien.", { exact: false }).first().waitFor();
  await button("Langue").click();
  await button("Deutsch").click();
  await page
    .getByText("Du siehst es nicht.", { exact: false })
    .first()
    .waitFor();
  await button("Sprache").click();
  await button("Italiano").click();
  await button("Nuova partita").click();
  await page
    .getByRole("radio", { name: "Modalità: A squadre", exact: true })
    .click();
  await page.getByRole("radio", { name: "Squadre: 2", exact: true }).click();
  await page
    .getByRole("radio", { name: "Round per squadra: 1", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Squadra 1", exact: true })
    .fill("Pipistrelli");
  await page
    .getByRole("textbox", { name: "Squadra 2", exact: true })
    .fill("Pinguini");
  await button("Andiamo!").click();
  for (let i = 0; i < 2; i++) {
    await button("Andiamo! · 30s").click();
    await page.getByTestId("current-word").waitFor();
    await page.keyboard.press("Space");
    await button("Concludi questo turno").click();
    await button("Conferma turno").click();
  }
  await page.getByText("Pari merito!", { exact: true }).waitFor();
  await snap("teams-tie-mobile-it");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: mobile/desktop layout, category search, bulk custom deck, quick game, keys, pause/save/reload, real expiry, review edits, replay, five languages, equal team turns and tie.",
  );
  await writeFile(
    "docs/web-validation.json",
    JSON.stringify(
      {
        passed: true,
        errors,
        screenshots: 10,
        checkedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
} catch (e) {
  await snap("failure");
  throw e;
} finally {
  await browser.close();
}
