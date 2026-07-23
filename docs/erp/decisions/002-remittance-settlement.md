# Decision 002: Remittance Currency Receipt and JPY Settlement

## Status

Approved.

## Decision

JC Export records the currency and amount actually received from the customer.
Because the company's base currency is JPY, every accounting transaction also
records its JPY base value.

Receiving foreign currency and converting that money to JPY are separate events
unless the receiving bank performs immediate conversion as part of settlement.

An exchange-rate API provides reference rates. Actual bank settlement details
remain the accounting authority when the bank converts funds.

## Why the events are separate

A USD customer payment may follow this timeline:

```text
Quotation issued in USD
Sales Invoice submitted in USD
USD received in a USD bank account
USD held for several days
USD later converted to JPY
```

The invoice, payment receipt, and bank conversion can each use a different
exchange rate. Replacing them with one mutable rate would produce incorrect
customer balances, bank balances, and foreign-exchange gains/losses.

## Scenario A: Bank immediately converts to JPY

Record:

- Customer instructed amount and currency
- Gross foreign amount sent
- Bank fee and fee currency
- Net foreign amount used for conversion
- Actual JPY amount deposited
- Bank settlement rate
- Settlement/value date
- Bank transaction reference and evidence
- Reference API rate for comparison

Example:

```text
Customer sent             USD 10,000
Bank fee                  USD     20
Net amount converted      USD  9,980
Actual bank rate          147.50 JPY per USD
JPY deposited             JPY 1,472,050
```

The actual deposited JPY and bank evidence are authoritative. The market API
rate does not replace the bank rate.

## Scenario B: Foreign currency remains in a foreign bank account

Record the Payment Entry into the actual USD, EUR, or GBP bank account.

- The bank ledger retains the foreign-currency amount.
- ERPNext also posts the JPY base equivalent using the approved accounting rate.
- The customer invoice outstanding amount is reduced by the allocated payment.
- The foreign bank balance may require period-end revaluation.

When the company later converts the foreign funds into JPY, record a separate
bank-to-bank/internal transfer using:

- Foreign amount converted
- Foreign bank account
- JPY bank account
- Actual JPY proceeds
- Bank conversion rate
- Conversion fee
- Conversion date/reference

Any difference from the foreign balance's JPY carrying value is recognized
through the configured exchange gain/loss accounts.

## Rates retained for a remittance

The Incoming Remittance may retain:

| Rate | Purpose |
| --- | --- |
| Invoice rate | Rate used when the Sales Invoice was posted |
| Reference receipt rate | API/reference rate on payment value date |
| Payment accounting rate | Rate used by the Payment Entry |
| Bank settlement rate | Actual rate used when converted to JPY |

These are not interchangeable and must be labelled explicitly.

## Incoming Remittance fields

### Customer instruction

- Instructed amount
- Instructed currency
- Customer/remitter
- Remitter bank/reference
- Claimed invoice/order references

### Bank receipt

- Receiving company bank account
- Gross received amount
- Received currency
- Bank fee amount and currency
- Net received amount
- Value date
- Bank transaction reference

### Accounting

- Reference rate and provider
- Payment accounting rate
- JPY base amount
- Payment Entry
- Allocation state

### JPY settlement

- Conversion status: Not Required, Pending, Partially Converted, Converted
- Foreign amount converted
- Actual JPY proceeds
- Bank settlement rate
- Conversion fee
- Settlement date/reference
- Internal transfer/accounting document

One remittance may be converted in several portions. Each conversion is a
separate settlement row/document rather than overwriting the original receipt.

## Exchange-rate API

The API integration:

- Runs server-side with its key stored in a secret manager/environment.
- Fetches rates for approved currency pairs.
- Stores provider, rate timestamp, fetch timestamp, and raw source reference.
- Normalizes direction explicitly, for example `1 USD = 150.25 JPY`.
- Uses decimal values with sufficient precision.
- Retries safely and reports stale/missing rates.
- Never changes submitted quotations, invoices, or payments.
- Never substitutes a reference rate for known bank settlement data.

The provider is behind an adapter so changing exchange-rate vendors does not
change pricing, payment, or accounting documents.

## Approval rules

Finance review is required when:

- Bank and expected amounts materially differ.
- Bank fee is outside configured tolerance.
- Staff manually override an accounting rate.
- Bank settlement rate materially differs from the reference rate.
- Payment currency differs from invoice currency.
- Third-party remitter identity requires verification.

Tolerance values are configuration and currency aware.

## Example accounting timeline

```text
Invoice:
  USD 10,000 at 150.00 = JPY 1,500,000

Payment received:
  USD 10,000 at 148.00 = JPY 1,480,000
  Realized invoice/payment exchange difference is recognized.

USD later converted:
  USD 10,000 at actual bank rate 147.50
  JPY bank receives 1,475,000 before/after separately recorded fees.
  Difference from USD bank carrying value is recognized on conversion.
```

Exact debit/credit accounts are configured with the accountant and ERPNext
Chart of Accounts.

## What this decision prevents

- Treating all exchange rates as the same rate
- Rewriting an invoice when payment arrives
- Rewriting a payment when funds are converted later
- Using an external API rate instead of actual bank settlement
- Losing visibility into bank fees
- Losing foreign-currency bank balances
- Hiding realized or unrealized exchange gain/loss
