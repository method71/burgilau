# Calculator

Apply these rules when changing calculator configuration, pricing, parameters,
options, assets, services, schema, generated controls, calculation behavior, or
WhatsApp message and URL generation.

## Calculator model

- Keep reusable parameter definitions under
  `src/scripts/calculator/parameters/`. A definition owns its stable id, UI
  label, option ids, option labels, and icons; it must not contain prices.
- Register calculator option assets centrally in
  `src/scripts/calculator/icons.js`. Use explicit `new URL(..., import.meta.url)`
  entries so Vite validates and fingerprints the assets.
- Keep service-specific base prices, parameter order, allowed option subsets,
  defaults, modifiers, title, and WhatsApp introduction under
  `src/scripts/calculator/services/`.
- Reuse a parameter by referencing its `parameterId` from a service. Do not copy
  its labels, option metadata, or icons into the service configuration.
- Resolve and validate service configurations through
  `src/scripts/calculator/schema.js` before giving them to calculation or UI
  code. Invalid references, defaults, and modifiers must fail explicitly.
- Register production services in `src/scripts/calculator/services/index.js`
  and retrieve them by stable service id.

## Module boundaries

- Keep contact details and global price-format settings in
  `src/scripts/config.js`; keep service prices in the relevant service config.
- Keep calculation, selection description, and price formatting in
  `src/scripts/calculator.js`. These functions must be deterministic and must
  not access the DOM or browser globals.
- Keep calculator DOM generation and form state in
  `src/scripts/calculator-ui.js`. It consumes a resolved service and must not
  contain service-specific parameter names, labels, prices, or asset paths.
  Generated option images must include intrinsic dimensions, empty alt text
  when the adjacent label conveys the same meaning, and deferred decoding.
- Keep WhatsApp message and URL generation in `src/scripts/whatsapp.js`. Build
  parameter lines from resolved selection descriptions and query strings with
  `URLSearchParams`; do not concatenate pre-encoded text.
- Keep unrelated DOM behavior such as scrolling and the hero slider in
  `src/scripts/ui.js`.
- Keep `src/scripts/main.js` as the composition root. It resolves each
  `[data-calculator]` from its `data-service-id`, connects pure functions to the
  UI, and contains no service-specific business constants.

## UI/config contract

- HTML provides calculator hosts and output elements, not hard-coded parameter
  groups or options. Render fields into `[data-calculator-fields]`.
- Build configuration-driven controls with DOM APIs and `textContent`; do not
  interpolate configuration values through `innerHTML`.
- Treat service, parameter, and option ids as stable data contracts. Text labels
  are presentation and message content, not lookup keys.
- Scope DOM queries to the calculator root so multiple calculators can coexist
  on one page.
- Use `data-*` hooks for JavaScript-owned DOM contracts. CSS classes remain
  presentation-only.

## Extending calculators

- To add an option to a shared parameter, update its definition, centralized
  icon registry, every service that enables it, and relevant tests.
- To add a reusable parameter, create one definition and its icon group, then
  reference it from any number of services with service-specific modifiers.
- To add a service, create and register one service config. Reuse existing
  parameter ids and define only pricing, ordering, defaults, and restrictions
  that are specific to that service.
- Do not invent missing product prices, allowed combinations, labels, or assets;
  obtain them before registering a service in the production registry.

## Verification

- Keep `tests/unit/calculator.test.js` synchronized with every supported price
  combination and confirm that unknown options are rejected.
- Keep `tests/unit/calculator-schema.test.js` covering parameter reuse,
  service-specific prices, option subsets, additional parameters, and invalid
  service contracts.
- Keep `tests/unit/whatsapp.test.js` synchronized with the generic message
  contract; parse URLs and verify phone and decoded Cyrillic text through
  `searchParams`.
- Keep `tests/e2e/app.spec.js` focused on the main local user flow and repeated
  calculator isolation: generated controls, keyboard focus, WhatsApp links,
  hero controls, hover contrast, and browser errors.
- Follow `.agents/validation.md` for the commands required by the change.
