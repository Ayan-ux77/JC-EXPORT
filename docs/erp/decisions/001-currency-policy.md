# Decision 001: Currency Policy

## Status

Approved.

## Decision

JC Export's company and accounting base currency is JPY.

The system also enables these transaction currencies:

- USD
- EUR
- GBP

These currencies are master data values. They never become schema columns such
as `amount_usd`, `amount_eur`, or `amount_gbp`.

## Business context

- Vehicles are normally acquired in Japan in JPY.
- Japanese auction, collection, inland, repair, and yard expenses are normally
  incurred in JPY.
- Overseas customers are commonly quoted and invoiced in USD, EUR, or GBP.
- Freight and service suppliers may publish rates in JPY or a foreign currency.
- Payments may arrive after the exchange rate used for the quotation or invoice
  has changed.

## Core rules

### One company base currency

Every accounting entry has a JPY base value for the general ledger and company
reporting.

The company base currency must not be changed after accounting transactions
begin.

### One transaction currency per document

A Quotation, Sales Order, Sales Invoice, Purchase Invoice, or Payment Entry has
one transaction currency.

One Sales Invoice must not mix USD, EUR, and GBP line totals. Source components
are converted into the invoice currency before the invoice is submitted.

### One source currency per amount

Every price or cost component stores:

```text
amount
currency
```

Examples:

```text
Auction purchase      JPY 850,000
Inland transport      JPY  32,000
Ocean freight         USD   1,120
Inspection            USD     250
```

Adding another supported currency creates Currency and exchange-rate records,
not migrations or new amount fields.

## Rate types

The system distinguishes three meanings of exchange rate.

### Reference market rate

An external or imported market rate used for staff information and as a
starting point. It is not automatically authoritative for a customer quotation
or accounting entry.

### Commercial quotation rate

The approved rate used to convert source costs into the customer's quotation
currency.

It may include:

- Foreign-exchange risk buffer
- Bank conversion cost
- Quote-validity risk
- Company-approved commercial spread

The quotation stores this rate as an immutable snapshot.

### Accounting/payment rate

The rate used when posting the invoice, receiving payment, or reconciling a bank
transaction.

It may differ from the quotation rate. ERPNext records the resulting realized
exchange gain or loss.

These rates must have clear source, date/time, direction, and approval
information.

## Pricing conversion

The pricing engine:

1. Calculates each component in its original currency.
2. Selects one approved commercial rate for each required currency pair.
3. Converts every component directly into the quotation currency.
4. Applies currency-specific rounding.
5. Aggregates the converted component amounts.
6. Stores original and converted values in the quotation snapshot.

Avoid chained conversion:

```text
USD -> JPY -> GBP
```

When an approved direct rate is available, use:

```text
USD -> GBP
```

If company policy requires conversion through JPY, the engine records both
conversion legs explicitly so the result remains explainable.

## Quotation policy

- The customer selects or is assigned one approved quotation currency.
- Customer-facing totals are authoritative only in that currency.
- Website conversions into other currencies are labelled estimates.
- Submitted quotations never recalculate when market rates change.
- Quote validity and pricing-rate validity are checked before acceptance.
- An expired FX rate requires recalculation and a quotation revision.
- Manual exchange-rate overrides require a reason and configured approval.

## Sales policy

- Sales Order normally uses the accepted Quotation currency.
- Sales Invoice normally uses the Sales Order currency.
- Changing currency after quotation acceptance requires a revised commercial
  document and approval.
- Payment state is based on the submitted invoice and Payment Entries.
- Reports can show both transaction-currency and JPY base values.

## Purchase and landed cost policy

- Vehicle purchase uses the supplier's actual invoice currency, normally JPY.
- Supplier costs remain in their original currency.
- ERPNext posts the JPY base value using the approved accounting rate.
- Landed-cost allocation uses posted accounting values, not live website rates.

## Payment policy

- Record the actual currency and amount received by the bank.
- Record bank deductions separately.
- Allocate payments through ERPNext Payment Entry references.
- A payment exchange rate may differ from the invoice exchange rate.
- Exchange differences post to configured gain/loss accounts.
- Unallocated excess remains customer credit in the ledger.

## Accounts

At minimum configure:

- JPY company bank and cash accounts actually used
- Foreign-currency bank accounts only where JC Export holds real USD, EUR, or
  GBP accounts
- Realized exchange gain/loss account
- Unrealized exchange gain/loss account
- Bank fee/foreign transfer charge account

Receivable-account strategy is finalized with the accountant:

1. Maintain receivables in JPY while allowing foreign-currency invoices; or
2. Maintain dedicated receivable accounts in USD, EUR, and GBP.

The choice depends on how JC Export legally keeps its customer receivables and
how often a single customer changes billing currency. It is an accounting
policy decision, not merely a software preference.

## Revaluation

Foreign-currency bank and receivable balances are revalued through ERPNext
Exchange Rate Revaluation at the required accounting close.

Revaluation does not modify original quotations, invoices, or payments.

## API representation

Money is returned as:

```json
{
  "amount": "1250.00",
  "currency": "USD",
  "base_amount": "187500",
  "base_currency": "JPY",
  "exchange_rate": "150.000000"
}
```

Decimal amounts are serialized as strings. Currency is an ISO code.

## What this decision prevents

- Currency-specific database columns
- Adding migrations for new currencies
- Live rates changing historical quotations
- Hidden repeated conversions
- Mixing several currencies inside one invoice total
- Manually updated customer balances
- Treating website display conversion as accounting truth

## Remaining accounting confirmation

Before production configuration, the accountant must confirm:

- Receivables are maintained in JPY or in separate foreign-currency accounts.
- Which real company bank accounts exist for USD, EUR, and GBP.
- Approved exchange-rate source and update schedule.
- Commercial FX spread/buffer policy.
- Quote validity period by market/currency.
- Realized and unrealized gain/loss accounts.
