# Catalogue Header Match Kauthuk Web Design

## Goal

Make the desktop header on the product catalogue page visually match the header used in `kauthuk-web`, while preserving the current catalogue-specific filtering behavior.

## Scope

Included:
- Match the desktop catalogue header layout to the `kauthuk-web` header
- Match desktop header colors, fonts, sizing, spacing, and hover states
- Keep category icons in the header navigation
- Keep the existing catalogue category filter behavior
- Keep the existing catalogue search behavior

Excluded:
- Mobile header redesign
- Mobile menu toggle behavior
- Search popup behavior from `kauthuk-web`
- Route-based category navigation
- Changes to sidebar, product cards, footer, or product API behavior

## Reference Source

This design is based on the existing desktop header implementation in:
- `/Users/anoopjoy8/Documents/Kauthuk/kauthuk-web/resources/js/Pages/Home.jsx`
- `/Users/anoopjoy8/Documents/Kauthuk/kauthuk-web/resources/css/app.css`

Key reference traits:
- `Poppins` as the primary header typeface
- `Playfair Display` available for branded serif emphasis
- brown primary bar using `#6b2f1a`
- gold announcement gradient using `#b38d4a` to `#d4a762`
- two-tier header structure
- centered navigation with compact uppercase category items
- right-aligned search control area

## Current State

The catalogue header in `kauthukpos2` already uses a two-tier structure and category icons, but it diverges from `kauthuk-web` in important visual details:
- header typography currently uses `Exo` instead of `Poppins`
- the current search is inline and styled differently from the reference desktop shell
- spacing, proportions, and desktop alignment differ from `kauthuk-web`
- the current CSS contains header-specific rules that are close in concept but not yet a faithful desktop match

The catalogue page also has behavior that must remain intact:
- category buttons filter the visible catalogue in place
- search updates the current product listing in place

## Recommended Approach

Rework the desktop catalogue header markup and CSS so it mirrors the `kauthuk-web` desktop header structure and tokens as closely as possible, while keeping the catalogue’s existing React state handlers.

This is the right balance because:
- it produces the closest visual match on desktop
- it avoids importing homepage-only behaviors such as popup search or route navigation
- it keeps the existing catalogue logic simple and local

## Layout Design

The desktop catalogue header should use the same top-level composition as `kauthuk-web`:

1. Announcement strip
   - gold gradient background
   - white marquee text
   - same compact vertical spacing and continuous horizontal scroll rhythm

2. Main header bar
   - dark brown background
   - left logo block
   - centered category navigation
   - right search section

3. Width and spacing
   - use the same desktop content width rhythm as the reference header
   - match logo scale, nav gap, nav item padding, and minimum bar height as closely as practical

The desktop header should remain sticky, matching the current catalogue behavior and the reference header feel.

## Typography And Color

Desktop header visual tokens should align with `kauthuk-web`:

- Primary font: `Poppins`
- Serif accent availability: `Playfair Display`
- Brown: `#6b2f1a`
- Gold: `#b38d4a`
- Gold light: `#d4a762`
- Cream and muted neutrals may be reused only where needed for search styling

Desktop header text treatment:
- category labels remain uppercase
- category labels use compact bold sizing similar to the reference
- announcement text remains small and light
- logo sizing should match the reference header proportions

These typography changes should be scoped to the catalogue header and its immediate controls, not the entire catalogue page.

## Behavior Mapping

The desktop header should look like `kauthuk-web`, but behavior remains catalogue-specific:

- Clicking a category item:
  - does not navigate
  - calls the existing category selection handler
  - updates the visible product list in place

- Using search:
  - does not open the `kauthuk-web` popup search
  - keeps the existing inline search interaction
  - updates the visible product list in place

- Active category state:
  - should use the catalogue’s existing selected state
  - should be styled with a desktop active treatment that fits the reference palette

## Category Icons

The recently added uploaded category icons remain part of the desktop header.

Requirements:
- keep icons next to category labels in desktop nav items
- size them to the same visual weight as the reference header’s icon treatment
- use stored uploaded icons when present
- if an icon is missing, the nav item should still render cleanly without layout breakage

This preserves the newer catalogue feature while still matching the reference style direction.

## Implementation Boundaries

Expected files to change:
- `resources/js/catalogue/components/Header.jsx`
- `resources/css/catalogue.css`
- `resources/views/catalogue.blade.php`

Potentially unchanged unless required by implementation:
- `resources/js/catalogue/Main.jsx`
- category API payloads
- sidebar and product list components

Implementation rules:
- desktop header should be updated to match `kauthuk-web`
- mobile-specific catalogue behavior and layout should remain unchanged
- do not introduce popup search state unless it becomes necessary for desktop-only visual parity
- prefer adapting the existing catalogue component over copying unrelated homepage logic wholesale

## Responsive Constraint

This work is desktop-only.

Explicit requirement:
- the mobile catalogue header should remain functionally and visually as it is today unless a desktop change accidentally affects it, in which case the implementation must isolate the desktop styles properly

## Verification

Manual verification should confirm:
- desktop header colors match the `kauthuk-web` brown and gold palette
- desktop header font stack matches the `kauthuk-web` feel, using `Poppins` instead of `Exo`
- logo size and position match the reference proportions
- category nav spacing, uppercase text, icon sizing, and hover feel match the reference
- inline search remains functional
- category filtering remains functional
- mobile catalogue layout is not unintentionally changed

## Risks And Mitigations

Risk: a literal copy of `kauthuk-web` header behavior could break catalogue filtering.
Mitigation: copy the desktop visual structure and tokens, but preserve existing React handlers.

Risk: desktop CSS changes could leak into mobile.
Mitigation: isolate the matching work inside desktop-specific selectors and preserve current mobile breakpoints.

Risk: font changes could unintentionally restyle the full catalogue page.
Mitigation: scope font-family changes to header-specific selectors and update the blade font include only as needed.

## Success Criteria

This work is successful when:
- the desktop catalogue header is visually recognizable as the `kauthuk-web` header
- category filtering still works without navigation
- search still filters products inline
- uploaded category icons remain visible in desktop nav items
- mobile catalogue behavior remains unchanged
