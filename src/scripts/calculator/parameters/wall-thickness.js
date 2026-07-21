import { calculatorIcons } from "../icons.js";

export const wallThickness = Object.freeze({
  id: "wallThickness",
  label: "Толщина стены",
  options: Object.freeze([
    Object.freeze({ id: "small", label: "До 30 см", icon: calculatorIcons.wallThickness.small }),
    Object.freeze({
      id: "medium",
      label: "30–50 см",
      icon: calculatorIcons.wallThickness.medium,
    }),
    Object.freeze({
      id: "large",
      label: "Более 50 см",
      icon: calculatorIcons.wallThickness.large,
    }),
  ]),
});
