# Catalogue Image Frame Design

## Goal

Make catalogue product images display within a consistent visual size even when users upload source images with different dimensions.

The catalogue should:

- Keep the current slider behavior
- Keep the full image visible
- Use a uniform fixed image frame across products
- Preserve the current standalone-style catalogue design

## Scope

This design covers display-time image sizing in the public catalogue only.

In scope:

- Add a fixed-size image frame in catalogue product cards
- Keep images fully visible with `object-contain`
- Ensure placeholders use the same frame
- Preserve slider controls and card layout consistency

Out of scope:

- Upload-time image resizing or cropping
- Permanent image transformation in storage
- POS image layout changes
- Backend API changes

## Current Context

The catalogue now supports multiple images per product through the slider logic, but the displayed image dimensions still depend on each uploaded file's aspect ratio and intrinsic size.

Current behavior:

- The slider changes images correctly
- Images use `object-contain`
- Product cards can still look visually inconsistent because the visible image region does not have a strict normalized frame

This leads to uneven visual weight across products when uploaded images vary.

## Recommended Approach

Normalize image display at render time only by introducing a fixed-size image frame in the catalogue product card and keeping `object-contain` inside it.

Why this approach:

- It standardizes layout immediately
- It does not crop products
- It avoids risky storage-side image processing
- It works with portrait, landscape, and square uploads

## Alternatives Considered

### 1. Fixed frame with `object-contain`

This is the recommended option.

Pros:

- Entire product remains visible
- Minimal risk
- No backend changes needed

Cons:

- Some images will show empty surrounding space

### 2. Fixed frame with `object-cover`

Pros:

- Very uniform visual fill
- Stronger “editorial” look

Cons:

- Crops product details
- Risk of hiding important item features

### 3. Upload-time resizing/cropping

Pros:

- Strong long-term media consistency
- Smaller rendered assets possible later

Cons:

- Larger backend change
- Harder to reverse if crops are wrong
- Unnecessary for the current goal

## Architecture

Image normalization should remain a frontend presentation concern.

Backend responsibilities stay unchanged:

- Provide image URLs
- Preserve image order for the slider

Frontend responsibilities:

- Render every active image inside the same fixed-size viewport
- Center the image
- Keep full visibility with `object-contain`
- Keep arrows and dots aligned regardless of source image shape

This keeps the solution isolated to the catalogue UI without affecting storage or upload flows.

## Components

### Catalogue Product Card

Update `resources/js/catalogue/components/ProductCard.jsx`.

Requirements:

- Wrap the active image in a fixed-size image stage
- Use a consistent height and width across products
- Keep the image centered
- Preserve arrow positioning relative to the fixed stage
- Preserve the dot indicator placement relative to the fixed stage

Recommended rendering behavior:

- Outer stage defines visual size
- Inner image uses `object-contain`
- Stage uses consistent padding and neutral background

### Catalogue Styles

Update `resources/css/catalogue.css`.

Requirements:

- Add one or more reusable classes for the catalogue image frame
- Define desktop and mobile sizes explicitly
- Ensure placeholder content uses the exact same frame
- Use subtle background treatment so transparent or oddly shaped images still sit cleanly in the card

## Data Flow

No backend data flow changes are required.

Frontend flow remains:

1. Product card receives ordered image list
2. Slider chooses active image
3. Active image is rendered inside the fixed frame
4. Frame size stays the same as users navigate between images

## Sizing Rules

The fixed image frame should:

- Be visually consistent across all product cards
- Be responsive across mobile and desktop
- Be large enough to showcase product detail
- Not cause layout jumps between images

Recommended behavior:

- Use a fixed minimum height on mobile
- Use a larger fixed height on desktop
- Let width follow the card layout while height remains stable

## Placeholder Behavior

Products without images should render the placeholder inside the same fixed frame.

Requirements:

- Placeholder occupies the exact same image stage
- Placeholder does not collapse card height
- Placeholder keeps arrows and dots aligned the same way as real images

## Error Handling

Expected behavior:

- Very tall images remain fully visible
- Very wide images remain fully visible
- Small images stay centered without breaking layout
- Missing images fall back cleanly to the placeholder frame
- Slider controls remain stable regardless of active image dimensions

## Testing Strategy

### Visual behavior checks

Verify:

- Portrait images render within the fixed frame
- Landscape images render within the fixed frame
- Square images render within the fixed frame
- Placeholder uses the same frame dimensions

### Interaction checks

Verify:

- Slider arrows still switch images correctly
- Dot indicators remain aligned and accurate
- Changing images does not shift the card layout

### Responsive checks

Verify:

- Mobile card layout keeps a stable image frame
- Desktop card layout keeps a stable image frame
- Card proportions remain visually consistent across products

## Implementation Notes

The safest implementation order is:

1. Add fixed image-frame styling in catalogue CSS
2. Apply the frame structure in the product card
3. Ensure placeholder uses the same frame
4. Verify slider controls still align correctly
5. Run build and catalogue regression checks

## Success Criteria

The feature is successful when:

- All catalogue product images appear inside a consistent visual frame
- Full product images remain visible without cropping
- Slider navigation still works
- Placeholder state matches the same image region size
- Catalogue cards look visually aligned even with mixed uploaded image dimensions
