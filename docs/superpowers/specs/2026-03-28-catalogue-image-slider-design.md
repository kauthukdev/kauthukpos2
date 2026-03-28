# Catalogue Image Slider Design

## Goal

Update the public catalogue in `kauthukpos2` so each product card can show all available product images using the existing left/right arrow UI.

The catalogue should:

- Use the current standalone-style card layout
- Keep the current arrow-and-dot visual structure
- Switch images when users click the arrows
- Support the product's primary image plus all additional gallery images

## Scope

This design covers only the catalogue product image display behavior.

In scope:

- Extend catalogue API responses to include all ordered product images
- Make the existing catalogue product-card arrows functional
- Use the current dot indicators to reflect the active image
- Preserve placeholder behavior for products with no images

Out of scope:

- Redesigning the catalogue card layout
- Adding thumbnail strips
- Changing how product images are managed in the POS product edit/create forms
- Adding autoplay, swipe support, or fullscreen gallery behavior

## Current Context

The catalogue currently renders one image per product card using `image_url`.

Current state:

- The card already shows left and right arrow buttons
- The card already shows dot indicators
- Those controls are visual only and do not change the image
- The backend currently returns only one image URL per product

The product domain now supports:

- One primary image on `products.image`
- Multiple additional gallery images in `product_images`

The catalogue should now consume that full image set.

## Recommended Approach

Keep the existing catalogue card layout and turn the current arrow UI into a real in-card image slider driven by backend-provided ordered image arrays.

Why this approach:

- It matches the existing UI the user already approved
- It avoids unnecessary catalogue layout changes
- It fits the current visual affordances already on the page
- It keeps image ordering logic on the backend where the data already exists

## Alternatives Considered

### 1. Thumbnails plus selected main image

Pros:

- Clear image navigation
- Easier direct access to a specific image

Cons:

- Changes the current catalogue look significantly
- Adds more visual density to each product card

### 2. Show all images at once in a grid or stack

Pros:

- Simple rendering logic
- No interactive state needed

Cons:

- Breaks the current card composition
- Makes the catalogue page much longer and visually noisy

### 3. Keep current arrows and make them functional

This is the recommended option.

Pros:

- Smallest visual change
- Closest match to the current catalogue design
- Natural fit for the existing product card structure

Cons:

- Users move sequentially rather than jumping directly to an image
- Requires per-card state management

## Architecture

The catalogue image slider should be driven by a normalized ordered image array returned per product.

Each product returned by the catalogue API should include:

- Existing product metadata
- An `images` array in display order

Ordering rules:

1. Primary image from `products.image` first, if present
2. Gallery images from `product_images` next, ordered by `sort_order`

This keeps the frontend simple:

- It only consumes a ready-to-render ordered image array
- It does not need to understand product image storage rules

## Components

### Catalogue API

Update the catalogue product response in `app/Http/Controllers/Api/CatalogueController.php`.

Requirements:

- Eager-load gallery images
- Build an `images` array for each product
- Preserve current `image_url` if needed for backward compatibility during transition, or replace it cleanly if the product card is updated in the same implementation
- Ensure array order is stable

Suggested image entry shape:

- `url`
- `source` (optional, for clarity: `primary` or `gallery`)
- `sort_order` (optional if useful for debugging or tests)

At minimum, the frontend needs ordered URLs.

### Catalogue Product Card

Update `resources/js/catalogue/components/ProductCard.jsx`.

Requirements:

- Maintain a per-card `currentImageIndex`
- Render the current image from `product.images[currentImageIndex]`
- Move left/right when arrows are clicked
- Keep the current dot indicators in sync with active image index
- Fall back to the placeholder image if the product has no valid images

Arrow behavior:

- Left arrow moves to previous image
- Right arrow moves to next image
- Behavior can either stop at the ends or wrap around

Recommended behavior:

- Wrap around from first to last and last to first

Reason:

- Better use of the current slider-like UI
- Avoids dead-end navigation

### Dot indicators

The current dots should represent the product's image count.

Requirements:

- Active dot reflects `currentImageIndex`
- Dot count matches number of images
- If a product has one image, show one active dot only

## Data Flow

### Backend flow

1. Catalogue API queries active products
2. API eager-loads active category and gallery images
3. API builds ordered image arrays per product
4. API returns product payload including `images`

### Frontend flow

1. Product card receives product with `images`
2. Card initializes local image index to `0`
3. Card renders the first image
4. User clicks left/right arrow
5. Card updates local image index
6. Card re-renders the next/previous image and active dot

## Fallback Rules

The slider must degrade safely.

Rules:

- If primary image is missing but gallery images exist, use the first gallery image
- If no images exist, use the existing placeholder fallback
- If an image URL fails to load in the browser, the component should still have a fallback path available
- Products with one image should still render correctly without broken navigation behavior

## Error Handling

Expected behavior:

- Missing gallery images must not break the whole product card
- Products with incomplete image data must still render title, price, and stock details
- Products with no images must still render the existing placeholder
- Image ordering must remain deterministic and repeatable

## Testing Strategy

### API tests

Verify:

- Product responses include ordered `images` arrays
- Products with only a primary image return one image entry
- Products with primary plus gallery images return full ordered arrays
- Products with no images return an empty image array or equivalent consistent structure

### Frontend behavior tests

Verify:

- Product card displays the first image initially
- Right arrow advances to the next image
- Left arrow returns to the previous image
- Dot indicators track the active image
- Placeholder is shown when there are no images

### Regression tests

Verify:

- Existing catalogue list rendering still works for products with one image only
- Catalogue pricing, stock, and search/filter behavior remain unchanged

## Implementation Notes

The safest implementation order is:

1. Update catalogue API to include ordered image arrays
2. Add or update tests for catalogue image payloads
3. Update product card to render from `images`
4. Connect arrow and dot behavior
5. Run catalogue regression verification

## Success Criteria

The feature is successful when:

- Catalogue product cards can display all product images
- Clicking the existing arrows changes the displayed image
- Dots reflect the current image correctly
- Products with only one image still work
- Products with no images still show the placeholder
- The catalogue layout remains visually consistent with the current standalone-style design
