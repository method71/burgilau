import { expect, test } from "@playwright/test";

test("updates the estimate, WhatsApp link, and hero controls", async ({ page }) => {
  const browserErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("./");

  const price = page.locator("[data-price]");
  const whatsappLink = page.locator("[data-whatsapp]");
  const secondHeroDot = page.locator("[data-hero-dot]").nth(1);

  await expect(page.locator("[data-calculator-fields] .calc__field")).toHaveCount(2);
  await expect(page.locator("[data-calc-input]")).toHaveCount(6);
  await expect(price).toHaveText("от 35 000 ₸");
  await page.locator('[data-parameter-id="wallMaterial"][value="monolith"] + label').click();
  await page.locator('[data-parameter-id="wallThickness"][value="large"] + label').click();
  await expect(price).toHaveText("от 46 000 ₸");

  const whatsappUrl = new URL(await whatsappLink.getAttribute("href"));
  expect(whatsappUrl.searchParams.get("phone")).toBe("77788833329");
  expect(whatsappUrl.searchParams.get("text")).toContain("Материал стены: Монолит");
  expect(whatsappUrl.searchParams.get("text")).toContain("Толщина стены: Более 50 см");
  expect(whatsappUrl.searchParams.get("text")).toContain("от 46 000 ₸");

  const defaultButtonBackground = await whatsappLink.evaluate(
    (element) => element.ownerDocument.defaultView.getComputedStyle(element).backgroundColor,
  );
  await whatsappLink.hover();
  const hoveredButtonStyle = await whatsappLink.evaluate((element) => {
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return { background: style.backgroundColor, opacity: style.opacity };
  });
  expect(hoveredButtonStyle.opacity).toBe("1");
  expect(hoveredButtonStyle.background).not.toBe(defaultButtonBackground);

  await secondHeroDot.click();
  await expect(secondHeroDot).toHaveAttribute("aria-current", "true");
  expect(browserErrors).toEqual([]);
});
