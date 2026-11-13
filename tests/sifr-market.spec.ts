import { test, expect } from "@playwright/test";

for (const mobile of [false, true]) {
  test(`market preferences and first-visit country suggestion ${mobile ? "mobile" : "desktop"}`, async ({ page }) => {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("sifr-test-initialized")) {
        localStorage.clear();
        sessionStorage.setItem("sifr-test-initialized", "1");
      }
    });
    await page.route("**/api/visitor-location", route => route.fulfill({
      status: 200, contentType: "application/json", body: JSON.stringify({ countryCode: "SA" }),
    }));
    await page.route("**/api/exchange-rates", route => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ base: "KWD", updatedAt: "2026-11-13T00:00:00.000Z", rates: { KWD: 1, SAR: 12, USD: 3.2 } }),
    }));
    await page.goto("/?lang=ar");

    const country = mobile ? page.getByTestId("select-mobile-country") : page.getByTestId("select-nav-country");
    const currency = mobile ? page.getByTestId("select-mobile-currency") : page.getByTestId("select-nav-currency");

    await expect(page.getByTestId("banner-location-suggestion")).toBeVisible();
    if (mobile) await page.getByTestId("button-menu").click();
    else {
      await expect(country).toBeVisible();
      await expect(currency).toBeVisible();
    }
    await expect(country).toHaveValue("KW");
    await expect(currency).toHaveValue("KWD");
    if (mobile) await page.keyboard.press("Escape");
    await page.getByTestId("button-location-yes").click();
    if (mobile) await page.getByTestId("button-menu").click();
    await expect(country).toHaveValue("SA");
    await expect(currency).toHaveValue("SAR");
    await expect(page.locator("#books").getByTestId("text-price-13")).toContainText(/ر\.س|SAR/);
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sifr.market") ?? "{}"))).toEqual({
      country: "SA", currency: "SAR",
    });

    await page.reload();
    if (mobile) await page.getByTestId("button-menu").click();
    await expect(country).toHaveValue("SA");
    await expect(currency).toHaveValue("SAR");
    if (mobile) await page.keyboard.press("Escape");
  });
}

test("country suggestion does not change saved preferences until accepted", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("sifr-test-initialized")) {
      localStorage.clear();
      sessionStorage.setItem("sifr-test-initialized", "1");
    }
  });
  await page.route("**/api/visitor-location", route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ countryCode: "TR" }),
  }));
  await page.goto("/?lang=en");
  await expect(page.getByTestId("banner-location-suggestion")).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sifr.market") ?? "{}"))).toEqual({
    country: "KW", currency: "KWD",
  });
  await page.getByTestId("button-location-change").click();
  await expect(page.getByTestId("banner-location-suggestion")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sifr.market") ?? "{}"))).toEqual({
    country: "KW", currency: "KWD",
  });
});

test("unavailable exchange rates fall back clearly to KWD", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("sifr.market", JSON.stringify({ country: "SA", currency: "SAR" }));
    localStorage.setItem("sifr.geo-prompt-seen", "1");
    localStorage.setItem("sifr.lang", "en");
  });
  await page.route("**/api/exchange-rates", route => route.fulfill({
    status: 503, contentType: "application/json", body: JSON.stringify({ error: "unavailable" }),
  }));
  await page.goto("/?lang=en");
  await expect(page.getByTestId("status-rates-unavailable")).toBeVisible();
  await expect(page.getByTestId("select-nav-currency")).toHaveValue("KWD");
  await expect(page.locator("#books").getByTestId("text-price-13")).toContainText(/KWD|KD/);
});
