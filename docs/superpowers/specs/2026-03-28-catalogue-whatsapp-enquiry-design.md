# Catalogue WhatsApp Enquiry Design

## Goal

Make the `SEND ENQUIRY` action on catalogue product cards open WhatsApp chat to `9497363831` with a product-specific prefilled message.

The message should identify the product being viewed so the store can respond without asking the customer for basic product details first.

## Scope

This design covers only the catalogue enquiry action behavior.

In scope:

- Turn `SEND ENQUIRY` into a working WhatsApp link
- Prefill the message with product title and product code
- Keep the current catalogue card UI styling intact

Out of scope:

- Backend changes
- Lead storage or CRM integration
- Additional enquiry forms
- Changing the WhatsApp destination number dynamically

## Current Context

The catalogue card already shows a `SEND ENQUIRY` action visually, but it does not yet send the user to the intended WhatsApp destination with a useful prefilled message.

The card already has all data needed for a useful enquiry message:

- Product title
- Product code

This can be implemented entirely in the frontend.

## Recommended Approach

Use a direct WhatsApp deep link to `919497363831` with a URL-encoded product-specific message.

Recommended message format:

`Hi, I want to enquire about <product title> (<product code>).`

Why this approach:

- Gives the store useful context immediately
- Requires no backend changes
- Works for both mobile and desktop browser flows
- Preserves the current catalogue UI

## Alternatives Considered

### 1. Generic WhatsApp message

Pros:

- Slightly simpler

Cons:

- Low-context for the store
- Pushes product identification back onto the customer

### 2. Product-specific message with title and code

This is the recommended option.

Pros:

- Clear and concise
- Uses data already present in the card
- Minimal implementation complexity

Cons:

- Depends on product code being present for the fullest version of the message

### 3. Product-specific message plus page URL or more metadata

Pros:

- More context for support/sales

Cons:

- Noisier message
- Unnecessary for the current need

## Architecture

This should remain a frontend-only behavior inside the catalogue product card.

No backend API changes are required.

Responsibilities:

- Frontend builds the WhatsApp URL
- Frontend URL-encodes the message
- Frontend opens the link in a new tab/window

This keeps the change isolated and low-risk.

## Components

### Catalogue Product Card

Update `resources/js/catalogue/components/ProductCard.jsx`.

Requirements:

- Replace or convert the `SEND ENQUIRY` button into an anchor element
- Point it to `https://wa.me/919497363831?text=...`
- Build the message from the current product card data
- Preserve current styling and icon layout

### Message generation

Expected behavior:

- If product title and code exist, include both
- If product code is missing, fall back to title-only message
- Always URL-encode the message

Recommended message behavior:

- With title and code:
  `Hi, I want to enquire about <product title> (<product code>).`
- Without code:
  `Hi, I want to enquire about <product title>.`

## Data Flow

1. Product card receives product data
2. Card builds the WhatsApp message string
3. Card URL-encodes the message
4. Card renders the enquiry action as a WhatsApp link
5. User clicks `SEND ENQUIRY`
6. Browser opens WhatsApp chat with the prefilled message

## Error Handling

Expected behavior:

- If WhatsApp app is unavailable, the `wa.me` link should still open in the browser
- If product code is absent, omit it cleanly
- Special characters in product names must not break the URL

## Testing Strategy

### Behavior checks

Verify:

- Product title and code are included in the generated WhatsApp URL
- Missing product code falls back to a clean title-only message
- Special characters are URL-encoded correctly

### UI checks

Verify:

- The enquiry control still looks the same in the catalogue card
- Clicking the control opens a valid WhatsApp link target

## Implementation Notes

The safest implementation order is:

1. Add a small helper or inline formatter for the WhatsApp message
2. Replace the enquiry button with a link using the current styling
3. Verify message output with and without product code
4. Run build verification

## Success Criteria

The feature is successful when:

- Clicking `SEND ENQUIRY` opens WhatsApp for `9497363831`
- The message includes the current product title
- The message includes the product code when available
- The catalogue card UI remains visually consistent
