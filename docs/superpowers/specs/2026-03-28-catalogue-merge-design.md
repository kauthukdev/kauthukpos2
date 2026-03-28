# Catalogue Merge Design

## Goal

Merge the public `kauthukProductcatalogue` experience into `kauthukpos2` so the result is a single Laravel application with:

- Public catalogue pages available at `/catalogue`
- Existing POS routes and authenticated Inertia flows unchanged
- One shared product/category data source

## Scope

This design covers only the public catalogue merge into `kauthukpos2`.

In scope:

- Add a public `/catalogue` route and supporting API endpoints inside `kauthukpos2`
- Move the catalogue React frontend into the `kauthukpos2` codebase
- Reuse existing `products` and `categories` data from `kauthukpos2`
- Preserve the current POS behavior, auth flow, middleware, and Inertia pages

Out of scope:

- Reworking the POS UI
- Importing the catalogue app as a second standalone Laravel app
- Moving `vendor`, `node_modules`, old database dumps, archived website folders, or generated build artifacts from `kauthukProductcatalogue`
- Upgrading the whole POS frontend stack to the catalogue app's newer React/Vite/Tailwind versions
- Adding a separate catalogue visibility flag, since the approved behavior is to show all active POS products/categories automatically

## Current Context

`kauthukpos2` is the main Laravel application and already contains:

- Authenticated Inertia routes for dashboard, users, products, sales, inventory, and profile
- Existing `App\Models\Product` and `App\Models\Category` models
- Product image upload handling through the existing POS product workflow

`kauthukProductcatalogue` contains:

- A public React catalogue mounted from a Blade view
- API endpoints that fetch categories and products
- Duplicate `Product` and `Category` model usage, but for the same conceptual domain
- Extra non-essential folders and historical data that should not be merged into the host app

## Recommended Approach

Use `kauthukpos2` as the only application host and add the catalogue as a public, isolated React entry mounted from a Blade view under `/catalogue`.

Why this approach:

- It keeps a single deployable Laravel app
- It avoids duplicating product/category schemas
- It preserves the existing POS Inertia runtime and authenticated routes
- It allows the catalogue frontend to stay isolated from the POS shell
- It minimizes risk compared with upgrading the main frontend stack or embedding the old app wholesale

## Alternatives Considered

### 1. Blade-mounted public React app inside `kauthukpos2`

This is the recommended option.

Pros:

- Strong isolation from existing POS pages
- Minimal risk to authenticated Inertia flows
- Clean migration path for the current catalogue frontend

Cons:

- Introduces a second frontend entry point in the same Laravel app
- Requires some dependency and asset alignment work

### 2. Rebuild the catalogue as an Inertia page inside the existing POS frontend tree

Pros:

- One frontend runtime pattern
- Shared page conventions with the POS app

Cons:

- Higher risk of coupling public catalogue behavior to existing authenticated app structure
- Requires more refactoring of the imported catalogue code

### 3. Keep the old catalogue app externally mounted or proxied

Pros:

- Fastest short-term path

Cons:

- Still effectively two applications
- Harder deployment and maintenance story
- Duplicated configuration and data ownership concerns

## Architecture

`kauthukpos2` remains the host Laravel application for both POS and catalogue concerns.

The application will have two clearly separated surfaces:

- Authenticated POS surface: existing Inertia routes, middleware, controllers, and pages remain unchanged
- Public catalogue surface: new public routes, Blade view, API endpoints, and catalogue React bundle

The catalogue frontend will be moved into a dedicated folder such as `resources/js/catalogue` and compiled through the same Vite setup already used by `kauthukpos2`.

The `/catalogue` route will render a dedicated Blade view that mounts the public React application into a root element. This keeps the public catalogue independent from the POS Inertia boot process.

The catalogue backend will not introduce duplicate product or category tables. It will read from the existing `App\Models\Product` and `App\Models\Category` models in `kauthukpos2`.

## Components

### Public web route

Add a new public route:

- `GET /catalogue`

This route returns a Blade view with:

- Catalogue page title and base HTML shell
- Vite references for the catalogue-specific CSS and JS entry
- A root mount node for the React application

This route must not require authentication.

### Public catalogue API

Add dedicated catalogue API endpoints, for example:

- `GET /api/catalogue/categories`
- `GET /api/catalogue/products`

These endpoints remain public and are used only by the catalogue frontend.

They should be implemented in a small dedicated controller, separate from the existing POS `ProductController`, to avoid changing POS behavior and to keep public read-only catalogue logic bounded.

### Catalogue React app

Move only the needed catalogue frontend files from `kauthukProductcatalogue` into `kauthukpos2`, preserving a clear folder boundary.

Expected pieces:

- Entry file
- Main catalogue shell
- Header
- Sidebar
- Product list
- Product card

The imported code should be adjusted to match the dependency versions already used by `kauthukpos2` when practical. If a dependency is truly required and compatible, add it surgically instead of upgrading the whole frontend stack.

### Shared domain models

Use the existing `App\Models\Product` and `App\Models\Category`.

Approved catalog visibility rule:

- Every active POS category should be eligible for `/catalogue`
- Every active POS product should be eligible for `/catalogue`

No extra catalogue-only visibility field is required in this phase.

## Data Flow

### Category flow

1. Browser requests `/catalogue`
2. Blade view loads the catalogue React bundle
3. React app requests `/api/catalogue/categories`
4. Backend returns active categories from the existing POS `categories` table
5. UI uses those categories for filtering in header and sidebar

### Product flow

1. React app requests `/api/catalogue/products`
2. Request includes:
   - `page`
   - `category`
   - `search`
3. Backend queries the existing POS `products` table
4. Backend filters to active products only
5. Backend optionally filters by category and search term
6. Backend returns paginated JSON
7. UI renders product cards and supports loading additional pages

## Query Rules

The catalogue product endpoint should:

- Return only active products
- Return only products that belong to active categories when category data is needed for filtering/display
- Support text search on `title` and `product_code`
- Support category filtering using the current POS category relationship conventions
- Return results ordered predictably, with newest products first unless implementation review finds a stronger business ordering already used in POS
- Paginate results to protect performance

The category endpoint should:

- Return only active categories
- Return categories in a stable display order

## Image Handling

The catalogue must reuse existing POS product images.

Implementation expectations:

- Resolve image URLs from the current POS storage path conventions
- Do not change the POS image upload workflow as part of this merge
- If an image file is missing or the product has no image, render a safe placeholder state in the catalogue card

## Compatibility Constraints

To avoid breaking `kauthukpos2`, the merge must be additive and isolated.

Required constraints:

- Do not alter existing POS route paths or names
- Do not change existing auth or permission middleware behavior
- Do not couple the public catalogue to authenticated Inertia layout bootstrapping
- Do not import the catalogue app's duplicate Laravel backend wholesale
- Do not move generated folders such as `vendor`, `node_modules`, or `public/build`
- Do not upgrade the full POS app to React 19, Vite 8, or Tailwind 4 as part of this merge

## Error Handling

Catalogue failures must degrade safely without affecting the POS application.

Expected behavior:

- If category or product API calls fail, the catalogue UI shows a local error state
- If filtering returns no matches, the UI shows a clear empty state
- If product data is incomplete, the UI should still render defensively where possible
- Failures in public catalogue code must not interfere with authenticated POS pages

## Testing Strategy

### Route safety

Verify:

- Existing authenticated POS routes still load as before
- `/catalogue` loads publicly without auth
- Public catalogue API endpoints load without touching POS auth flow

### Data correctness

Verify:

- Categories endpoint returns active categories only
- Products endpoint returns active products only
- Search filters `title` and `product_code`
- Category filter works against the existing product-category structure
- Pagination works correctly

### Frontend integration

Verify:

- Catalogue page mounts successfully from the new Blade view
- Frontend requests the new catalogue endpoints
- Product cards render with current POS data
- Empty, loading, and error states display correctly
- Product images resolve correctly or fall back safely

### Build validation

Verify:

- Vite production build succeeds in `kauthukpos2`
- No existing POS frontend entry is broken by the catalogue additions

## Implementation Notes

The safest implementation order is:

1. Add isolated public catalogue routes and controller
2. Repoint catalogue queries to existing POS models
3. Move the catalogue frontend into a separate folder and entry point
4. Adjust dependencies only as needed for compatibility
5. Add route and API tests
6. Run build validation and smoke test both POS and catalogue surfaces

## Success Criteria

The merge is successful when:

- `kauthukpos2` is the only application that needs to run
- `/catalogue` is publicly accessible
- Existing POS authenticated flows behave the same as before
- Catalogue data comes from the current POS product and category records
- Active products and categories automatically appear in the public catalogue
- The project can build and serve both POS and catalogue from one codebase
