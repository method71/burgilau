import assert from "node:assert/strict";
import test from "node:test";

import { calculatePrice, describeSelections, formatPrice } from "../../src/scripts/calculator.js";
import { getService } from "../../src/scripts/calculator/services/index.js";
import { priceFormatConfig } from "../../src/scripts/config.js";

const service = getService("airInlet");

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
    const actual = calculatePrice(service, {
      wallMaterial: material,
      wallThickness: thickness,
    });
    assert.equal(actual, expected, `${material} + ${thickness}`);
  });
});

test("rejects an unknown pricing option", () => {
  assert.throws(
    () => calculatePrice(service, { wallMaterial: "unknown", wallThickness: "small" }),
    {
      name: "RangeError",
      message: "Unknown wallMaterial option: unknown",
    },
  );
});

test("describes selections from reusable parameter metadata", () => {
  assert.deepEqual(
    describeSelections(service, { wallMaterial: "monolith", wallThickness: "large" }),
    [
      { label: "Материал стены", value: "Монолит" },
      { label: "Толщина стены", value: "Более 50 см" },
    ],
  );
});

test("formats the estimate for the configured locale", () => {
  assert.equal(formatPrice(40000, priceFormatConfig), "от 40 000 ₸");
});
