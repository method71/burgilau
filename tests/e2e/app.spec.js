import { expect, test } from "@playwright/test";

function getContrastRatio(foreground, background) {
  const luminance = (color) => {
    const channels = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number);
    return channels
      .map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      })
      .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  };

  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

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
  const hero = page.locator("[data-hero]");
  const realHeroCtas = page.locator("[data-hero-slide]:not([data-loop-clone]) [data-hero-cta]");

  const heroDotTabIndexes = await page
    .locator("[data-hero-dot]")
    .evaluateAll((dots) => dots.map((dot) => dot.getAttribute("tabindex")));
  expect(heroDotTabIndexes).toEqual(["-1", "-1"]);
  await expect(realHeroCtas.nth(0)).toHaveAttribute("tabindex", "0");
  await expect(realHeroCtas.nth(1)).toHaveAttribute("tabindex", "-1");

  await hero.focus();
  await expect(hero).toBeFocused();
  const focusedHeroOutline = await hero.evaluate((element) => {
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(focusedHeroOutline.style).not.toBe("none");
  expect(focusedHeroOutline.width).not.toBe("0px");
  await hero.press("ArrowRight");
  await expect(secondHeroDot).toHaveAttribute("aria-current", "true");
  await expect(page.locator("[data-hero-status]")).toHaveText("Предложение 2 из 2");
  await expect(realHeroCtas.nth(0)).toHaveAttribute("tabindex", "-1");
  await expect(realHeroCtas.nth(1)).toHaveAttribute("tabindex", "0");

  await hero.press("Home");
  await expect(page.locator("[data-hero-dot]").nth(0)).toHaveAttribute("aria-current", "true");
  await hero.press("End");
  await expect(secondHeroDot).toHaveAttribute("aria-current", "true");
  await hero.press("ArrowLeft");
  await expect(page.locator("[data-hero-dot]").nth(0)).toHaveAttribute("aria-current", "true");
  await hero.press("Tab");
  await expect(realHeroCtas.nth(0)).toBeFocused();

  await expect(page.locator("[data-calculator-fields] .calc__field")).toHaveCount(2);
  await expect(page.locator("[data-calc-input]")).toHaveCount(6);
  await expect(price).toHaveText("от 35 000 ₸");

  const brickInput = page.locator('[data-parameter-id="wallMaterial"][value="brick"]');
  await brickInput.focus();
  await expect(brickInput).toBeFocused();
  const focusedCardOutline = await page
    .locator('[data-parameter-id="wallMaterial"][value="brick"] + label')
    .evaluate((element) => {
      const style = element.ownerDocument.defaultView.getComputedStyle(element);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
  expect(focusedCardOutline.style).not.toBe("none");
  expect(focusedCardOutline.width).not.toBe("0px");
  await brickInput.press("ArrowRight");
  await expect(page.locator('[data-parameter-id="wallMaterial"][value="concrete"]')).toBeChecked();
  await expect(price).toHaveText("от 37 500 ₸");

  await page.locator('[data-parameter-id="wallMaterial"][value="monolith"] + label').click();
  await page.locator('[data-parameter-id="wallThickness"][value="large"] + label').click();
  await expect(price).toHaveText("от 46 000 ₸");

  const whatsappUrl = new URL(await whatsappLink.getAttribute("href"));
  expect(whatsappUrl.searchParams.get("phone")).toBe("77788833329");
  expect(whatsappUrl.searchParams.get("text")).toContain("Материал стены: Монолит");
  expect(whatsappUrl.searchParams.get("text")).toContain("Толщина стены: Более 50 см");
  expect(whatsappUrl.searchParams.get("text")).toContain("от 46 000 ₸");

  const defaultButtonStyle = await whatsappLink.evaluate((element) => {
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return { background: style.backgroundColor, color: style.color };
  });
  await whatsappLink.hover();
  const hoveredButtonStyle = await whatsappLink.evaluate((element) => {
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return { background: style.backgroundColor, color: style.color, opacity: style.opacity };
  });
  expect(hoveredButtonStyle.opacity).toBe("1");
  expect(hoveredButtonStyle.background).not.toBe(defaultButtonStyle.background);
  expect(
    getContrastRatio(defaultButtonStyle.color, defaultButtonStyle.background),
  ).toBeGreaterThanOrEqual(4.5);
  expect(
    getContrastRatio(hoveredButtonStyle.color, hoveredButtonStyle.background),
  ).toBeGreaterThanOrEqual(4.5);

  await secondHeroDot.click();
  await expect(secondHeroDot).toHaveAttribute("aria-current", "true");
  expect(browserErrors).toEqual([]);
});

test("keeps repeated calculator instances independent", async ({ page }) => {
  await page.goto("./");

  await page.locator("[data-calculator]").evaluate(async (firstRoot) => {
    const secondRoot = firstRoot.cloneNode(true);
    secondRoot.id = "second-calculator";
    firstRoot.after(secondRoot);

    const moduleUrl = new URL("src/scripts/main.js", firstRoot.ownerDocument.baseURI);
    const { initCalculator } = await import(moduleUrl.href);
    initCalculator(secondRoot, 1);
  });

  const calculators = page.locator("[data-calculator]");
  await expect(calculators).toHaveCount(2);
  const firstCalculator = calculators.nth(0);
  const secondCalculator = calculators.nth(1);

  await secondCalculator
    .locator('[data-parameter-id="wallMaterial"][value="monolith"] + label')
    .click();
  await secondCalculator
    .locator('[data-parameter-id="wallThickness"][value="large"] + label')
    .click();

  await expect(firstCalculator.locator("[data-price]")).toHaveText("от 35 000 ₸");
  await expect(secondCalculator.locator("[data-price]")).toHaveText("от 46 000 ₸");

  const radioNames = await page
    .locator("[data-calc-input]")
    .evaluateAll((inputs) => inputs.map((input) => input.name));
  expect(new Set(radioNames).size).toBe(4);
});
