# Frontend Conventions

Apply these conventions when changing HTML, CSS/SCSS, or JavaScript that
interacts with the DOM.

## Project naming

- Use the BEM blocks `header`, `hero`, `calc`, `option-card`, `estimate`, and
  `company-card` for the existing page components.
- Keep the established short names `header` and `calc`; do not reintroduce
  `site-header` or `calculator` prefixes.

## DOM and styling

- Name CSS classes according to BEM.
- Use BEM classes for presentation, not as JavaScript hooks.
- Select elements from JavaScript through `data-*` attributes rather than CSS
  classes.
- Scope component queries to their root element so repeated component instances
  do not share controls or output state.
- Build configuration-driven calculator controls with DOM APIs and
  `textContent`; do not interpolate configuration values through `innerHTML`.
- Name classes for JavaScript-managed states with the `is-*` prefix.
- Prefer the native `:checked` selector for radio-button states instead of
  duplicating that state in JavaScript.
- When a native radio is visually hidden, expose its `:focus` state on the
  associated visible label so keyboard focus is never lost.
- Treat the hero carousel as one composite Tab stop. Keep pagination dots out
  of sequential focus, switch slides with arrow/Home/End keys when the carousel
  itself is focused, keep only the active slide CTA tabbable, and announce the
  active slide through a polite live region.
- Define themeable design tokens as CSS custom properties in
  `src/scss/abstracts/_variables.scss` and consume them with `var(...)`.
  Reserve Sass variables for compile-time constructs that cannot use custom
  properties, such as media-query breakpoints.
- When deriving interactive colors with `color-mix()`, declare a custom-property
  fallback immediately before it for browsers that do not support color mixing.
- Keep normal and interactive text/background combinations at a WCAG AA
  contrast ratio of at least 4.5:1. Use `--color-focus` for the shared focus
  indicator and keep it themeable.
- Follow `.agents/validation.md` for automated and visual checks required by
  frontend changes.
