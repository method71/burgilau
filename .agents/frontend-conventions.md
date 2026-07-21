# Frontend Conventions

Apply these conventions when changing HTML, CSS/SCSS, or JavaScript that
interacts with the DOM.

- Name CSS classes according to BEM.
- Use BEM classes for presentation, not as JavaScript hooks.
- Select elements from JavaScript through `data-*` attributes rather than CSS
  classes.
- Name classes for JavaScript-managed states with the `is-*` prefix.
- Prefer the native `:checked` selector for radio-button states instead of
  duplicating that state in JavaScript.
