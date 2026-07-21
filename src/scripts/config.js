export const priceConfig = Object.freeze({
  base: 35000,
  modifiers: Object.freeze({
    material: Object.freeze({
      brick: 0,
      concrete: 2500,
      monolith: 5000,
    }),
    thickness: Object.freeze({
      small: 0,
      medium: 2500,
      large: 6000,
    }),
  }),
});

export const contactConfig = Object.freeze({
  whatsappPhone: "77788833329",
});

export const priceFormatConfig = Object.freeze({
  locale: "ru-RU",
  prefix: "от",
  suffix: "₸",
});
