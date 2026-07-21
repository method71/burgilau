import { wallMaterial } from "./wall-material.js";
import { wallThickness } from "./wall-thickness.js";

export const parameterRegistry = Object.freeze({
  [wallMaterial.id]: wallMaterial,
  [wallThickness.id]: wallThickness,
});
