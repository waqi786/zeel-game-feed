import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const browsers = [
  { name: "edge", executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" },
  { name: "chrome", executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" }
];

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false }
];

const outputDir = path.resolve("QA_Screenshots", "responsive");
await mkdir(outputDir, { recursive: true });

const results = [];

for (const browserConfig of browsers) {
  const browser = await chromium.launch({ headless: true, executablePath: browserConfig.executablePath });

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.isMobile ? 2 : 1,
      isMobile: viewport.isMobile
    });
    const page = await context.newPage();

    await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.setItem("zeel-current-index", "0"));
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("iframe");
    await page.waitForTimeout(800);

    const frame = page.frameLocator("iframe").first();
    await frame.locator("#score").waitFor();
    const firstTitle = (await page.locator("h2").first().innerText()).trim();
    const before = Number(await frame.locator("#score").innerText());

    const centerX = viewport.width / 2;
    const playY = Math.min(520, viewport.height * 0.5);
    await page.mouse.click(centerX, playY);
    await page.mouse.move(centerX - 90, playY + 24);
    await page.mouse.down();
    await page.mouse.move(centerX + 90, playY + 24, { steps: 10 });
    await page.mouse.up();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);

    const after = Number(await frame.locator("#score").innerText());

    await page.mouse.move(centerX, Math.min(720, viewport.height * 0.78));
    await page.mouse.down();
    await page.mouse.move(centerX, Math.max(150, viewport.height * 0.2), { steps: 14 });
    await page.mouse.up();
    await page.waitForTimeout(700);
    const secondTitle = (await page.locator("h2").first().innerText()).trim();

    await page.screenshot({
      path: path.join(outputDir, `${browserConfig.name}-${viewport.name}-home.png`),
      fullPage: true
    });

    await page.getByRole("button", { name: "Comments" }).first().click();
    await page.getByRole("heading", { name: "Comments" }).waitFor();
    await page.screenshot({
      path: path.join(outputDir, `${browserConfig.name}-${viewport.name}-comments.png`),
      fullPage: true
    });

    results.push({
      browser: browserConfig.name,
      viewport: viewport.name,
      size: `${viewport.width}x${viewport.height}`,
      firstTitle,
      secondTitle,
      switchedGame: firstTitle !== secondTitle,
      scoreBefore: before,
      scoreAfter: after,
      controlsResponded: after > before
    });

    await context.close();
  }

  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
