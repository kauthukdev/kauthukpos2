# Catalogue Visible Header Match Design

## Goal

Make the catalogue application header visually match the reference header from `/Users/anoopjoy8/Documents/Kauthuk/kauthuk/OldWebsite/kauthuk/resources/views/front/layout.blade.php` for visible desktop presentation only.

The target match includes:

- announcement bar colors, height, and marquee feel
- main header brown background and white foreground treatment
- logo sizing and placement
- navigation typography, spacing, casing, and icon alignment
- search area visual styling

The target match explicitly excludes:

- dropdown menus
- account, cart, blog, and currency controls
- mobile drawer behavior
- legacy search popup behavior
- any new backend or data-loading behavior

## Current Context

The catalogue header currently lives in `/Users/anoopjoy8/Documents/Kauthuk/kauthukpos2/resources/js/catalogue/components/Header.jsx` and is styled primarily through `/Users/anoopjoy8/Documents/Kauthuk/kauthukpos2/resources/css/catalogue.css`.

The current component already renders:

- announcement messages
- logo
- filtered category navigation
- search input bound to catalogue state

This means the work is a visual and structural alignment task, not a feature expansion.

## Recommended Approach

Rebuild the catalogue header markup so its visible layout follows the reference header composition while preserving the existing catalogue interactions.

This approach is preferred over a CSS-only reskin because the current header structure does not match the reference closely enough to achieve an exact visual result through styling alone. It is also preferred over a full legacy recreation because the user only requested the visible header, not the old site behavior.

## Design

### Header Structure

Keep the two-tier layout:

- top announcement bar with gold gradient and scrolling content
- main brown header bar with logo, category navigation, and search area

The catalogue component will continue rendering only the elements already relevant to the catalogue experience. The right-side utility controls from the legacy site will not be introduced.

### Logo Area

Adjust the logo block to match the reference header proportions:

- taller logo presentation than the current catalogue version
- no image inversion filter
- spacing that leaves a clear visual break before navigation

### Navigation Area

Update the category navigation to visually mirror the reference:

- uppercase labels
- bold compact type
- tighter horizontal padding
- white icon and text treatment on brown background
- subtle hover background rather than gold active emphasis

Category filtering logic remains unchanged. The same catalogue categories will still drive the rendered items and selection behavior.

### Search Area

Restyle the existing search UI to resemble the reference header rather than the current inline dark input.

Visible match requirements:

- compact search field geometry
- reference-aligned border radius
- light input surface against the dark header
- icon placement consistent with the reference header rhythm

Behavior remains the same: typing updates the catalogue search state directly.

### Typography and Color

Adopt the reference visual language in the catalogue stylesheet:

- body and header typography should move away from the current default Inter presentation
- header labels should use a bold compact style similar to the reference
- brown base color should align to `#6B2F1A`
- gold announcement treatment should align to the reference gradient

Only the catalogue header styling will be changed unless a shared token update is necessary for consistency.

## Files To Change

- `/Users/anoopjoy8/Documents/Kauthuk/kauthukpos2/resources/js/catalogue/components/Header.jsx`
- `/Users/anoopjoy8/Documents/Kauthuk/kauthukpos2/resources/css/catalogue.css`

## Testing

Manual verification is sufficient for this task:

- confirm announcement bar visually matches reference tone and height
- confirm brown main header bar matches reference color
- confirm logo appears without inversion and at the intended size
- confirm navigation spacing, weight, and hover state match the reference closely
- confirm search input still updates catalogue filtering
- confirm desktop layout remains stable and mobile layout does not break

## Risks And Constraints

- The catalogue app does not have the same header utility items as the reference site, so the match is limited to shared visible elements.
- Exact font parity depends on whether the same fonts are already available in the catalogue app. If not, the closest existing available stack will be used unless the font is already present or can be safely imported through existing frontend tooling.
- The current category names differ slightly from the reference site naming, so the visual match will focus on presentation rather than identical labels.

## Out Of Scope

- recreating legacy dropdown panels
- reproducing legacy mobile navigation interactions
- changing catalogue routing or filtering logic
- importing unrelated old-site header features
