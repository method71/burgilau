export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["dist/**", "node_modules/**"],
  rules: {
    "alpha-value-notation": "number",
    "color-function-alias-notation": null,
    "color-function-notation": "legacy",
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "media-feature-range-notation": "prefix",
    "property-no-vendor-prefix": null,
    "selector-class-pattern": null,
    "value-keyword-case": null,
  },
};
