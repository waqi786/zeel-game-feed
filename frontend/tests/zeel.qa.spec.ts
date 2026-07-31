import { expect, test } from "@playwright/test";

test("ZEEL production smoke flow", async ({ page }) => {
  const qaComment = `Playwright verified comment ${Date.now()}`;
  await page.goto("http://localhost:5173");
  await expect(page.getByText("ZEEL").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Following" })).toBeVisible();
  await expect(page.getByRole("button", { name: "For You" })).toBeVisible();
  await page.getByRole("button", { name: "For You" }).click();

  const frameLocator = page.frameLocator("iframe").first();
  await expect(frameLocator.locator("#score")).toBeVisible();
  await page.waitForTimeout(600);
  const before = Number(await frameLocator.locator("#score").innerText());
  const viewport = page.viewportSize();
  await page.mouse.click((viewport?.width ?? 390) / 2, 430);
  await expect.poll(async () => Number(await frameLocator.locator("#score").innerText())).toBeGreaterThan(before);
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByText("Share this game")).toBeVisible();
  await page.getByRole("button", { name: "Close share" }).click();

  const loginResponse = await page.request.post("http://localhost:5000/api/v1/auth/login", {
    data: { email: "test@test.com", password: "password123" }
  });
  const cookieHeader = loginResponse.headers()["set-cookie"] ?? "";
  const token = /token=([^;]+)/.exec(cookieHeader)?.[1];
  expect(token).toBeTruthy();
  await page.context().addCookies([
    {
      name: "token",
      value: token!,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax"
    }
  ]);
  await page.reload();
  await page.getByRole("button", { name: "Profile", exact: true }).click();
  await expect(page.getByText("Building tiny games for the ZEEL feed.")).toBeVisible();
  await expect(page.getByText("My Games")).toBeVisible();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Discover")).toBeVisible();
  await page.getByRole("button", { name: "Inbox", exact: true }).click();
  await expect(page.getByText("Activity")).toBeVisible();

  await page.getByRole("button", { name: "Home" }).click();
  await page.getByRole("button", { name: "Like" }).first().click();
  await page.getByRole("button", { name: "Comments" }).first().click();
  await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible();
  await page.getByPlaceholder("Add a comment...").fill(qaComment);
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(qaComment)).toBeVisible();
  await Promise.all([
    page.waitForResponse((response) => response.url().includes("/comments/") && response.request().method() === "DELETE" && response.ok()),
    page.getByRole("button", { name: "Delete comment" }).last().click()
  ]);
  await expect(page.getByText(qaComment)).toHaveCount(0);
  await page.getByRole("button", { name: "Close comments" }).click();
});
