import type { Metadata } from "next";

import { LegalDocument, type LegalSection } from "../components/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy | JC Export",
  description: "How JC Export collects, uses, shares, protects, and retains personal information.",
};

const sections: LegalSection[] = [
  {
    id: "information",
    title: "Information we collect",
    paragraphs: [
      "We collect information you provide when requesting a quote, asking a question, sourcing a vehicle, making a purchase, or arranging shipment and documents.",
    ],
    bullets: [
      "Name, email address, phone or WhatsApp number, country, and preferred contact method.",
      "Vehicle requirements, destination port, budget, inquiry messages, and transaction history.",
      "Consignee, identification, company, address, and document details needed for payment, export, shipping, or compliance.",
      "Basic technical data such as browser, device, page activity, and security logs when available.",
    ],
  },
  {
    id: "use",
    title: "How we use information",
    paragraphs: [
      "We use personal information to respond to inquiries, prepare quotations, source and sell vehicles, verify payment, arrange services, communicate shipment progress, issue documents, prevent fraud, maintain records, and improve the website.",
      "Where permitted, we may also use contact details to follow up on an inquiry or share relevant vehicle and service information. You can ask us to stop non-essential marketing communication.",
    ],
  },
  {
    id: "sharing",
    title: "When information is shared",
    paragraphs: [
      "Information is shared only as reasonably needed to operate the service, complete a transaction, comply with law, or protect legitimate interests.",
    ],
    bullets: [
      "Banks, payment and fraud-prevention providers.",
      "Vehicle suppliers, auction channels, inspectors, yards, transporters, carriers, ports, insurers, and document agents.",
      "Customs, regulators, law-enforcement bodies, or professional advisers where required or appropriate.",
      "Technology and communications providers that support hosting, email, analytics, customer service, or security.",
    ],
  },
  {
    id: "messaging",
    title: "WhatsApp and external services",
    paragraphs: [
      "When you choose WhatsApp, email, a carrier portal, or another external service, that provider processes information under its own terms and privacy policy. Messages may include your contact details, vehicle interest, destination, and inquiry text.",
      "The quote and contact forms on this website may prepare a message for you to send through WhatsApp. You can review that message before sending it.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and technical data",
    paragraphs: [
      "The website may use necessary storage, cookies, logs, and measurement tools for security, operation, preferences, and performance. If optional analytics or advertising tools are introduced, they should be managed in accordance with applicable consent requirements.",
    ],
  },
  {
    id: "retention",
    title: "Retention",
    paragraphs: [
      "We retain information for as long as reasonably needed for the inquiry, transaction, shipping, accounting, warranty or claim handling, fraud prevention, legal obligations, and dispute resolution. Different records may have different retention periods.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We use reasonable organizational and technical measures designed to protect information. No internet transmission, messaging platform, or storage system can be guaranteed completely secure.",
      "Do not send payment solely because of an unexpected message. Verify bank-detail changes through a trusted JC Export contact before transferring funds.",
    ],
  },
  {
    id: "rights",
    title: "Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to request access, correction, deletion, restriction, objection, portability, or withdrawal of consent. Some records must still be kept for legal, accounting, security, or transaction purposes.",
      "To make a request, use the contact page and identify the information or communication involved. We may need to verify your identity before acting.",
    ],
  },
  {
    id: "international",
    title: "International handling",
    paragraphs: [
      "Vehicle export is international by nature. Information may be handled in Japan, the buyer's country, shipping locations, and countries where service providers operate. We take reasonable steps to use information consistently with this policy and applicable requirements.",
    ],
  },
  {
    id: "changes-contact",
    title: "Policy changes and contact",
    paragraphs: [
      "We may update this policy when services, providers, or legal requirements change. The current version and update date will be published on this page.",
      "Questions or privacy requests can be submitted through the JC Export contact page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Privacy Policy"
      introduction="How JC Export handles the information needed to answer inquiries, arrange used-vehicle exports, coordinate shipping, and protect transactions."
      updated="July 2026"
      sections={sections}
    />
  );
}
