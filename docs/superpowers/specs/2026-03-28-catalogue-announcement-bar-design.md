# Catalogue Announcement Bar Design

## Goal

Add a header announcement bar to the catalogue application that matches the visual style of the `kauthuk-web` website announcement bar.

The catalogue should:

- Reuse the same visual language as `kauthuk-web`
- Keep the text content locally owned in the catalogue app
- Preserve the current catalogue header structure and behavior

## Scope

This design covers only the catalogue announcement bar.

In scope:

- Add an announcement bar above the existing catalogue header
- Recreate the gold gradient and marquee-style motion from `kauthuk-web`
- Keep the bar frontend-only
- Keep announcement text locally configurable in the catalogue header component

Out of scope:

- Sharing announcement content dynamically with `kauthuk-web`
- Backend/API changes
- Rebuilding the rest of the catalogue header to match `kauthuk-web`

## Current Context

The catalogue header currently starts directly with the brown main header bar.

The referenced `kauthuk-web` app includes a distinct announcement bar:

- Gold gradient background
- White text
- Slim vertical height
- Continuous marquee movement
- Sits above the main brown header

The request is to bring that same visual style into the catalogue, without copying the exact text content contract from the other app.

## Recommended Approach

Add a catalogue-only announcement bar above the current header and recreate the `kauthuk-web` styling with local catalogue messages.

Why this approach:

- Matches the requested look
- Avoids tight coupling to another app's content
- Keeps the change isolated to catalogue frontend code
- Minimizes risk to current category nav, search, and logo behavior

## Alternatives Considered

### 1. Copy the old app announcement bar markup exactly

Pros:

- Fastest route to a close visual match
- Minimal design interpretation

Cons:

- Carries over app-specific structure unnecessarily
- Harder to keep cleanly bounded in the catalogue codebase

### 2. Recreate the same visual system with local catalogue markup

This is the recommended option.

Pros:

- Same look with cleaner ownership
- Easier to maintain in the catalogue app
- Keeps message content fully local

Cons:

- Requires minor interpretation rather than literal copy

### 3. Add a static non-moving top strip with similar colors

Pros:

- Simplest implementation

Cons:

- Misses the marquee behavior that defines the original bar

## Architecture

The announcement bar should be a frontend-only layer inside the catalogue header.

Implementation boundaries:

- `resources/js/catalogue/components/Header.jsx` owns the message list and markup
- `resources/css/catalogue.css` owns the visual styling and marquee animation

No backend changes are required.

The catalogue header remains split into:

1. Announcement bar
2. Existing main header section

This preserves current sticky behavior while layering the new visual element above the existing header.

## Components

### Catalogue Header

Update `resources/js/catalogue/components/Header.jsx`.

Requirements:

- Render an announcement bar above the current header body
- Keep the announcement messages in a local array
- Render the array in a single marquee track
- Leave the current logo, category nav, and search sections unchanged below it

If the local message array is empty, the announcement bar should not render.

### Catalogue Styles

Update `resources/css/catalogue.css`.

Requirements:

- Recreate the gold gradient feel from `kauthuk-web`
- Use white text
- Keep the bar slim
- Hide overflow
- Use continuous horizontal marquee motion
- Preserve sticky header usability

The overall styling should visually align with:

- `header-announcement-bar`
- `header-marquee`
- `header-marquee-content`

from the `kauthuk-web` app, while living under the catalogue stylesheet.

## Data Flow

No backend data flow changes are needed.

Frontend flow:

1. Catalogue header loads
2. Header checks local announcement messages
3. If messages exist, the announcement bar renders
4. Messages are placed in the marquee track
5. Main header renders below as before

## Behavior Rules

The announcement bar should:

- Appear above the existing brown header
- Scroll continuously from right to left
- Stay single-line
- Not change the existing category/search interactions
- Not introduce layout jumps when users scroll

## Error Handling

Expected behavior:

- Empty message arrays do not render an empty strip
- Long text stays on one line and scrolls naturally
- Overflow remains clipped cleanly
- Sticky behavior of the full header remains intact

## Testing Strategy

### Visual checks

Verify:

- Announcement bar renders above the header
- Gold gradient style matches the intended visual direction
- Text remains white and legible
- Marquee animation works smoothly

### Layout checks

Verify:

- Existing header structure below remains unchanged
- Category buttons still align correctly
- Search input still behaves normally
- Mobile layout still works

### Behavior checks

Verify:

- Sticky header still works on scroll
- Empty announcement arrays suppress the bar cleanly

## Implementation Notes

The safest implementation order is:

1. Add a local announcement message array in the catalogue header
2. Render the new announcement bar above the current header body
3. Add the gold gradient and marquee styles in catalogue CSS
4. Verify the main header below remains unchanged
5. Run build verification

## Success Criteria

The feature is successful when:

- The catalogue has an announcement bar above the header
- The bar matches the visual style of the `kauthuk-web` announcement bar
- The text is locally controlled in the catalogue app
- The existing catalogue header layout and behavior remain intact
