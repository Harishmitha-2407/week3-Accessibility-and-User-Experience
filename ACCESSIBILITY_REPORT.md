# Week 3 - Accessibility Report: "The Quiet Web" blog

Files: `before/index.html` (baseline with common accessibility failures) and `after/` (remediated version).

## 1. Audit method
1. Manual code review of the baseline against WCAG 2.2 AA and the WAI-ARIA Authoring Practices.
2. Keyboard-only walkthrough (Tab, Shift+Tab, Enter, Space, Escape).
3. Contrast ratios calculated with the WCAG relative-luminance formula.
4. **To do before submitting:** run Lighthouse (Chrome DevTools > Lighthouse > Accessibility) and the WAVE extension on both `before/index.html` and `after/index.html`, then paste your scores into section 5. (Automated scores depend on your browser, so they are left for you to record.)

## 2. Issues found in the baseline

| # | Issue | WCAG criterion | Severity |
|---|---|---|---|
| 1 | No `lang` attribute on `<html>` | 3.1.1 Language of Page | High |
| 2 | Layout built from `<div>`s: no header, nav, main, footer, headings or lists | 1.3.1 Info and Relationships | High |
| 3 | Menu items are clickable `<div>`s, so they cannot be focused or activated by keyboard | 2.1.1 Keyboard, 4.1.2 Name, Role, Value | Critical |
| 4 | Buttons are `<div class="btn">` with `onclick` | 2.1.1, 4.1.2 | Critical |
| 5 | Text contrast: body 2.85:1, headings 1.92:1, links 2.27:1, button 1.69:1 (need 4.5:1) | 1.4.3 Contrast (Minimum) | High |
| 6 | Inputs have only a placeholder, no `<label>` | 3.3.2 Labels or Instructions, 1.3.1 | High |
| 7 | `outline: none` removes the focus indicator on inputs | 2.4.7 Focus Visible | High |
| 8 | Image without `alt` text | 1.1.1 Non-text Content | High |
| 9 | Links say "click here" | 2.4.4 Link Purpose | Medium |
| 10 | No skip link to bypass the menu | 2.4.1 Bypass Blocks | Medium |
| 11 | `alert()` used for feedback; no accessible status messages or error handling | 3.3.1 Error Identification, 4.1.3 | Medium |
| 12 | No page title describing the content ("Blog") | 2.4.2 Page Titled | Low |

## 3. Improvements made and why they help

**Semantic structure (1.3.1, 2.4.1, 2.4.6).** The page uses `header`, `nav`, `main`, `section`, `article`, `footer`, a single `h1` and a logical h2/h3 outline. Screen-reader users can jump between landmarks and headings instead of listening to everything. A skip link appears on first Tab press and moves focus to `<main>`.

**Real controls with names (4.1.2).** Every clickable thing is now a `<button>` or `<a>`. Icon-only buttons contain visually hidden text (`.sr-only`) so their purpose is announced. The menu button uses `aria-expanded` and `aria-controls`; the theme button uses `aria-pressed`. `aria-current="page"` marks the current page in navigation.

**Keyboard support (2.1.1, 2.1.2, 2.4.3).** Everything is reachable in DOM order with Tab. Escape closes the mobile menu and returns focus to its button. There are no keyboard traps. Focus moves logically: after form errors it lands in the error summary, and links in the summary move focus to the offending field.

**Visible focus (2.4.7).** A 3px amber outline with offset is applied via `:focus-visible` to all controls in both themes.

**Colour and contrast (1.4.3, 1.4.11, 1.4.1).** Text is at least 6.7:1 (body 17.4:1). Input borders are 4.8:1 (needs 3:1). Links are underlined so colour is not the only cue, and errors use an icon plus text. A dark theme is provided; it also passes (lowest text ratio 9.9:1). The theme follows `prefers-color-scheme` and remembers the user's choice.

| Pair | Ratio | Requirement |
|---|---|---|
| Body text #1a1a1a on #ffffff | 17.4:1 | 4.5:1 |
| Muted text #4b5563 on #ffffff | 7.56:1 | 4.5:1 |
| Links #1d4ed8 on #ffffff | 6.7:1 | 4.5:1 |
| Button text #ffffff on #1e3a8a | 10.36:1 | 4.5:1 |
| Input border #6b7280 on #ffffff | 4.83:1 | 3:1 |
| Error text #b91c1c on #ffffff | 6.47:1 | 4.5:1 |
| Dark theme text #f1f5f9 on #0f172a | 16.3:1 | 4.5:1 |

**Forms (3.3.1, 3.3.2, 3.3.3, 4.1.3).** Every input has a visible `<label>`, `autocomplete` values and hint text linked with `aria-describedby`. Validation is custom (`novalidate`): each field gets an inline message and `aria-invalid`, and an error summary with `role="alert"` explains what is wrong and how to fix it.

**Dynamic content (4.1.3).** Search results count, "more posts loaded" and the subscribe confirmation are announced through polite `role="status"` live regions, without moving focus.

**Images (1.1.1).** Decorative-looking SVG thumbnails are given `role="img"` with a `<title>` that describes them.

**Other.** `lang="en"`, descriptive `<title>`, `<time datetime>` for dates, 44px minimum touch targets (2.5.8), relative units so text scales with zoom (1.4.4), `prefers-reduced-motion` and forced-colors support, responsive layout with no horizontal scroll at 320px (1.4.10).

## 4. Testing performed
- Keyboard only: menu, theme toggle, search, load more, and the form can all be completed without a mouse.
- Zoom to 200% and 320px width: content reflows, nothing is clipped.
- Empty form submit: summary appears, focus moves to it, links jump to fields.
- Recommended: test with NVDA (Windows) or VoiceOver (macOS/iOS) to confirm announcements.

## 5. Automated results (fill in)
| Tool | Before | After |
|---|---|---|
| Lighthouse Accessibility | ___ | ___ |
| WAVE errors / contrast errors | ___ | ___ |

## 6. Limitations
Automated tools detect only part of the possible issues. This project does not cover captions or audio description because it has no media, and it was not tested with real assistive-technology users.
