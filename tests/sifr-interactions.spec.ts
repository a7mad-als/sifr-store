import { test, expect } from "@playwright/test";

for (const mobile of [false, true]) {
  test(`language toggle preserves edition filters and keyboard drawer works ${mobile ? "mobile" : "desktop"}`, async ({ page }) => {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await page.goto("/?lang=ar");
    await expect(page.locator("#books article")).toHaveCount(36);
    const prefix = mobile ? "mob" : "desk";
    if (mobile) await page.getByTestId("button-open-filters").click();
    await page.getByTestId(`${prefix}-select-publisher`).selectOption("دار المنهاج");
    await page.getByTestId(`${prefix}-select-author`).selectOption("الإمام أبو حامد الغزالي");
    if (mobile) {
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("drawer-filters")).toHaveCount(0);
      await page.getByTestId("button-menu").click();
      await page.getByTestId("button-mobile-lang").click();
      await page.keyboard.press("Escape");
    } else await page.getByTestId("button-lang").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#books article")).toHaveCount(7);
    if (mobile) await page.getByTestId("button-open-filters").click();
    await expect(page.getByTestId(`${prefix}-select-publisher`)).toHaveValue("دار المنهاج");
    await expect(page.getByTestId(`${prefix}-select-author`)).toHaveValue("الإمام أبو حامد الغزالي");
    if (mobile) {
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("drawer-filters")).toHaveCount(0);
    }
    await page.locator("#books").getByTestId("button-cover-28").click();
    await expect(page.getByRole("dialog")).toContainText("Dar al-Minhaj");
    await expect(page.getByRole("dialog")).toContainText("10 volumes");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}
