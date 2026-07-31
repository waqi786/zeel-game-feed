const { chromium } = require("@playwright/test");
const path = require("node:path");

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("zeel-current-index", "0"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByText("ZEEL").first().waitFor({ state: "visible" });

  const outDir = path.resolve(__dirname, "..", "..", "QA_Screenshots");
  const viewport = page.viewportSize() || { width: 430, height: 932 };
  const x = viewport.width / 2;
  const downY = Math.min(760, viewport.height * 0.78);
  const upY = Math.max(150, viewport.height * 0.22);
  const titles = [];

  for (let index = 0; index < 6; index += 1) {
    await page.frameLocator("iframe.opacity-100").first().locator("#hud").waitFor({ state: "visible", timeout: 10000 });
    const title = (await page.locator("h2").first().innerText()).trim();
    titles.push(title);
    await page.screenshot({ path: path.join(outDir, `zeel-variety-${index + 1}.png`), fullPage: false });
    await page.mouse.move(x, downY);
    await page.mouse.down();
    await page.mouse.move(x, upY, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(350);
  }

  console.log(titles.join("\n"));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
