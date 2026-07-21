export const airInletServiceConfig = Object.freeze({
  id: "airInlet",
  title: "Установка приточного клапана",
  whatsappIntro: "Здравствуйте! Хочу заказать установку приточного клапана.",
  basePrice: 35000,
  parameters: Object.freeze([
    Object.freeze({
      parameterId: "wallMaterial",
      defaultOptionId: "brick",
      modifiers: Object.freeze({ brick: 0, concrete: 2500, monolith: 5000 }),
    }),
    Object.freeze({
      parameterId: "wallThickness",
      defaultOptionId: "small",
      modifiers: Object.freeze({ small: 0, medium: 2500, large: 6000 }),
    }),
  ]),
});
