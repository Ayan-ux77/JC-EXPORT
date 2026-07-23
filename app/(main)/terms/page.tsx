import type { Metadata } from "next";

import { LegalDocument, type LegalSection } from "../components/legal-document";

export const metadata: Metadata = {
  title: "Terms and Conditions | JC Export",
  description: "Terms governing vehicle inquiries, quotations, payments, exports, shipping, and use of the JC Export website.",
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Scope and agreement",
    paragraphs: [
      "These terms apply to your use of the JC Export website and to vehicle quotations, invoices, sourcing requests, export services, and related communications issued by JC Export.",
      "A vehicle transaction is also governed by its written quotation, pro forma invoice, final invoice, and any service-specific terms. If those transaction documents conflict with general website information, the transaction documents control for that sale.",
    ],
  },
  {
    id: "vehicle-information",
    title: "Used vehicles and information",
    paragraphs: [
      "JC Export deals in used vehicles. Normal wear, age-related deterioration, previous repairs, paintwork, replacement parts, and differences in cosmetic condition may exist.",
      "Mileage, auction grades, inspection notes, photographs, translations, and specifications are provided from available records and observations. They assist evaluation but do not create a new-vehicle standard or an independent warranty unless a written warranty is expressly included.",
    ],
    bullets: [
      "Review all available photographs, auction information, and condition notes before payment.",
      "Confirm model, chassis, engine, steering side, fuel type, dimensions, and destination eligibility.",
      "Request additional evidence or an inspection before purchase when a point is material to your decision.",
    ],
  },
  {
    id: "quotes",
    title: "Quotations and pricing",
    paragraphs: [
      "Quotations are based on the vehicle, destination, exchange conditions, freight, insurance, and services stated at the time of issue. They remain valid only for the period shown and while the vehicle and shipping basis remain available.",
      "Unless expressly included, destination customs duty, local tax, port handling, clearance, inspection, registration, storage, demurrage, and inland delivery are the buyer's responsibility.",
    ],
  },
  {
    id: "payment",
    title: "Payment and verification",
    paragraphs: [
      "Payment must follow the amount, currency, due date, and account details on the issued invoice. Vehicle reservation, preparation, and booking are subject to cleared funds and any stated deposit terms.",
      "The buyer must independently verify banking details using an established JC Export contact before transfer, especially if a change is communicated. Bank fees, intermediary charges, and exchange losses are the buyer's responsibility unless agreed otherwise in writing.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation and refunds",
    paragraphs: [
      "Used vehicles, auction purchases, inspections, inland transport, documentation, and shipping bookings can create non-recoverable costs. Cancellation eligibility and any refund are therefore determined by the stage of the transaction and the terms written on the invoice.",
      "No refund is guaranteed after a vehicle has been purchased on instruction, export work has begun, or third-party costs have been committed. Any approved refund may be reduced by incurred costs, bank charges, exchange differences, and cancellation fees.",
    ],
  },
  {
    id: "shipping",
    title: "Shipping, timing, and risk",
    paragraphs: [
      "Sailing and arrival dates are estimates supplied through carriers and ports. Vessel changes, weather, congestion, transshipment, customs action, force majeure, and other events outside JC Export's control may delay shipment.",
      "Risk, insurance coverage, claim procedures, and title transfer follow the agreed sale terms, shipping documents, and applicable carrier or insurer conditions. The buyer must inspect promptly at arrival and preserve evidence for any time-limited claim.",
    ],
  },
  {
    id: "import",
    title: "Import and destination compliance",
    paragraphs: [
      "The buyer is responsible for confirming that the vehicle can lawfully be imported, cleared, registered, and used in the destination. This includes age restrictions, emissions, roadworthiness, steering-side rules, taxes, permits, and consignee requirements.",
      "JC Export may provide practical information but does not act as the buyer's legal, tax, customs, or registration adviser unless a specific destination service is agreed in writing.",
    ],
  },
  {
    id: "liability",
    title: "Liability",
    paragraphs: [
      "To the extent permitted by applicable law, JC Export is not responsible for indirect or consequential loss, lost profit, loss of use, destination-law changes, or third-party delays. Nothing in these terms excludes liability that cannot lawfully be excluded.",
      "Any transaction concern should be reported promptly with the chassis number, invoice, photographs, carrier or port records, and a clear description so it can be assessed against the written sale and service terms.",
    ],
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    paragraphs: [
      "These terms may be updated as services, regulations, or business processes change. The version published when you use the site applies to that use; transaction documents already issued remain subject to their own terms.",
      "Questions about these terms or a specific transaction can be sent through the JC Export contact page before you proceed.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms and Conditions"
      introduction="The practical rules governing used-vehicle information, quotations, payment, export work, shipping, and destination responsibilities."
      updated="July 2026"
      sections={sections}
    />
  );
}
