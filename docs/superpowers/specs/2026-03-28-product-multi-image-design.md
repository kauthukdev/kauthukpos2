# Product Multi-Image Design

## Goal

Extend `kauthukpos2` so a product can have:

- One primary image stored on the existing `products.image` field
- Multiple additional images stored separately as a gallery

The system must support uploading multiple images during product creation and editing, while preserving current behavior for existing single-image products.

## Scope

This design covers product image management only.

In scope:

- Keep the current primary image model
- Add a new database table for additional product images
- Support gallery upload during product creation
- Support adding, deleting, and reordering gallery images during product editing
- Preserve current POS and catalogue image usage for primary thumbnails

Out of scope:

- Reworking the overall product form beyond what is needed for multi-image handling
- Replacing the primary image model with a gallery-only model
- Changing catalogue/list pages to render full galleries by default
- Adding image transformations, cropping, or CDN integration

## Current Context

The current application stores one image path on `products.image`.

Current behavior:

- Product create accepts one `image` upload
- Product edit allows replacing or deleting that one image
- POS product pages render the primary image
- Catalogue pages also depend on the product's primary image

This creates a stable existing contract:

- `products.image` is the primary image
- Existing pages expect a single thumbnail-style image path

That contract should stay intact.

## Recommended Approach

Keep `products.image` as the primary image and add a related `product_images` table for additional gallery images.

Why this approach:

- It preserves current image consumers with minimal regression risk
- It avoids forcing all current code to understand arrays of images
- It gives a clean relational model for delete and reorder operations
- It supports incremental adoption in detailed product views later

## Alternatives Considered

### 1. Store all image paths as JSON on `products`

Pros:

- Faster schema change
- Minimal table count

Cons:

- Harder per-image delete and reorder handling
- Weak relational modeling
- More brittle validation and updates

### 2. Move all images, including primary, into a dedicated related table

Pros:

- Cleaner normalized model long-term
- One source of truth for every image

Cons:

- Higher regression risk
- Requires more widespread changes to current consumers
- Increases migration complexity immediately

### 3. Keep one primary image on `products` and store additional images in `product_images`

This is the recommended option.

Pros:

- Safest transition path
- Minimal changes for existing POS and catalogue usage
- Good fit for gallery-specific operations

Cons:

- Primary image concept exists in two layers conceptually
- Requires careful synchronization between product and gallery logic

## Architecture

The product image system will be split into two bounded responsibilities:

- Primary image responsibility: `products.image`
- Gallery responsibility: `product_images`

The `products.image` field remains the canonical primary image used by:

- POS product listing pages
- Existing edit previews
- Public catalogue thumbnail rendering

The new `product_images` table stores additional images only.

Suggested columns:

- `id`
- `product_id`
- `image_path`
- `sort_order`
- `created_at`
- `updated_at`

The `Product` model will gain a `hasMany` relationship for gallery images ordered by `sort_order`.

The new gallery relation should be isolated so existing product queries continue to work without requiring immediate changes everywhere.

## Components

### Database layer

Add a migration for `product_images`.

Requirements:

- Foreign key to `products`
- Cascade delete when a product is deleted
- Stable `sort_order` column for gallery ordering
- Store image path in the same relative storage format already used for primary image storage

### Model layer

Add a new model such as `ProductImage`.

Responsibilities:

- Belongs to `Product`
- Stores the relative image path
- Stores the gallery position

Update `Product` with:

- `galleryImages()` relation ordered by `sort_order`

### Product creation flow

Extend the create form to accept:

- One primary image
- Multiple additional gallery images

Controller behavior:

1. Validate core product fields
2. Validate primary image separately
3. Validate gallery images as an array of image files
4. Store the primary image into `products.image`
5. Store each gallery image file
6. Create `product_images` rows with `sort_order` based on upload order

### Product edit flow

Extend the edit form to support:

- Viewing the current primary image
- Replacing or deleting the primary image
- Viewing current gallery images
- Uploading new gallery images
- Deleting individual gallery images
- Reordering existing gallery images

Controller behavior should support all of the following in one edit cycle:

- Keep current primary image unchanged
- Replace primary image
- Delete primary image
- Add more gallery images
- Delete selected gallery images
- Persist a new gallery order

### UI behavior

Create page requirements:

- One primary image input
- One multiple-file gallery input
- Clear distinction between primary and additional images
- Preview behavior is desirable if low-risk, but not required by the core design

Edit page requirements:

- Existing primary image preview
- Existing gallery image grid/list
- Per-image delete action for gallery images
- Reorder support for gallery images
- Upload more gallery images without replacing all existing ones

## Data Flow

### Create flow

1. User enters product details
2. User uploads one optional primary image
3. User uploads zero or more additional images
4. Backend validates all inputs
5. Backend stores primary image file and product row
6. Backend stores gallery files and related `product_images` rows
7. Backend redirects with success response

### Edit flow

1. Edit page loads product data, primary image, and gallery images
2. User may replace/delete primary image
3. User may add more gallery images
4. User may delete existing gallery images individually
5. User may reorder gallery images
6. Backend validates requested changes
7. Backend applies file and database updates consistently
8. Backend returns success response with updated state

## Storage Strategy

Primary and gallery images should use the same storage conventions so the application does not introduce two incompatible file-serving patterns.

Requirements:

- Store gallery images under the public product image storage area
- Keep the same relative-path storage convention used for product primary images
- Ensure both storage and publicly served copies remain consistent under the app's current storage setup
- Delete physical files when gallery images are removed

## Ordering Rules

Gallery ordering is explicit.

Rules:

- Upload order becomes initial `sort_order`
- Reordering updates `sort_order` values for all affected gallery rows
- Reorder requests must be scoped to the current product only
- Unknown or foreign gallery image ids must be rejected

## Error Handling

Validation should clearly distinguish:

- Primary image
- Additional gallery image array

Expected behavior:

- A bad gallery file should produce a usable validation error
- A failed gallery save should not leave orphaned DB rows
- A failed DB write should not leave silently accepted gallery state
- Delete operations must remove both DB row and file where present
- Existing products with no gallery rows must still behave normally

The implementation should coordinate file operations and database writes carefully enough to avoid half-complete updates.

## Backward Compatibility

Existing products with only `products.image` must continue to work without migration-side manual fixes.

Compatibility requirements:

- Existing product list pages continue using primary image
- Existing catalogue pages continue using primary image
- Existing products can have zero gallery rows
- No existing consumer should be forced to read from `product_images` just to render current behavior

## Testing Strategy

### Database and model tests

Verify:

- `product_images` rows are created correctly
- Cascade delete behavior works
- Gallery ordering is returned in `sort_order`

### Create flow tests

Verify:

- Product can be created with primary image plus multiple gallery images
- Product can be created with primary image only
- Product can be created with no images if current business rules allow that

### Edit flow tests

Verify:

- Primary image replacement still works
- Primary image deletion still works
- New gallery images can be appended
- Individual gallery images can be deleted
- Gallery reorder persists correctly

### Regression tests

Verify:

- Existing single-image products still render correctly
- POS list/edit pages still show the primary image correctly
- Public catalogue continues using the primary image without regression

## Implementation Notes

The safest implementation order is:

1. Add `product_images` migration and model
2. Add `Product` relation and ordered accessors
3. Extend create controller and form for gallery uploads
4. Extend edit controller and form for add/delete/reorder gallery operations
5. Add storage cleanup and consistency handling
6. Add tests for create, edit, delete, reorder, and backward compatibility

## Success Criteria

The feature is successful when:

- A product can be created with one primary image and multiple additional images
- Existing products continue working with only a primary image
- Gallery images can be added during edit
- Gallery images can be deleted individually
- Gallery images can be reordered
- POS and catalogue continue using the primary image without breakage
