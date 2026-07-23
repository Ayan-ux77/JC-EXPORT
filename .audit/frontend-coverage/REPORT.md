# JC Export Frontend Coverage Audit

Date: 2026-07-23

## Scope

Customer journey from vehicle discovery through inquiry, quotation, reservation,
payment, shipment tracking, document delivery, and account management.

## Verdict

The public catalogue and inquiry entry points are substantially designed, and the
dedicated quote and contact forms create ERP inquiries. The customer-facing
transaction journey is not complete. Authentication is currently a visual mock,
there is no customer portal, and the existing ERP website contract does not yet
expose all data needed for invoices, payments, profile management, or document
downloads.

## Current Route Coverage

Present public routes:

- `/`
- `/vehicles`
- `/vehicles/[slug]`
- `/quote`
- `/about`
- `/services`
- `/contact`
- `/faq`
- `/shipping-and-payment`
- `/terms`
- `/privacy`

Present authentication mock routes:

- `/sign-in`
- `/sign-up`
- `/verify-otp`
- `/new-password`

Present integration routes:

- `POST /api/v1/inquiries`
- `GET /api/v1/inquiries/[reference]`
- `POST /api/v1/reservations`
- `POST /api/integrations/frappe`

## Confirmed Gaps

### P0: Identity and session

- Sign in, sign up, OTP, password reset, Google, and Apple controls do not call an
  authentication service.
- There is no customer session, protected route middleware, logout, recovery
  flow, or authenticated customer identity.
- The sign-in page promises order, inspection, and shipment access that does not
  exist.
- Authentication pages do not reflow on mobile.
- The auth header contains prototype navigation controls rather than customer
  navigation.
- OTP copy requests six digits, while the screen renders five inputs.

### P0: Inquiry continuity

- There is no inquiry confirmation or status route.
- The quote and contact forms only show the reference inline.
- The secure lookup token is stored only in `sessionStorage`, so the customer
  cannot reliably resume on another device or after browser storage is cleared.
- The home-page export inquiry form is not wired to the ERP submission function.

### P0: Customer transaction portal

- No account dashboard.
- No inquiry list or inquiry detail.
- No quotation review, FOB/CIF breakdown, accept/reject action, or PDF.
- No reservation screen or reservation status.
- No order, invoice, deposit, balance, remittance, or payment history screens.
- No shipment timeline, vessel, voyage, ETD/ETA, or tracking screen.
- No approved export-document list or download screen.

### P1: Customer data and communication

- No profile, company, billing, destination, consignee, or address management.
- No notification center or email/WhatsApp preference controls.
- No support thread tied to an inquiry, order, or shipment.
- No custom loading, empty, error, unauthorized, or not-found states for portal
  workflows.

### P1: Missing ERP website contracts

The current status projection supports inquiry, quotation summary, reservation
summary, shipment timeline, and document metadata. It does not currently expose:

- Customer login/session endpoints.
- A customer-scoped list of inquiries, quotes, orders, or shipments.
- Quotation acceptance/rejection.
- Sales invoice and payment balance summaries.
- Incoming remittance submission/status.
- Downloadable document URLs or signed file responses.
- Profile, address, and consignee CRUD.
- Notification preferences.

## Recommended Information Architecture

Public continuity:

- `/inquiry/[reference]` - durable confirmation and guest status lookup.

Authentication:

- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/verify`
- `/reset-password`

Protected portal:

- `/account` - overview and next actions.
- `/account/inquiries`
- `/account/quotes/[id]`
- `/account/reservations`
- `/account/orders/[id]`
- `/account/payments`
- `/account/shipments/[id]`
- `/account/documents`
- `/account/profile`
- `/account/consignees`
- `/account/security`
- `/account/notifications`

## Recommended Build Order

1. Customer identity, secure server session, protected account layout, and
   functional recovery/logout.
2. Durable inquiry confirmation/status page using the existing lookup contract.
3. ERP customer read model for account overview and customer-scoped records.
4. Quotation detail, acceptance, and reservation.
5. Orders, invoices, balances, and remittance tracking.
6. Shipment timeline and approved document downloads.
7. Profile, consignee, notifications, empty/error states, and responsive polish.

## Evidence

- `01-sign-in-viewport.png` - desktop sign-in promise and visual shell.
- `02-quote-start.png` - working public quote entry flow.
- `03-vehicle-detail.png` - vehicle conversion entry point.
- `04-account-missing.png` - missing customer portal route.
- `05-sign-in-mobile.png` - broken mobile auth reflow.

## Evidence Limits

The audit used current route source, the current ERP website response contract,
and live screenshots. It did not submit a new test inquiry because that would
create an ERP record. It does not claim full WCAG compliance; keyboard, screen
reader, contrast, and authenticated-state testing remain to be performed once
the portal exists.
