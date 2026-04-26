# Kauthuk E-commerce Expansion Plan

## Purpose

Turn the current Kauthuk system into one combined platform where:

- `kauthuk.com` opens the new shopping website
- `kauthuk.com/pos` opens the existing POS system
- `kauthuk.com/catalogue` keeps the current catalogue page

This lets Kauthuk run customer shopping, catalogue viewing, and POS operations inside one application, while keeping the existing admin and POS working as they are today.

## What Will Be Added

### 1. New shopping website on the main domain

The home page of the website will become a full online shopping experience. Customers will be able to:

- land on the new Kauthuk shopping home page
- browse categories and products
- view product details
- add products to cart
- continue shopping without signing in first

The look and feel will follow the old Kauthuk e-commerce website so the branding, layout style, and shopping experience stay familiar.

Design reference source:

- `/Users/anoopjoy8/Documents/Kauthuk/kauthuk/OldWebsite/kauthuk`

### 2. Customer cart and checkout flow

Customers can browse as guests and build their cart freely.

When they decide to place an order:

- they will enter their mobile number
- they will verify it using OTP
- a customer account will be created if it is their first order
- returning customers can continue using the same account

Phase 1 payment option:

- Cash on Delivery only

Future phase:

- Online payment can be added later using Razorpay

### 3. Customer account area

Customers will have their own account section where they can:

- sign in using mobile OTP
- view previous orders
- save and manage delivery addresses
- use saved details during future orders

This will improve repeat purchase convenience and reduce checkout effort.

### 4. Order confirmation notifications

Whenever an order is placed, confirmation should be sent to:

- the customer
- one selected admin contact

Initial admin notification details:

- email: `info@kauthuk.com`
- WhatsApp: `9497363831`

Notification channels:

- email
- WhatsApp message

This helps both sides get immediate confirmation and reduces manual follow-up after order placement.

### 5. Delivery details and shipping charges

The shopping flow will support full delivery information.

Customers will be able to:

- enter complete delivery address
- select or save delivery addresses
- see shipping charges during checkout

This means the system will support full order delivery, not just pickup or manual calling.

### 6. Strong search visibility for Google

Because search visibility is very important for Kauthuk, the new shopping pages will be built in a way that is better for SEO.

Important pages such as:

- home page
- category pages
- product pages

will load with proper page content from the server so search engines can read them more easily. This gives a stronger base for organic traffic than a fully browser-driven shopping site.

## What Will Stay Unchanged

- Existing POS and admin workflow
- Existing product management process
- Existing catalogue page on `/catalogue`
- Current product data as the main source for items and categories

The idea is to add the online shopping layer without disturbing the internal business system.

## Project Phases

### Phase 1: Foundation and route setup

- make the main domain open the new shopping website
- move the current POS landing to `/pos`
- keep `/catalogue` working as it is now
- keep all internal admin and POS functions safe

### Phase 2: Shopping experience

- create home page
- create category and product pages
- create cart flow
- match the old Kauthuk website style

### Phase 3: Checkout and customer accounts

- mobile OTP verification
- customer account creation
- address management
- order placement with Cash on Delivery
- shipping charge display
- email and WhatsApp confirmation to customer and admin

### Phase 4: Customer area and order tracking

- order history
- saved addresses
- basic account management

### Phase 5: Launch preparation

- final testing
- mobile review
- SEO review
- content checks
- route and redirect checks

## Main Benefits

- one combined platform instead of separate systems
- better customer buying experience
- easy repeat orders with customer accounts
- strong base for SEO growth
- no disruption to the existing POS side
- ready for future online payment addition

## Expected Result

After this phase is completed, Kauthuk will have one unified application where customers can shop online from the main website, while the team continues using the same POS and admin system in the background.
