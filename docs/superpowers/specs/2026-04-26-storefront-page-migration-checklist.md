# Storefront Page-by-Page Migration Checklist

## Purpose

This checklist converts the approved ecommerce plan into a concrete migration sequence based on the correct old storefront codebase:

- old storefront source: `/Users/anoopjoy8/Documents/Kauthuk/kauthuk/OldWebsite/kauthuk`
- new target app: `/Users/anoopjoy8/Documents/Kauthuk/kauthukpos2`

The goal is not to port the old project blindly. The goal is to preserve its public-facing style and customer journey while rebuilding it cleanly inside the current unified Laravel application.

## Migration Rules

- keep `/` for the new storefront
- keep `/catalogue` unchanged
- move existing POS landing to `/pos`
- preserve the old storefront visual language from the correct legacy codebase
- rebuild public pages as SEO-first server-rendered pages
- keep cart, OTP, checkout, account, and notifications aligned with the new approved scope
- do not copy old admin or old database structure into the new app

## Shared Style And Shell Migration

### 1. Global storefront layout

Old source:

- `resources/views/front/layout.blade.php`

Assets referenced there:

- `public/css/bootstrap.css`
- `public/css/style.css`
- `public/css/tab.css`
- `public/css/slider.css`
- `public/css/stylesheet.css`
- `public/css/jquery.fancybox.css`
- `public/css/fancybox.min.css`
- Google Fonts
- Font Awesome
- legacy images such as `public/images/site-logo-product.png`

Migration tasks:

- extract the storefront-only design system from the old layout
- identify reusable typography, spacing, colors, icons, and header/footer patterns
- avoid bringing old inline CSS blocks over unchanged where they mix layout and page logic
- create a new storefront layout in the current app with:
  - SEO metadata slots
  - canonical support
  - Open Graph support
  - common header
  - common footer
  - shared asset loading

Keep:

- header tone
- announcement bar
- brown/gold palette
- logo treatment
- general old storefront brand feel

Do not keep:

- DB lookups directly inside Blade layout
- old catch-all route assumptions
- old inline meta lookup behavior

### 2. Header and navigation

Old source:

- `resources/views/front/layout.blade.php`
- category/menu behavior also reflected in old route structure

Migration tasks:

- rebuild the old header visually inside the new app
- populate navigation from current `categories` data
- define route destinations for:
  - home
  - shop/category pages
  - cart
  - account
- keep header responsive behavior, but rebuild interactions cleanly

### 3. Footer

Old source:

- `resources/views/front/footer.blade.php`
- footer sections and brand contact areas referenced across the old storefront

Migration tasks:

- preserve footer visual hierarchy and contact tone
- map static links to routes that still exist or planned informational pages
- keep admin-maintained footer content only if it is needed later

## Public Storefront Pages

### 4. Homepage

Old source:

- `resources/views/front/home.blade.php`
- controller: `app/Http/Controllers/Front/Home.php`

Likely legacy elements to preserve:

- hero/banner treatment
- featured category navigation
- slider/carousel sections
- featured product sections
- old storefront promotional tone

Migration target:

- new `GET /`

Migration tasks:

- reproduce homepage structure in the new storefront layout
- keep the old style, but bind data from current products/categories
- decide which old homepage blocks remain useful and which are outdated
- make every homepage promotional block editable only if business value is clear
- ensure homepage content is server-rendered and indexable

### 5. Category and product listing pages

Old source:

- `resources/views/front/products.blade.php`
- controller: `app/Http/Controllers/Front/ProductsList.php`
- routes:
  - `/products`
  - `/products/{category}`
  - `/products/{category}/{subcategory}`
  - `/search/{keyword}`
  - `/online-{slug}`

Behavior to preserve:

- category/subcategory browsing
- search results
- product cards
- breadcrumb feel
- filter/tab-like subcategory selection where useful

Migration target:

- `GET /shop`
- `GET /category/{slug}`
- optional search route such as `GET /search`

Migration tasks:

- map old category/subcategory URL behavior to cleaner new slug routes
- preserve the old storefront product-card look
- remove dependency on legacy querystring patterns like `?sid=` and `?pid=`
- build SEO-friendly listing pages with crawlable links
- decide whether subcategory tabs become:
  - dedicated subcategory links
  - filters
  - or nested category pages

### 6. Product detail page

Old source:

- `resources/views/front/details.blade.php`
- controller: `Home::Product`
- old route behavior relies on dynamic slug plus `?prd=`

Behavior to preserve:

- image gallery
- zoom/detail presentation
- breadcrumbs
- variation/size selection if still relevant
- strong product storytelling layout
- meta/OG handling

Migration target:

- `GET /product/{slug}`

Migration tasks:

- replace `?prd=` routing with canonical slug pages
- preserve the old visual layout for gallery, title, price, and add-to-cart area
- map current product model fields to the old presentation sections
- decide how to handle:
  - variations
  - size-based pricing
  - stock display
  - highlight/description blocks
- add server-rendered SEO metadata and structured data

### 7. Cart page

Old source:

- `resources/views/front/cart.blade.php`
- controller: `app/Http/Controllers/Front/Cart.php`
- routes:
  - `add-to-cart`
  - `cart`
  - `delete-item`
  - `update-cart`
  - `update-cart-quantity`

Behavior to preserve:

- cart table layout
- item quantity adjustments
- subtotal visibility
- guest cart usability

Migration target:

- `GET /cart`
- cart item mutation endpoints under `/cart/items`

Migration tasks:

- keep the old cart page visual feel
- replace session-array cart logic with the new server-backed cart model
- keep quantity update responsiveness
- make stock checks and price recalculation happen server-side
- preserve guest-to-logged-in continuity after OTP verification

### 8. OTP sign-in and verification

Old source:

- `resources/views/front/sign-in.blade.php`
- `resources/views/front/otp.blade.php`
- controller: `app/Http/Controllers/Front/SignIn.php`
- routes:
  - `sign-in`
  - `register`
  - `signin-otp`
  - `otp-verify`
  - `skip-otp`

Behavior to preserve:

- low-friction sign-in
- OTP as a major customer step
- mobile-first flow

Migration target:

- OTP step embedded into checkout
- optional account login entry for returning customers

Migration tasks:

- reuse the old OTP UX tone, but simplify the flow around the new reusable customer account model
- remove legacy registration/password complexity from phase 1 if not needed
- support:
  - checkout-triggered OTP
  - returning customer OTP login
  - customer session creation
- do not keep skip-login workarounds that weaken the new account flow unless business explicitly requires them

### 9. Checkout: billing and shipping

Old source:

- `resources/views/front/checkout.blade.php`
- `resources/views/front/confirmation.blade.php`
- controller: `app/Http/Controllers/Front/Confirmation.php`
- routes:
  - `checkout`
  - `confirmation`
  - `payments`

Behavior to preserve:

- step-based checkout structure
- separate address collection
- order summary visibility

Migration target:

- `GET /checkout`
- final checkout steps inside the new commerce flow

Migration tasks:

- preserve the visual step progression from the old checkout
- simplify the old billing/shipping flow around the new customer address book
- support:
  - saved addresses
  - new address creation
  - shipping charge calculation
  - COD payment method only in phase 1
- remove old pass-token and session hacks in favor of explicit checkout state

### 10. Payment step

Old source:

- `resources/views/front/payment.blade.php`
- `resources/views/front/paynow.blade.php`
- controller: `app/Http/Controllers/Front/Payment.php`

Migration target:

- phase 1: COD-only review and place-order step

Migration tasks:

- preserve the layout style of the final payment/review step
- strip Razorpay execution out of phase 1 UI while keeping the structure extensible
- make the page clearly show:
  - payment method as Cash on Delivery
  - shipping total
  - grand total
  - delivery address summary

### 11. Order success / thank-you

Old source:

- `resources/views/front/thanku.blade.php`
- `resources/views/front/confirmation.blade.php`
- controller methods inside `Payment.php`

Behavior to preserve:

- confirmation tone
- success messaging
- clear order reference

Migration target:

- `GET /order-success/{orderNumber}`

Migration tasks:

- preserve the old reassurance and success-state feel
- include order number, COD confirmation, and next-step messaging
- confirm that email and WhatsApp notifications are triggered at this point for:
  - customer
  - admin

## Customer Account Pages

### 12. Account dashboard

Old source:

- `resources/views/front/dashboard.blade.php`
- controller: `Home::Dashboard`

Migration target:

- `GET /account`

Migration tasks:

- preserve the account-area look and sectioning from the old site
- remove unrelated legacy widgets
- focus the dashboard on:
  - account summary
  - saved addresses
  - order history entry points

### 13. Order history and order detail

Old source:

- `resources/views/front/orders.blade.php`
- controller: `Home::Orders`

Migration target:

- `GET /account/orders`
- `GET /account/orders/{orderNumber}`

Migration tasks:

- preserve the old order-history presentation style where it still works
- adapt it to the new ecommerce order model
- make sure customer sees:
  - order number
  - date
  - total
  - status
  - line items
  - address summary

### 14. Profile and address management

Old source:

- `resources/views/front/edit-profile.blade.php`
- controller: `Home::Editprofile`

Migration target:

- `GET /account/addresses`
- optional `GET /account/profile`

Migration tasks:

- preserve the old account form feel where useful
- split profile editing from address management if that improves clarity
- focus phase 1 on:
  - mobile-linked account identity
  - saved addresses
  - basic name/contact maintenance

## Legacy Features To Review Before Porting

These exist in the old storefront and must be consciously accepted or dropped:

- password-based sign-in alongside OTP
- skip-OTP fallback behavior
- currency switching
- service pages
- blogs
- contact/custom enquiry flows
- legacy search URL patterns
- old dynamic catch-all routing
- direct DB queries inside Blade templates
- inline JavaScript-heavy page logic

Recommendation:

- do not port any of these by default unless they are needed for phase 1 ecommerce scope

## Notifications And Checkout Completion

Old code signals:

- old `Payment.php` already sends customer SMS-like messages on order placement
- old site includes email-related routes and templates

Phase 1 migration target:

- customer email on order placement
- customer WhatsApp message on order placement
- admin email on order placement to `info@kauthuk.com`
- admin WhatsApp message on order placement to `9497363831`

Checklist tasks:

- inspect old provider patterns for reusable integration ideas
- do not port secrets or hardcoded credentials
- move notification sending behind new provider/service abstractions
- log send success/failure

## Build Order

Recommended implementation order:

1. shared storefront layout
2. header/footer
3. homepage
4. category/listing pages
5. product detail page
6. cart
7. OTP step
8. checkout address flow
9. COD review/place-order step
10. order success page
11. account dashboard
12. order history
13. address management
14. notification hardening

## Acceptance Check For Migration Readiness

The migration checklist is ready to execute when:

- each legacy storefront page has a mapped new route
- each page has a clear source template/controller reference
- each page states what visual behavior must be preserved
- each page states what old technical behavior must not be copied forward
- shared assets and notification responsibilities are identified
