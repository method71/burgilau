import assert from "node:assert/strict";
import test from "node:test";

import { createWhatsAppMessage, createWhatsAppUrl } from "../../src/scripts/whatsapp.js";

test("creates a readable WhatsApp message", () => {
  const message = createWhatsAppMessage({
    material: "Монолит",
    thickness: "Более 50 см",
    formattedPrice: "от 46 000 ₸",
  });

  assert.equal(
    message,
    [
      "Здравствуйте! Хочу заказать установку приточного клапана.",
      "",
      "Материал стены: Монолит",
      "Толщина стены: Более 50 см",
      "Предварительная стоимость: от 46 000 ₸",
    ].join("\n"),
  );
});

test("encodes WhatsApp query parameters without losing Cyrillic text", () => {
  const message = "Материал стены: Кирпич\nСтоимость: от 35 000 ₸";
  const url = new URL(createWhatsAppUrl({ phone: "77788833329", message }));

  assert.equal(url.origin + url.pathname, "https://api.whatsapp.com/send");
  assert.equal(url.searchParams.get("phone"), "77788833329");
  assert.equal(url.searchParams.get("text"), message);
});
