# JC Export ERP Blueprint

This directory contains the approved business design for the JC Export backend.
It is intentionally implementation-independent until the business rules are
validated against real quotations.

## Design sequence

1. [Core domain](./01-core-domain.md)
2. [Pricing engine](./02-pricing-engine.md)
3. [Customer, consignee, and inquiry](./03-customer-inquiry.md)
4. [Quotation, reservation, and sales](./04-quotation-sales.md)
5. [Invoices, payments, and remittance allocation](./05-invoices-payments.md)
6. [Shipment, documents, and delivery](./06-shipment-documents.md)
7. [Roles, approvals, audit, and APIs](./07-security-api.md)

## Working rule

The previous ATJ applications are requirements references, not migration
templates. We preserve the business knowledge and redesign the storage,
workflows, security boundaries, and APIs.

No old database table should be recreated as a Frappe DocType without a
documented business reason.

## Approved decisions

1. [Currency policy: JPY base with USD, EUR, and GBP transactions](./decisions/001-currency-policy.md)
2. [Remittance currency receipt and JPY settlement](./decisions/002-remittance-settlement.md)
