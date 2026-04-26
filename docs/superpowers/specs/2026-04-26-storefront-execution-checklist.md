# Storefront Execution Checklist

## Purpose

This is the implementation-facing execution checklist for building the new ecommerce storefront inside `kauthukpos2`.

It translates the approved implementation plan and the page-by-page migration checklist into:

- actual target folders
- actual files to create or update
- dependency order
- phase gates

This is the document to work from during build execution.

## Current Repo Baseline

Confirmed current structure:

- public catalogue exists as:
  - `resources/views/catalogue.blade.php`
  - `resources/js/catalogue/*`
  - `app/Http/Controllers/Api/CatalogueController.php`
- POS/admin uses:
  - `routes/web.php`
  - `resources/js/Pages/*`
  - current Inertia setup
- there are no storefront-specific controllers, Blade pages, or domain models yet

That means we should build the storefront as a clean new surface instead of mixing it into the current POS React tree.

## Target Folder Structure

### New controller layer

Create:

- `app/Http/Controllers/Storefront/HomeController.php`
- `app/Http/Controllers/Storefront/CategoryController.php`
- `app/Http/Controllers/Storefront/ProductController.php`
- `app/Http/Controllers/Storefront/CartController.php`
- `app/Http/Controllers/Storefront/CheckoutController.php`
- `app/Http/Controllers/Storefront/CustomerAuthController.php`
- `app/Http/Controllers/Storefront/AccountController.php`
- `app/Http/Controllers/Storefront/OrderController.php`

Purpose:

- keep public ecommerce logic separate from POS/admin controllers

### New request classes

Create as needed:

- `app/Http/Requests/Storefront/*`

Suggested requests:

- `RequestOtpRequest.php`
- `VerifyOtpRequest.php`
- `AddCartItemRequest.php`
- `UpdateCartItemRequest.php`
- `StoreAddressRequest.php`
- `PlaceOrderRequest.php`

### New models

Create:

- `app/Models/Customer.php`
- `app/Models/CustomerOtp.php`
- `app/Models/CustomerAddress.php`
- `app/Models/Cart.php`
- `app/Models/CartItem.php`
- `app/Models/EcommerceOrder.php`
- `app/Models/EcommerceOrderItem.php`
- `app/Models/ShippingRule.php`
- optional `app/Models/NotificationLog.php`

### New services

Create:

- `app/Services/Storefront/CartService.php`
- `app/Services/Storefront/OtpService.php`
- `app/Services/Storefront/ShippingCalculator.php`
- `app/Services/Storefront/CheckoutService.php`
- `app/Services/Storefront/CustomerSessionService.php`
- `app/Services/Notifications/WhatsAppService.php`
- `app/Services/Notifications/OrderNotificationService.php`

Purpose:

- keep controllers thin
- isolate provider integrations
- make checkout and notification logic testable

### New events and listeners

Create:

- `app/Events/OrderPlaced.php`
- `app/Listeners/SendOrderEmailNotifications.php`
- `app/Listeners/SendOrderWhatsAppNotifications.php`

Optional queue jobs:

- `app/Jobs/SendCustomerOrderEmail.php`
- `app/Jobs/SendCustomerOrderWhatsApp.php`
- `app/Jobs/SendAdminOrderEmail.php`
- `app/Jobs/SendAdminOrderWhatsApp.php`

### New middleware

Create if needed:

- `app/Http/Middleware/EnsureCustomerAuthenticated.php`
- `app/Http/Middleware/AttachStorefrontCart.php`

### New Blade structure

Create:

- `resources/views/storefront/layouts/app.blade.php`
- `resources/views/storefront/partials/header.blade.php`
- `resources/views/storefront/partials/footer.blade.php`
- `resources/views/storefront/partials/meta.blade.php`

Pages:

- `resources/views/storefront/home.blade.php`
- `resources/views/storefront/category.blade.php`
- `resources/views/storefront/product.blade.php`
- `resources/views/storefront/cart.blade.php`
- `resources/views/storefront/checkout.blade.php`
- `resources/views/storefront/account/index.blade.php`
- `resources/views/storefront/account/orders.blade.php`
- `resources/views/storefront/account/order-show.blade.php`
- `resources/views/storefront/account/addresses.blade.php`
- `resources/views/storefront/order-success.blade.php`

Fragment/partial candidates:

- `resources/views/storefront/partials/product-card.blade.php`
- `resources/views/storefront/partials/cart-summary.blade.php`
- `resources/views/storefront/partials/checkout-steps.blade.php`
- `resources/views/storefront/partials/address-form.blade.php`
- `resources/views/storefront/partials/otp-modal.blade.php`

### New asset structure

Create:

- `resources/css/storefront.css`
- optional split files:
  - `resources/css/storefront/header.css`
  - `resources/css/storefront/footer.css`
  - `resources/css/storefront/home.css`
  - `resources/css/storefront/product.css`
  - `resources/css/storefront/cart.css`
  - `resources/css/storefront/checkout.css`
  - `resources/css/storefront/account.css`
- `resources/js/storefront/app.js`
- `resources/js/storefront/cart.js`
- `resources/js/storefront/otp.js`
- `resources/js/storefront/checkout.js`
- `resources/js/storefront/account.js`

Rule:

- do not put storefront UI into the current `resources/js/Pages` Inertia tree unless we deliberately decide a page belongs to POS/admin

### New route files

Create:

- `routes/storefront.php`
- optional `routes/customer.php`

Update:

- `routes/web.php`

### New config files

Create:

- `config/storefront.php`
- optional `config/notifications.php` if we want storefront-specific notification config separated

Initial config values:

- admin email: `info@kauthuk.com`
- admin WhatsApp: `9497363831`

### New database migrations

Create:

- product storefront enhancement migration
- `create_customers_table`
- `create_customer_otps_table`
- `create_customer_addresses_table`
- `create_carts_table`
- `create_cart_items_table`
- `create_ecommerce_orders_table`
- `create_ecommerce_order_items_table`
- `create_shipping_rules_table`
- optional `create_notification_logs_table`

## Execution Order

## Phase 1: Route and surface split

### Files to update

- `routes/web.php`

### Files to create

- `routes/storefront.php`

### Tasks

- move current root route away from `/`
- create `/pos` entry for existing POS root behavior
- preserve `/catalogue`
- add `/catelouge` redirect
- mount new storefront route group from `routes/storefront.php`

### Done when

- `/` is reserved for storefront
- `/pos` opens the current POS surface
- `/catalogue` remains unchanged

## Phase 2: Storefront shell and assets

### Files to create

- `resources/views/storefront/layouts/app.blade.php`
- `resources/views/storefront/partials/header.blade.php`
- `resources/views/storefront/partials/footer.blade.php`
- `resources/views/storefront/partials/meta.blade.php`
- `resources/css/storefront.css`
- `resources/js/storefront/app.js`

### Files to update

- `vite.config.js`
- possibly `package.json` only if any asset pipeline changes are needed

### Tasks

- port legacy layout style from old website
- create new storefront asset bundle
- wire SEO metadata placeholders
- wire canonical tags and OG placeholders
- keep layout independent from POS and catalogue

### Done when

- storefront layout renders with old Kauthuk visual direction
- no old inline DB lookups remain in layout
- assets compile cleanly

## Phase 3: Storefront data model foundation

### Files to create

- all new migrations listed above
- all new models listed above

### Files to update

- `app/Models/Product.php`
- `app/Models/Category.php`

### Tasks

- add `slug`, visibility, description, and meta support to products
- add model relationships:
  - product -> images
  - customer -> addresses
  - cart -> items
  - order -> items
- add casts and scopes for storefront visibility

### Done when

- schema supports browsing, cart, OTP, address book, order placement, and notifications

## Phase 4: Storefront query layer

### Files to create

- `app/Http/Controllers/Storefront/HomeController.php`
- `app/Http/Controllers/Storefront/CategoryController.php`
- `app/Http/Controllers/Storefront/ProductController.php`
- optional query helpers inside `app/Services/Storefront/*`

### Tasks

- homepage queries
- category/listing queries
- product detail query with image/meta support
- slug-based route lookup
- stock-safe product visibility filtering

### Done when

- storefront pages can query current product/category/image data without touching POS flows

## Phase 5: Homepage migration

### Files to create

- `resources/views/storefront/home.blade.php`

### Files to inspect from old site

- old `resources/views/front/home.blade.php`
- old shared CSS/image assets

### Tasks

- port header/hero/featured section structure
- adapt product and category data bindings to current models
- remove outdated homepage blocks that depend on legacy admin tables unless explicitly needed

### Done when

- homepage is visually aligned with old storefront and server-rendered

## Phase 6: Category and listing page migration

### Files to create

- `resources/views/storefront/category.blade.php`
- `resources/views/storefront/partials/product-card.blade.php`

### Files to create or update

- `app/Http/Controllers/Storefront/CategoryController.php`
- `routes/storefront.php`

### Tasks

- build `/shop` and `/category/{slug}`
- implement search route if included in phase 1
- map legacy category browsing to clean slug URLs

### Done when

- category pages are crawlable and use legacy storefront card styling

## Phase 7: Product detail migration

### Files to create

- `resources/views/storefront/product.blade.php`

### Files to create or update

- `app/Http/Controllers/Storefront/ProductController.php`
- `resources/css/storefront/product.css`
- optional `resources/js/storefront/product.js`

### Tasks

- port gallery layout and image treatment
- port product title, price, description, breadcrumb pattern
- implement add-to-cart submission
- add SEO meta and schema data

### Done when

- `/product/{slug}` is the canonical product URL

## Phase 8: Cart implementation

### Files to create

- `app/Http/Controllers/Storefront/CartController.php`
- `app/Services/Storefront/CartService.php`
- `resources/views/storefront/cart.blade.php`
- `resources/views/storefront/partials/cart-summary.blade.php`
- `resources/js/storefront/cart.js`

### Tasks

- implement guest cart persistence
- add item add/update/remove endpoints
- merge cart after OTP verification
- revalidate stock and price server-side

### Done when

- cart works for guest users and visually reflects old storefront cart behavior

## Phase 9: Customer OTP auth

### Files to create

- `app/Http/Controllers/Storefront/CustomerAuthController.php`
- `app/Services/Storefront/OtpService.php`
- `app/Services/Storefront/CustomerSessionService.php`
- `app/Http/Requests/Storefront/RequestOtpRequest.php`
- `app/Http/Requests/Storefront/VerifyOtpRequest.php`
- `resources/views/storefront/partials/otp-modal.blade.php`
- `resources/js/storefront/otp.js`

### Tasks

- request OTP
- verify OTP
- create/reuse customer account
- start customer session
- merge customer cart

### Done when

- checkout can require OTP without breaking guest browsing

## Phase 10: Checkout, addresses, shipping

### Files to create

- `app/Http/Controllers/Storefront/CheckoutController.php`
- `app/Services/Storefront/ShippingCalculator.php`
- `app/Services/Storefront/CheckoutService.php`
- `resources/views/storefront/checkout.blade.php`
- `resources/views/storefront/partials/checkout-steps.blade.php`
- `resources/views/storefront/partials/address-form.blade.php`
- `resources/js/storefront/checkout.js`

### Tasks

- saved addresses
- new address creation
- shipping calculation
- COD-only order review
- final server-side total validation

### Done when

- customer can complete checkout with full delivery address and shipping charges

## Phase 11: Order placement and notifications

### Files to create

- `app/Http/Controllers/Storefront/OrderController.php`
- `app/Events/OrderPlaced.php`
- notification listeners/jobs
- `app/Services/Notifications/WhatsAppService.php`
- `app/Services/Notifications/OrderNotificationService.php`
- `resources/views/emails/storefront/order-confirmation.blade.php`
- `resources/views/emails/storefront/admin-order-alert.blade.php`

### Tasks

- create ecommerce order and order items
- dispatch `OrderPlaced` after commit
- send email and WhatsApp to:
  - customer
  - admin
- use:
  - `info@kauthuk.com`
  - `9497363831`
- log failures without blocking successful order placement

### Done when

- successful order placement triggers both admin and customer notifications

## Phase 12: Order success page

### Files to create

- `resources/views/storefront/order-success.blade.php`

### Tasks

- show order number
- show COD message
- show next-step guidance
- visually mirror old thank-you experience

### Done when

- customer reaches a stable, shareable success page after placing an order

## Phase 13: Customer account area

### Files to create

- `app/Http/Controllers/Storefront/AccountController.php`
- `resources/views/storefront/account/index.blade.php`
- `resources/views/storefront/account/orders.blade.php`
- `resources/views/storefront/account/order-show.blade.php`
- `resources/views/storefront/account/addresses.blade.php`
- `resources/js/storefront/account.js`

### Tasks

- account landing page
- order history list
- order detail page
- saved address management

### Done when

- returning customer can log in with OTP and access orders and addresses

## Phase 14: SEO hardening

### Files to update

- storefront layout/meta partials
- controllers generating page metadata
- sitemap generation location once selected

### Tasks

- unique titles/descriptions
- canonical links
- OG tags
- structured data
- sitemap support
- crawlable internal links

### Done when

- storefront meets the SEO requirements in the implementation plan

## Phase 15: Regression and launch checks

### Areas to verify

- `/` storefront
- `/pos` POS
- `/catalogue` existing catalogue
- existing admin auth and routes
- product management still works
- stock behavior still sane

### Tests to add

- model/relationship tests
- cart flow tests
- OTP flow tests
- checkout tests
- order placement tests
- notification dispatch tests

## Existing Files That Will Definitely Change

- `routes/web.php`
- `vite.config.js`
- `app/Models/Product.php`
- `app/Models/Category.php`
- likely `app/Providers/AppServiceProvider.php`
- possibly `resources/views/app.blade.php` only if global asset/layout behavior needs a minimal adjustment

## Existing Files That Should Stay Untouched Or Near-Untouched

- `resources/views/catalogue.blade.php`
- `resources/js/catalogue/*`
- `app/Http/Controllers/Api/CatalogueController.php`
- existing POS React pages in `resources/js/Pages/*`
- existing sales, user, inventory, and admin controllers unless a shared product concern requires a very small change

## Recommended First Build Slice

If we implement in the safest order, the first working slice should be:

1. route split
2. storefront layout
3. homepage
4. category page
5. product page

That gives us a reviewable public storefront shell before we touch cart, OTP, checkout, or notifications.

## Definition Of Progress

We should consider the storefront implementation genuinely underway only after these are merged:

- route split completed
- storefront layout exists
- first server-rendered home page is live on `/`
- POS still works on `/pos`
- catalogue still works on `/catalogue`
