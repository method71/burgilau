import assert from "node:assert/strict";
import test from "node:test";

import { resolveService } from "../../src/scripts/calculator/schema.js";

const parameterRegistry = {
  wallMaterial: {
    id: "wallMaterial",
    label: "Материал стены",
    options: [
      { id: "brick", label: "Кирпич", icon: "brick.webp" },
      { id: "concrete", label: "Бетон", icon: "concrete.webp" },
    ],
  },
  diameter: {
    id: "diameter",
    label: "Диаметр",
    options: [
      { id: "small", label: "110 мм", icon: "diameter-small.webp" },
      { id: "large", label: "160 мм", icon: "diameter-large.webp" },
    ],
  },
};

function createService(id, parameters) {
  return {
    id,
    title: id,
    whatsappIntro: `Заказ услуги ${id}`,
    basePrice: 10000,
    parameters,
  };
}

test("reuses parameter definitions with service-specific pricing", () => {
  const first = resolveService(
    createService("first", [
      {
        parameterId: "wallMaterial",
        defaultOptionId: "brick",
        modifiers: { brick: 0, concrete: 1000 },
      },
    ]),
    parameterRegistry,
  );
  const second = resolveService(
    createService("second", [
      {
        parameterId: "wallMaterial",
        defaultOptionId: "concrete",
        modifiers: { brick: 500, concrete: 2500 },
      },
      {
        parameterId: "diameter",
        defaultOptionId: "small",
        modifiers: { small: 0, large: 3000 },
      },
    ]),
    parameterRegistry,
  );

  assert.equal(first.parameters[0].options[1].label, "Бетон");
  assert.equal(first.parameters[0].options[1].priceModifier, 1000);
  assert.equal(second.parameters[0].options[1].priceModifier, 2500);
  assert.deepEqual(
    second.parameters.map(({ id }) => id),
    ["wallMaterial", "diameter"],
  );
});

test("allows a service to use a subset of shared options", () => {
  const service = resolveService(
    createService("limited", [
      {
        parameterId: "wallMaterial",
        optionIds: ["brick"],
        defaultOptionId: "brick",
        modifiers: { brick: 0 },
      },
    ]),
    parameterRegistry,
  );

  assert.deepEqual(
    service.parameters[0].options.map(({ id }) => id),
    ["brick"],
  );
});

test("rejects invalid service contracts", () => {
  assert.throws(
    () =>
      resolveService(
        createService("invalid", [
          {
            parameterId: "diameter",
            defaultOptionId: "small",
            modifiers: { small: 0 },
          },
        ]),
        parameterRegistry,
      ),
    {
      name: "TypeError",
      message: "Service invalid parameter diameter option large must have a numeric modifier",
    },
  );
});
