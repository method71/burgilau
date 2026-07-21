import assert from "node:assert/strict";
import test from "node:test";

import { calculatePrice, formatPrice } from "../../src/scripts/calculator.js";
import { priceConfig, priceFormatConfig } from "../../src/scripts/config.js";

const priceCases = [
  ["brick", "small", 35000],
  ["brick", "medium", 37500],
  ["brick", "large", 41000],
  ["concrete", "small", 37500],
  ["concrete", "medium", 40000],
  ["concrete", "large", 43500],
  ["monolith", "small", 40000],
  ["monolith", "medium", 42500],
  ["monolith", "large", 46000],
];

test("calculates every supported price combination", () => {
  priceCases.forEach(([material, thickness, expected]) => {
    const actual = calculatePrice(priceConfig, { material, thickness });
    assert.equal(actual, expected, `${material} + ${thickness}`);
  });
});

test("rejects an unknown pricing option", () => {
  assert.throws(() => calculatePrice(priceConfig, { material: "unknown", thickness: "small" }), {
    name: "RangeError",
    message: "Unknown material option: unknown",
  });
});

test("formats the estimate for the configured locale", () => {
  assert.equal(formatPrice(40000, priceFormatConfig), "от 40 000 ₸");
});
