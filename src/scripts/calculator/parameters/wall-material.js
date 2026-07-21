import { calculatorIcons } from "../icons.js";

export const wallMaterial = Object.freeze({
  id: "wallMaterial",
  label: "Материал стены",
  options: Object.freeze([
    Object.freeze({ id: "brick", label: "Кирпич", icon: calculatorIcons.wallMaterial.brick }),
    Object.freeze({
      id: "concrete",
      label: "Бетон",
      icon: calculatorIcons.wallMaterial.concrete,
    }),
    Object.freeze({
      id: "monolith",
      label: "Монолит",
      icon: calculatorIcons.wallMaterial.monolith,
    }),
  ]),
});
