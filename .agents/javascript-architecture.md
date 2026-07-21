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

- For pricing changes, verify every supported option combination and confirm
  that an unknown option is rejected rather than silently priced.
- For WhatsApp changes, parse the generated URL and verify the phone and the
  decoded Cyrillic message through `searchParams`.
- For UI changes, run the production build and exercise calculator updates,
  hero controls, and the generated WhatsApp link in a browser.
