import { expect, test } from "@playwright/test";

function family(title: string) {
  const name = title.toLowerCase();
  if (/(shooter|bullet|blast|invader|alien|sniper|war|strike|laser|marine|tank|fighter)/.test(name)) return "shooter";
  if (/(car|kart|moto|drift|race|traffic|highway|road|ramp)/.test(name)) return "racing";
  if (/(football|basket|pool|bowling|penalty|goal|tennis|golf|cricket|rope|launcher)/.test(name)) return "sports";
  if (/(maze|pac|mine|escape|room|door|labyrinth)/.test(name)) return "maze";
  if (/(snake|grid|ludo|chess|tic|sudoku|whack|mole|bomber|hardest|field|connect|defense)/.test(name)) return "grid";
  if (/(flappy|bird|rocket|flight|blumgi|comet|gravity bird)/.test(name)) return "flappy";
  if (/(jump|doodle|helix|redball|flip|bunny|parkour|climb|leap|yoyo|magma)/.test(name)) return "jump";
  if (/(switch|color|bubble|simon|rgb|zuma|loop)/.test(name)) return "switch";
  if (/(stack|tower|stacktris|flip)/.test(name)) return "stack";
  if (/(block|brick|breaker|pinball)/.test(name)) return "breaker";
  if (/(2048|tetris|tile|mahjong|solitaire|candy|word|quiz|match|merge|puzzle|memory|code|prism|painting|color by)/.test(name)) return "puzzle";
  if (/(orbit|orbital|coil|bouncing|ball|circle|spiral)/.test(name)) return "orbit";
  if (/(blade|slice|fruit ninja|slasho|slash|ninja)/.test(name)) return "slice";
  if (/(tunnel|void|vortex|cyclone)/.test(name)) return "tunnel";
  if (/(shadow|kombat|zombie|outbreak|dark)/.test(name)) return "combat";
  if (/(crossy|paper|slither|ziggy|lane|tag|trail|subway|temple|surf|sprint)/.test(name)) return "lane";
  return "runner";
}

test("ZEEL feed gives 50 different games before repeating", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("http://localhost:5173");
  await page.evaluate(() => localStorage.setItem("zeel-current-index", "0"));
  await page.reload();
  await expect(page.getByText("ZEEL").first()).toBeVisible();

  const titles: string[] = [];
  const viewport = page.viewportSize() ?? { width: 390, height: 844 };
  const x = viewport.width / 2;
  const downY = Math.min(680, viewport.height * 0.78);
  const upY = Math.max(150, viewport.height * 0.22);

  for (let index = 0; index < 50; index += 1) {
    const title = (await page.locator("h2").first().innerText()).trim();
    titles.push(title);
    const frame = page.frameLocator("iframe.opacity-100").first();
    await expect(frame.locator("#hud")).toBeVisible({ timeout: 10_000 });
    await page.mouse.move(x, downY);
    await page.mouse.down();
    await page.mouse.move(x, upY, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(220);
  }

  expect(new Set(titles).size).toBe(titles.length);
  expect(new Set(titles.map(family)).size).toBeGreaterThanOrEqual(10);
});

test("ZEEL refresh starts a new For You sequence", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.evaluate(() => localStorage.setItem("zeel-current-index", "0"));
  await page.reload();
  await expect(page.getByText("ZEEL").first()).toBeVisible();

  const firstSequence: string[] = [];
  const secondSequence: string[] = [];
  const viewport = page.viewportSize() ?? { width: 390, height: 844 };
  const x = viewport.width / 2;
  const downY = Math.min(680, viewport.height * 0.78);
  const upY = Math.max(150, viewport.height * 0.22);

  for (let index = 0; index < 8; index += 1) {
    firstSequence.push((await page.locator("h2").first().innerText()).trim());
    await page.mouse.move(x, downY);
    await page.mouse.down();
    await page.mouse.move(x, upY, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(180);
  }

  await page.reload();
  await expect(page.getByText("ZEEL").first()).toBeVisible();
  for (let index = 0; index < 8; index += 1) {
    secondSequence.push((await page.locator("h2").first().innerText()).trim());
    await page.mouse.move(x, downY);
    await page.mouse.down();
    await page.mouse.move(x, upY, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(180);
  }

  const overlap = secondSequence.filter((title) => firstSequence.includes(title));
  expect(overlap).toHaveLength(0);
});
