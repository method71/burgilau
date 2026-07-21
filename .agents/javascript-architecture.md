# JavaScript Architecture

Apply these rules when changing application JavaScript, pricing, calculator
behavior, or WhatsApp integration.

## Module boundaries

- Keep prices, price-format settings, and contact details in
  `src/scripts/config.js`. Do not duplicate monetary amounts or contacts in
  HTML or UI modules.
- Keep calculation and price-formatting functions in
  `src/scripts/calculator.js`. They must be deterministic and must not access
  the DOM or browser globals.
- Keep WhatsApp message and URL generation in `src/scripts/whatsapp.js`. Build
  query strings with `URLSearchParams`; do not concatenate pre-encoded text.
- Keep DOM queries, event listeners, scrolling, and slider behavior in
  `src/scripts/ui.js`.
- Keep `src/scripts/main.js` as the composition root: read UI state, call pure
  functions, and render their results. Do not add component implementations
  or business constants there.

## UI/config contract

- Calculator radio values are stable option keys that correspond to entries in
  `priceConfig.modifiers`; they are not prices.
- Use `data-*` hooks for JavaScript-owned DOM contracts, including option-label
  reads. CSS classes remain presentation-only.
- Adding or renaming a calculator group or option requires synchronized changes
  to the HTML key, `priceConfig`, and relevant calculation tests.

## Verification

- Keep `tests/unit/calculator.test.js` synchronized with every supported price
  combination and confirm that unknown options are rejected.
- Keep `tests/unit/whatsapp.test.js` synchronized with the message contract;
  parse URLs and verify phone and decoded Cyrillic text through `searchParams`.
- Keep `tests/e2e/app.spec.js` focused on the main local user flow: calculator
  updates, the generated WhatsApp link, hero controls, and browser errors.
- Follow `.agents/validation.md` for the commands required by the change.
