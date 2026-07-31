import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("QA_Screenshots");
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROME_PATH ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });

await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.setItem("zeel-current-index", "0"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("iframe");
await page.waitForTimeout(900);
await page.mouse.click(195, 420);
await page.mouse.move(120, 440);
await page.mouse.down();
await page.mouse.move(278, 440, { steps: 8 });
await page.mouse.up();
await page.screenshot({ path: path.join(outputDir, "zeel-home-gameplay.png"), fullPage: true });

await page.getByRole("button", { name: "Comments" }).first().click();
await page.getByRole("heading", { name: "Comments" }).waitFor();
await page.screenshot({ path: path.join(outputDir, "zeel-comments-sheet.png"), fullPage: true });
await page.getByRole("button", { name: "Close comments" }).click();

await page.getByRole("button", { name: "Search", exact: true }).click();
await page.getByText("Discover").waitFor();
await page.screenshot({ path: path.join(outputDir, "zeel-search.png"), fullPage: true });

await page.getByRole("button", { name: "Profile", exact: true }).click();
await page.getByText("My Games").waitFor();
await page.screenshot({ path: path.join(outputDir, "zeel-profile.png"), fullPage: true });

await browser.close();
