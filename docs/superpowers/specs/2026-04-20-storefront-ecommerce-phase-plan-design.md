# Storefront E-commerce Phase Plan Design

## Goal

Introduce a new customer-facing e-commerce storefront inside the existing `kauthukpos2` Laravel application, using the same database and existing product configuration backend, while preserving the current catalogue experience unchanged.

Target route structure:
- `kauthuk.com/` opens the new storefront
- `kauthuk.com/catalogue` opens the existing catalogue
- `kauthuk.com/pos` opens the POS/internal application

Optional compatibility route:
- `kauthuk.com/catelouge` redirects to `/catalogue`

## Confirmed Constraints

- There will be one Laravel application and one database
- Existing product/category/admin configuration remains the source of truth
- The current `/catalogue` page must remain untouched in behavior and appearance
- The new storefront UI must align with the current catalogue visual system
- The new storefront should also respect the visual direction from the older app at `/Users/anoopjoy8/Documents/Kauthuk/kauthuk-web`
- Phase 1 includes browsing, cart, checkout, and writing to order tables
- Phase 2 includes payment integration, admin/user mail, and WhatsApp notifications
- Guest checkout is allowed

## Current Codebase Fit

The existing codebase already provides most of the shared product foundation:
- `products`, `categories`, and `product_images`
- inventory through `stock_count`
- public catalogue APIs and catalogue React UI
- internal POS/sales flows under authenticated routes

The current `sales` and `sale_items` structures are internal invoice-oriented records. They should not be reused as storefront orders because the storefront needs a separate lifecycle:
- cart
- checkout
- order placement
- later payment state
- later notification state
- later conversion to invoice if needed

## Architecture Decision

Use a single app, single database, and shared product master data, with a new commerce layer added on top.

Shared existing master data:
- `categories`
- `products`
- `product_images`
- existing stock fields

New commerce data:
- `orders`
- `order_items`
- later `payments`

Internal billing remains separate:
- `sales`
- `sale_items`

This separation keeps the storefront lifecycle clean without duplicating product management or introducing a second backend.

## UI Direction

The storefront should feel like the next step after the current catalogue, not a separate brand.

Visual requirements:
- reuse the same color family already present in `resources/css/catalogue.css`
- reuse the same typography direction used for the current catalogue header match work
- preserve the Kauthuk brown, gold, cream, and neutral palette
- match spacing rhythm, logo treatment, and header/footer tone to the catalogue
- borrow proven layout ideas from `kauthuk-web` where they fit storefront commerce needs

UI design rule:
- the new storefront should not copy the catalogue page component-for-component
- it should share brand tokens and visual language
- browsing, cart, checkout, and confirmation flows should look like a commerce extension of the same site

Reference sources:
- current catalogue styles in `resources/css/catalogue.css`
- current catalogue shell in `resources/js/catalogue/*`
- older storefront direction in `/Users/anoopjoy8/Documents/Kauthuk/kauthuk-web/resources/js/Pages/Home.jsx`

## Route Plan

### Public Storefront

- `GET /`
  - storefront home
- `GET /shop`
  - storefront product listing
- `GET /shop/{productSlugOrId}`
  - storefront product detail
- `GET /cart`
  - cart page
- `POST /cart/items`
  - add to cart
- `PATCH /cart/items/{lineKey}`
  - update quantity
- `DELETE /cart/items/{lineKey}`
  - remove item
- `POST /checkout`
  - place order
- `GET /order-success/{orderNumber}`
  - confirmation page

### Existing Public Catalogue

- `GET /catalogue`
  - existing catalogue page, unchanged
- existing `/api/catalogue/*`
  - unchanged unless shared query internals are extracted without changing payloads

### POS/Internal

- `GET /pos`
  - internal landing page or dashboard
- existing authenticated management routes remain under the POS side

### Compatibility

- `GET /catelouge`
  - redirect to `/catalogue`

## Data Model Plan

### Existing Tables To Reuse

Use current product data for storefront browsing and pricing:
- product title/name
- product code
- selling price
- GST
- category
- images
- stock count
- active status

### Existing Table Changes

Add only the minimum extra columns needed for storefront readiness on `products`:
- `is_storefront_visible` boolean default `true`
- `slug` nullable unique string
- `short_description` nullable text
- `description` nullable long text

Optional later:
- `meta_title`
- `meta_description`
- `sort_order`

Reasoning:
- admin should continue maintaining products in one place
- catalogue and storefront can diverge in visibility/content without duplicating records

### New Tables

#### `orders`

Recommended columns:
- `id`
- `order_number` unique
- `status`
- `customer_name`
- `customer_email`
- `customer_phone`
- `shipping_address_line_1`
- `shipping_address_line_2`
- `shipping_city`
- `shipping_state`
- `shipping_postal_code`
- `shipping_country`
- `billing_same_as_shipping`
- `billing_address_line_1`
- `billing_address_line_2`
- `billing_city`
- `billing_state`
- `billing_postal_code`
- `billing_country`
- `notes`
- `subtotal`
- `tax_total`
- `shipping_total`
- `discount_total`
- `grand_total`
- `currency`
- `source`
- `placed_at`
- timestamps

Recommended initial `status` values:
- `pending`
- `confirmed`
- `cancelled`

Recommended defaults:
- `source = storefront`
- `currency = INR`

#### `order_items`

Recommended columns:
- `id`
- `order_id`
- `product_id`
- `product_title_snapshot`
- `product_code_snapshot`
- `unit_price`
- `gst_percentage`
- `quantity`
- `line_subtotal`
- `line_tax_total`
- `line_total`
- timestamps

Snapshot fields are required so historic orders remain accurate even if product data changes later.

## Domain Boundaries

### Storefront Domain

Responsibilities:
- product browsing for customers
- cart management
- checkout validation
- order placement
- order confirmation

### Product Domain

Responsibilities:
- product configuration
- category assignment
- image management
- stock quantity source
- admin-side pricing/content maintenance

### POS Domain

Responsibilities:
- internal sales/invoice flow
- inventory/admin operations
- later order review and order-to-sale conversion

## Phase-by-Phase Implementation Plan

## Phase 0: Route Restructuring And Surface Separation

Objective:
- establish clear application surfaces before building commerce features

Work:
- change `/` to the new storefront entry
- preserve `/catalogue` exactly as-is
- add `/pos` as the POS/internal entry point
- add `/catelouge` redirect if required
- isolate storefront routes, catalogue routes, and POS routes clearly in `routes/web.php`

Deliverables:
- route map in place
- no catalogue regression
- no duplicate app shells

Risks:
- changing `/` may affect current user expectations

Mitigation:
- move the old landing/dashboard behavior intentionally to `/pos`

## Phase 1: Storefront Browsing

Objective:
- launch a customer-facing storefront that reads from the existing product setup

Work:
- create storefront controllers or APIs separate from the current catalogue controller
- create storefront React/Inertia pages for:
  - home
  - shop listing
  - product detail
- filter only active and storefront-visible products
- reuse category and image relationships
- support search and category filtering
- introduce product slug generation if needed

Recommended structure:
- `app/Http/Controllers/Storefront/*`
- `app/Http/Controllers/Storefront/Api/*`
- `resources/js/Pages/Storefront/*`

UI guidance:
- match catalogue colors, fonts, header tone, and footer tone
- use older `kauthuk-web` ideas for storefront browsing composition where helpful
- avoid importing catalogue-specific filtering UI wholesale

Deliverables:
- storefront home at `/`
- listing at `/shop`
- product detail pages
- shared branding with the existing catalogue

## Phase 2: Cart

Objective:
- support guest cart behavior without user accounts

Recommendation:
- use session-backed cart for phase 1
- do not create a persistent cart table yet

Work:
- add a cart service to encapsulate:
  - add item
  - update quantity
  - remove item
  - clear cart
  - server-side total calculation
- validate active status, storefront visibility, price, and stock on every cart mutation
- build cart page and summary components

Why session cart first:
- simpler implementation
- enough for guest checkout
- avoids unnecessary schema complexity before payment/account features

Deliverables:
- guest cart working end-to-end
- server-validated totals

## Phase 3: Checkout And Order Creation

Objective:
- place orders from the storefront and persist them in new order tables

Work:
- create checkout form with guest customer fields
- validate all customer data server-side
- revalidate current cart items from the database before placing the order
- compute totals on the server
- create `orders` and `order_items` in one database transaction
- decrement stock in the same transaction
- clear session cart after success
- redirect to order success page

Required transaction rule:
- order creation and stock decrement must either both succeed or both fail

Recommendation for inventory:
- reduce `stock_count` at order placement in phase 1
- restore stock if the order is later cancelled by admin

Deliverables:
- checkout page
- saved order records
- order confirmation number
- stock reservation by placed order

## Phase 4: POS/Admin Order Handling

Objective:
- keep admin handling separate, but use the same database and app

Work:
- add order listing and detail screens under the POS side
- allow internal users to:
  - view orders
  - update order status
  - cancel orders
  - restore stock on cancellation

Optional bridge:
- later create an `OrderToSaleService` to convert confirmed orders into `sales` and `sale_items`

Reasoning:
- this preserves the separation between customer orders and internal invoices

Deliverables:
- operational admin workflow for orders under `/pos`

## Phase 5: Payments

Objective:
- support online payments without restructuring the order model

Work:
- add `payments` table
- add payment status fields or derived state on `orders`
- create payment initiation flow
- add webhook/callback processing
- update order status based on payment outcome

Recommended later payment states:
- `unpaid`
- `authorized`
- `paid`
- `failed`
- `refunded`

Deliverables:
- payment-ready order model
- gateway integration without order table rewrite

## Phase 6: Notifications

Objective:
- notify admins and customers about order events

Work:
- email to admin on order placement
- email to customer on order placement
- WhatsApp to customer on order placement or confirmation
- queue all outbound notifications
- use event-driven triggers such as:
  - `OrderPlaced`
  - `OrderConfirmed`
  - `OrderCancelled`
  - later `PaymentCaptured`

Deliverables:
- reliable async notification pipeline

## Technical Implementation Blueprint

### Backend Modules

Recommended additions:
- `app/Models/Order.php`
- `app/Models/OrderItem.php`
- later `app/Models/Payment.php`
- `app/Services/StorefrontProductService.php`
- `app/Services/CartService.php`
- `app/Services/CheckoutService.php`
- `app/Services/OrderPricingService.php`
- later `app/Services/OrderToSaleService.php`

### Frontend Modules

Recommended additions:
- `resources/js/Pages/Storefront/Home.jsx`
- `resources/js/Pages/Storefront/Shop.jsx`
- `resources/js/Pages/Storefront/ProductDetail.jsx`
- `resources/js/Pages/Storefront/Cart.jsx`
- `resources/js/Pages/Storefront/Checkout.jsx`
- `resources/js/Pages/Storefront/OrderSuccess.jsx`
- `resources/js/storefront/components/*`

### Shared Visual Tokens

Prefer extracting reusable brand tokens from the catalogue styles rather than copying ad hoc CSS across surfaces.

Suggested approach:
- centralize shared brand variables
- reuse the same header/footer palette and typography stack
- allow storefront-specific layout styles on top of shared tokens

## Validation Rules

Mandatory server-side rules:
- do not trust price or tax values from the browser
- do not trust stock values from the browser
- cart totals must be recalculated on every update and at checkout
- product must be active and storefront-visible
- quantity must not exceed current available stock

## Testing Plan

Feature tests should cover:
- `/` storefront route renders correctly
- `/catalogue` continues to render unchanged
- `/pos` remains accessible for internal use
- storefront product list returns only active and storefront-visible products
- cart add/update/remove works
- checkout creates `orders` and `order_items`
- stock decrements correctly on order placement
- stock restores correctly on cancellation
- invalid or out-of-stock checkout attempts fail safely

Regression tests should explicitly verify that catalogue endpoints and UI contracts are not changed by storefront work.

## Milestone Delivery Order

1. Route restructuring for `/`, `/catalogue`, and `/pos`
2. Product schema additions for storefront metadata and visibility
3. Storefront browsing pages and data endpoints
4. Session-based cart
5. `orders` and `order_items` migrations and models
6. Checkout transaction with stock decrement
7. Order success page
8. POS-side order management
9. Payment integration
10. Email and WhatsApp notifications

## Risks And Mitigations

Risk:
- storefront work accidentally changes the current catalogue behavior

Mitigation:
- keep separate controllers, pages, and route namespaces
- add explicit regression tests for `/catalogue`

Risk:
- using `sales` as storefront orders creates long-term coupling

Mitigation:
- keep `orders` separate and add conversion to `sales` later only if needed

Risk:
- shared `stock_count` can drift if update rules are inconsistent between storefront and POS

Mitigation:
- funnel stock-changing behavior through explicit order and sales services
- add cancellation stock restoration rules

Risk:
- storefront UI drifts away from catalogue brand language

Mitigation:
- reuse brand tokens and reference the existing catalogue and `kauthuk-web` visual direction during implementation

## Success Criteria

This plan is successful when:
- `kauthuk.com/` serves a new storefront
- `kauthuk.com/catalogue` remains unchanged
- `kauthuk.com/pos` continues to serve the internal application
- products are managed from the existing backend and existing database
- customers can browse, add to cart, checkout, and create persisted orders
- order placement updates stock safely
- the storefront looks like a natural branded extension of the current catalogue and older Kauthuk web experience
