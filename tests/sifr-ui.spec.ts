import { test, expect, type Page } from "@playwright/test";

for (const lang of ["ar", "en"] as const) {
  for (const mobile of [false, true]) {
    test(`${lang} ${mobile ? "mobile" : "desktop"}: discovery, filters, partners, newsletter and checkout`, async ({ page }) => {
      await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      // Exercise migration of old local carts and favourites as well as current items.
      await page.addInitScript(() => {
        if (!sessionStorage.getItem("test.seeded")) {
          localStorage.setItem("sifr.cart", JSON.stringify({ 11: 1, 13: 1 }));
          localStorage.setItem("sifr.favs", JSON.stringify([11, 13]));
          sessionStorage.setItem("test.seeded", "yes");
        }
      });
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      await expect(page.getByTestId("text-featured-title")).toContainText(lang === "ar" ? "تعليق المصابيح" : "Masabih");
      await expect(page.locator("#books article")).toHaveCount(36);
      await expect(page.getByTestId("section-dar-taqwa").locator("article")).toHaveCount(4);
      await expect(page.getByTestId("section-ship-to").getByTestId("card-shipping-zone-gulf")).toBeAttached();
      await expect(page.getByTestId("section-ship-to").getByTestId("card-shipping-zone-russiaCaucasus")).toBeAttached();
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sifr.cart") ?? "{}"))).toEqual({ 13: 1 });
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sifr.favs") ?? "[]"))).toEqual([13]);
      await expect(page.locator("#books").getByTestId("text-publisher-28")).toContainText(lang === "ar" ? "دار المنهاج" : "Dar al-Minhaj");

      const prefix = mobile ? "mob" : "desk";
      await noOverflow(page);
      const open = async () => {
        if (mobile) {
          await expect(page.getByTestId("drawer-filters")).toHaveCount(0);
          await page.getByTestId("button-open-filters").click();
          await expect(page.getByTestId("drawer-filters")).toBeVisible();
        }
      };
      const apply = async () => {
        if (mobile) {
          await page.getByTestId("button-drawer-apply").click();
          await expect(page.getByTestId("drawer-filters")).toHaveCount(0);
        }
      };
      const reset = async () => {
        await open();
        await page.getByTestId(mobile ? "button-drawer-reset" : "button-reset-filters").click();
        await apply();
      };
      await open();
      await page.getByTestId(`${prefix}-select-publisher`).selectOption("دار المنهاج");
      await apply();
      await expect(page.locator("#books article")).toHaveCount(7);
      await open();
      await page.getByTestId(`${prefix}-select-author`).selectOption("الشيخ عبد الله سراج الدين الحسيني");
      await apply();
      await expect(page.getByTestId("status-no-results")).toBeVisible();
      await reset();
      await open();
      await page.getByTestId(`${prefix}-select-category`).selectOption("hadith");
      await page.getByTestId(`${prefix}-select-sub`).selectOption("commentaries");
      await apply();
      await expect(page.locator("#books article")).toHaveCount(1);
      await expect(page.locator("#books article")).toHaveAttribute("data-testid", "card-book-13");
      await reset();
      await open();
      await page.getByTestId(`${prefix}-input-price-min`).fill("50");
      await apply();
      await expect(page.locator("#books article")).toHaveCount(1);
      await expect(page.locator("#books article")).toHaveAttribute("data-testid", "card-book-28");
      await reset();
      await page.getByTestId("input-search").fill("غيرموجودXYZ");
      await expect(page.getByTestId("status-no-results")).toBeVisible();
      await page.getByTestId("button-noresults-reset").click();
      await expect(page.locator("#books article")).toHaveCount(36);

      // Each collaboration CTA must prefill the one shared form.
      for (const id of ["bookshop", "publisher", "education", "charity", "research", "distributor"]) {
        await page.getByTestId(`button-partner-${id}`).click();
        await expect(page.getByTestId("select-partner-entity")).toHaveValue(id);
        await expect(page.getByTestId("input-partner-cooperation")).not.toHaveValue("");
      }
      await page.getByTestId("input-partner-name").fill("Automated Demo Partner");
      await page.getByTestId("select-partner-country").selectOption("SY");
      await page.getByTestId("radio-partner-method-whatsapp").click();
      await page.getByTestId("input-partner-contact").fill("+0000000000");
      await page.getByTestId("input-partner-message").fill("Automated UI test, no external contact.");
      await expect(page.getByTestId("button-partner-submit")).toContainText(lang === "ar" ? "احفظ الطلب" : "Save request");
      await page.getByTestId("button-partner-submit").click();
      await expect(page.getByTestId("status-partner-success")).toBeVisible();
      await expect(page.getByTestId("text-partner-reference")).toContainText("PARTNER-");
      await expect(page.getByTestId("status-partner-success")).toContainText(lang === "ar" ? "لن تصلك رسالة تلقائية" : "you will not receive an automatic message");
      await expect(page.getByTestId("text-social-instagram")).toHaveAttribute("aria-disabled", "true");
      await expect(page.getByTestId("text-social-instagram").locator("a")).toHaveCount(0);
      await page.getByTestId("input-newsletter-email").fill("ui-test@example.test");
      await page.getByTestId("checkbox-newsletter-consent").check();
      await page.getByTestId("button-newsletter-submit").click();
      await expect(page.getByTestId("status-newsletter-saved")).toBeVisible();

      await page.getByTestId("button-open-cart").click();
      await expect(page.getByTestId("row-cart-13")).toBeVisible();
      await page.getByTestId("select-cart-country").selectOption("RU-CE");
      const estimate = page.getByTestId("text-cart-shipping-estimate");
      const initialShipping = await estimate.locator("p").nth(0).innerText();
      await expect(estimate.locator("p").nth(1)).toContainText(/0\.5|٠٫٥/);
      await page.getByTestId("button-inc-13").click();
      await expect(estimate.locator("p").nth(1)).toContainText(/1|١/);
      await expect(estimate.locator("p").nth(0)).not.toHaveText(initialShipping);
      await page.getByTestId("button-checkout").click();
      await expect(page).toHaveURL(/\/checkout/);
      await expect.poll(() => page.getByTestId("select-country").locator("option").count()).toBeGreaterThan(250);
      await page.getByTestId("input-name").fill("Automated Demo Order");
      await page.getByTestId("input-email").fill("ui-test@example.test");
      await page.getByTestId("input-phone").fill("00000000");
      await page.getByTestId("select-country").selectOption("RU-CE");
      await page.getByTestId("input-city").fill("Test city");
      await page.getByTestId("input-address").fill("Test address only, no dispatch");
      await page.getByTestId("button-next-payment").click();
      await expect(page.getByTestId("step-payment")).toBeVisible();
      await expect(page.locator('input[autocomplete="cc-number"]')).toHaveCount(0);
      await page.getByTestId("radio-pay-stripe").click();
      await page.getByTestId("button-place-order").click();
      await expect(page).toHaveURL(/\/confirmation/);
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("sifr.receipt") ?? "{}").shipping)).toBe(15);
      await page.goto(`/help/tracking?lang=${lang}`);
      await expect(page.getByTestId("card-tracking")).toBeVisible();
      await expect(page.getByTestId("text-tracking-number")).toContainText("SIFR-");
      for (const topic of ["shipping", "returns", "payments", "faq", "privacy", "terms"]) {
        await page.getByTestId(`link-help-${topic}`).click();
        await expect(page.getByTestId("text-help-title")).toBeVisible();
      }
      await noOverflow(page);
      expect(errors).toEqual([]);
    });
  }
}

async function noOverflow(page: Page) {
  const excess = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(excess).toBeLessThanOrEqual(1);
}
