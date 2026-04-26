# Kauthuk E-commerce Implementation Plan

## Goal

Add a new SEO-first ecommerce surface to the existing `kauthukpos2` Laravel application without changing current POS/admin behavior.

Target route split:

- `/` -> new ecommerce storefront
- `/pos` -> existing POS/internal application entry
- `/catalogue` -> existing catalogue experience, unchanged
- `/catelouge` -> redirect to `/catalogue`

Confirmed scope:

- guest browsing
- guest cart
- OTP verification at checkout
- OTP-created reusable customer account
- customer-facing account area
- saved addresses
- order history
- full delivery address capture
- shipping charges
- `Cash on Delivery` only in phase 1
- order placement notifications by email and WhatsApp
- notifications sent to both customer and one configured admin recipient
- future Razorpay support
- old ecommerce UI style reused as the design source
- public storefront must be SEO-friendly

## Architecture Decision

Use one Laravel application and one database with three distinct surfaces:

1. Public ecommerce storefront
2. Public catalogue
3. Internal POS/admin

Shared source-of-truth data:

- `categories`
- `products`
- `product_images`
- stock/inventory fields

New commerce domain data:

- customers
- OTP verification records
- carts
- cart items
- customer addresses
- ecommerce orders
- ecommerce order items
- shipping rule data or settings
- notification configuration and delivery logs if needed

Keep POS sales data separate from ecommerce orders. Do not overload `sales` / `sale_items` with ecommerce lifecycle states.

## Rendering Strategy

### Recommended approach

Build the public storefront as server-rendered Laravel pages with progressive JavaScript enhancement.

Reasoning:

- strongest SEO baseline
- crawlable product and category pages
- better first content paint for search engines and users
- simpler control of metadata, canonicals, schema markup, and sitemap output

Apply this split:

- Public storefront: Blade-first or server-rendered Laravel responses
- Interactive enhancements: cart updates, OTP forms, account actions, address handling
- POS/admin: keep current Inertia/React behavior
- Catalogue: keep current existing implementation unless later deliberately merged

### SEO requirements

Every public storefront page must support:

- unique title
- unique meta description
- canonical URL
- Open Graph tags
- product/category structured data where applicable
- internal crawlable links
- XML sitemap inclusion
- clean slug-based URLs

## UI Strategy

Use the old ecommerce codebase at `/Users/anoopjoy8/Documents/Kauthuk/kauthuk/OldWebsite/kauthuk` as the primary visual reference for public storefront pages.

UI rules:

- preserve old ecommerce look and feel closely
- do not reuse POS interface patterns on public storefront pages
- do not disturb the current `/catalogue` appearance
- allow design token sharing only where safe

Pages to visually port/adapt:

- homepage
- header/navigation
- footer
- category listing
- product detail
- cart
- checkout
- OTP login
- customer account pages

## Route Plan

### Public storefront routes

- `GET /`
- `GET /shop`
- `GET /category/{slug}`
- `GET /product/{slug}`
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/{item}`
- `DELETE /cart/items/{item}`
- `GET /checkout`
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /checkout/place-order`
- `GET /order-success/{orderNumber}`
- `GET /account`
- `GET /account/orders`
- `GET /account/orders/{orderNumber}`
- `GET /account/addresses`
- `POST /account/addresses`
- `PATCH /account/addresses/{address}`
- `DELETE /account/addresses/{address}`
- `POST /logout-customer`

### Existing routes

- move current root POS landing to `/pos`
- preserve all authenticated internal routes
- keep `/catalogue` untouched
- add `GET /catelouge` redirect

### Internal notification configuration

At minimum, phase 1 needs one admin notification target that receives order alerts.

Configuration options:

- env/config driven single admin email and WhatsApp number for fastest delivery
- later expandable to admin-managed notification recipients

Initial configured recipient values:

- admin email: `info@kauthuk.com`
- admin WhatsApp: `9497363831`

### Route organization

Refactor `routes/web.php` into clear groups:

- storefront public routes
- customer account routes
- catalogue routes
- POS/admin routes

If needed, extract route groups into separate files for maintainability.

## Data Model Plan

### Existing tables to reuse

- `categories`
- `products`
- `product_images`
- inventory-related fields already used by POS

### Existing table additions

Add only what the storefront needs to `products`:

- `slug`
- `is_storefront_visible`
- `short_description`
- `description`
- `meta_title`
- `meta_description`

Optional later:

- `featured_image_id`
- `sort_order`
- `is_featured`

### New tables

#### `customers`

- `id`
- `name`
- `mobile_number`
- `email` nullable
- `is_active`
- `last_login_at`
- timestamps

Constraints:

- unique mobile number

#### `customer_otps`

- `id`
- `customer_id` nullable
- `mobile_number`
- `otp_code_hash`
- `purpose`
- `expires_at`
- `verified_at` nullable
- `attempt_count`
- timestamps

#### `customer_addresses`

- `id`
- `customer_id`
- `label`
- `recipient_name`
- `recipient_phone`
- `address_line_1`
- `address_line_2`
- `landmark` nullable
- `city`
- `state`
- `postal_code`
- `country`
- `is_default`
- timestamps

#### `carts`

- `id`
- `customer_id` nullable
- `session_token` nullable
- `status`
- timestamps

Statuses:

- `active`
- `converted`
- `abandoned`

#### `cart_items`

- `id`
- `cart_id`
- `product_id`
- `quantity`
- `unit_price_snapshot`
- timestamps

#### `ecommerce_orders`

- `id`
- `order_number`
- `customer_id`
- `status`
- `fulfillment_status`
- `payment_method`
- `payment_status`
- `recipient_name`
- `recipient_phone`
- `shipping_address_snapshot` JSON
- `subtotal`
- `tax_total`
- `shipping_total`
- `discount_total`
- `grand_total`
- `currency`
- `placed_at`
- timestamps

Initial values:

- `payment_method = cod`
- `payment_status = pending`
- `currency = INR`

Suggested statuses:

- `placed`
- `confirmed`
- `packed`
- `shipped`
- `delivered`
- `cancelled`

#### `ecommerce_order_items`

- `id`
- `ecommerce_order_id`
- `product_id`
- `product_name_snapshot`
- `product_code_snapshot`
- `unit_price`
- `gst_percentage`
- `quantity`
- `line_subtotal`
- `line_tax_total`
- `line_total`
- timestamps

#### `shipping_rules` or settings-backed shipping configuration

Phase 1 options:

- table-driven rules by pincode/state/order amount
- or admin-configured settings if rules are still simple

Recommendation:

- start with a dedicated shipping configuration table or service-friendly config structure so the calculator can grow cleanly

#### Optional `notification_logs`

Recommended if we want auditability from phase 1:

- `id`
- `notifiable_type`
- `notifiable_id`
- `channel`
- `recipient`
- `template_key`
- `status`
- `provider_message_id` nullable
- `payload_snapshot` JSON nullable
- `sent_at` nullable
- timestamps

## Authentication Strategy

Customer auth must be separate from POS/admin auth.

Recommended approach:

- new `Customer` model
- dedicated customer guard/session
- OTP-based login only for phase 1

Flow:

1. User browses and fills cart as guest
2. Checkout requests mobile number
3. OTP is sent
4. OTP verification finds or creates customer
5. Guest cart is attached to customer
6. Customer completes address selection and COD order placement

Do not mix customer identities into the existing internal `users` table unless there is a deliberate longer-term account unification plan.

## Cart Strategy

Cart must work before login.

Recommended behavior:

- anonymous cart tracked by signed cookie or session token
- server-side cart records available for reliable persistence
- merge anonymous cart into customer cart after OTP verification

Cart validation points:

- product exists and is storefront-visible
- product is active
- quantity is valid
- stock remains available
- pricing snapshots are refreshed before order placement

## Checkout Strategy

Phase 1 checkout flow:

1. Review cart
2. Enter mobile number
3. Verify OTP
4. Select existing address or add new address
5. Calculate shipping
6. Review totals
7. Place COD order
8. Trigger customer and admin notifications
9. Show confirmation page

Rules:

- no online payment in phase 1
- stock must be revalidated before final order creation
- order totals must be calculated on server side only
- checkout must remain accessible on mobile with low friction

## Shipping Strategy

Shipping charge calculation should live in a dedicated service layer.

Phase 1 calculator inputs:

- pincode
- state
- cart subtotal
- item count or weight if available

Phase 1 outputs:

- shipping eligibility
- shipping charge
- delivery note if needed

Do not hardcode shipping logic inside controllers or page templates.

## Notification Strategy

Notifications must be triggered after successful order creation.

Recipients:

- customer
- one configured admin recipient

Channels in scope:

- email
- WhatsApp

Recommended behavior:

- send customer order confirmation email
- send customer WhatsApp order confirmation message
- send admin order alert email
- send admin WhatsApp order alert message

Recommended implementation shape:

- fire an `OrderPlaced` domain event after transaction commit
- handle notifications in listeners/jobs so checkout response is not blocked by provider latency
- keep templates centralized per channel
- log success/failure for each outbound notification

Message content should include, at minimum:

- order number
- customer name
- mobile number
- order total
- payment method as `Cash on Delivery`
- delivery address summary

Provider notes:

- email can use Laravel notifications / mailables
- WhatsApp should be wrapped behind a provider service interface
- if the old ecommerce site at `/Users/anoopjoy8/Documents/Kauthuk/kauthuk/OldWebsite/kauthuk` already has email or WhatsApp integration patterns, reuse those contracts where practical

Failure handling:

- order placement must succeed even if a notification send fails
- failed notification attempts should be logged and retryable
- admin should still be able to see the order in the system even if outbound delivery fails

## Order Management Boundary

Ecommerce order lifecycle must remain distinct from POS invoices.

Why:

- POS sales are internal operational records
- ecommerce orders need checkout, customer account linkage, delivery state, COD/payment state, and public confirmations

If the business later wants POS conversion from ecommerce orders, add an explicit conversion or fulfillment workflow instead of reusing the same record type now.

## Implementation Phases

### Phase 0: Discovery and mapping

- inspect old ecommerce codebase for reusable UI blocks
- map current product/category/image data to storefront needs
- identify any missing product content fields
- confirm current stock source to be respected by storefront

Deliverable:

- field mapping and page inventory

### Phase 1: Route restructuring

- move current root landing to `/pos`
- wire storefront to `/`
- preserve `/catalogue`
- add `/catelouge` redirect
- verify internal navigation and auth redirects still work

Deliverable:

- stable route split with no POS regression

### Phase 2: SEO-ready storefront shell

- build server-rendered homepage
- port old header/footer/navigation style
- create category and product page templates
- add metadata pipeline and canonical handling
- add sitemap entries for storefront pages

Deliverable:

- crawlable public storefront shell

### Phase 3: Commerce data layer

- add migrations for customers, carts, addresses, ecommerce orders
- implement models and relationships
- create storefront product query layer
- add product slug generation and visibility handling

Deliverable:

- stable backend domain for commerce

### Phase 4: Guest cart

- implement add/update/remove cart APIs
- support guest cart persistence
- render cart page
- handle stock and price revalidation

Deliverable:

- usable guest cart

### Phase 5: OTP customer auth

- implement OTP request and verification endpoints
- create/find customer account on verification
- attach guest cart to verified customer
- add customer session handling

Deliverable:

- reusable customer identity flow

### Phase 6: Checkout and COD order placement

- build address selection and address creation UI
- implement shipping calculator
- implement order summary and COD placement
- trigger email and WhatsApp notifications for customer and admin
- create confirmation page

Deliverable:

- end-to-end COD checkout

### Phase 7: Customer account area

- account dashboard
- order history list
- order detail page
- saved address management

Deliverable:

- customer self-service area

### Phase 8: Hardening and launch prep

- mobile QA
- SEO QA
- route redirect QA
- notification QA for both channels and both recipients
- regression testing for POS and catalogue
- analytics/search console readiness if required

Deliverable:

- release candidate

## Testing Plan

### Backend tests

- route coverage for storefront endpoints
- OTP request/verify flows
- customer account creation
- guest cart to customer cart merge
- shipping calculation
- order total calculation
- COD order placement
- order placed event dispatch
- notification job dispatch for customer and admin
- notification failure logging and retry behavior
- slug and visibility behavior

### Frontend/UI checks

- homepage, category, product, cart, checkout on mobile and desktop
- OTP flow usability
- account area usability
- old ecommerce visual parity where intended

### Regression checks

- `/pos` loads existing POS entry correctly
- authenticated admin workflows still function
- `/catalogue` remains unchanged
- existing catalogue APIs remain compatible

### Notification checks

- customer receives order email
- customer receives order WhatsApp message
- admin recipient receives order email
- admin recipient receives order WhatsApp message
- checkout success is not blocked if provider is temporarily unavailable

### SEO checks

- HTML source contains page content
- metadata rendered server side
- canonical tags correct
- product/category URLs crawlable
- sitemap contains new pages

## Risks and Mitigations

### Risk: POS route regression

Mitigation:

- move root carefully
- verify auth redirects and links after `/pos` change

### Risk: storefront and catalogue styles drifting

Mitigation:

- treat old ecommerce UI as storefront source
- avoid mixing catalogue and storefront component trees unnecessarily

### Risk: inventory mismatch at checkout

Mitigation:

- revalidate stock on cart update and before order placement

### Risk: SEO loss from JS-heavy rendering

Mitigation:

- keep public pages server-rendered
- use JS only as enhancement

### Risk: customer auth colliding with admin auth

Mitigation:

- separate guards, sessions, and route middleware

### Risk: notification provider failure slowing checkout

Mitigation:

- queue notification sending after order creation
- store delivery logs
- retry transient failures

## Phase 1 Acceptance Criteria

- visiting `/` shows the new ecommerce home page
- visiting `/pos` shows the current POS entry
- visiting `/catalogue` behaves exactly as before
- customer can browse products without login
- customer can add products to cart as guest
- checkout requires mobile OTP
- OTP creates or reuses a customer account
- customer can save address and place COD order
- customer and admin notifications are triggered on successful order placement
- customer can see order history in account area
- public product/category pages are server-rendered and SEO-ready

## Future Extensions After Phase 1

- Razorpay integration
- payment webhooks and reconciliation
- coupon system
- returns/cancellations
- admin ecommerce order management screens
- richer SEO content modules for landing pages
