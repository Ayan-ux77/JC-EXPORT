import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, Ship } from "lucide-react";

import { ContactInquiryForm } from "../components/contact-inquiry-form";
import { PublicPageHero } from "../components/public-page-hero";
import styles from "../components/public-pages.module.css";

const bodyFont = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-body" });
const displayFont = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], weight: ["500", "600", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Contact Japan Car Export | Japanese Vehicle Export Support",
  description: "Contact Japan Car Export about vehicle sourcing, quotes, shipping, payments, documents, or an existing export order.",
};

const channels = [
  { icon: MessageCircle, label: "Fastest response", title: "WhatsApp", value: "+92 300 123 4567", href: "https://wa.me/923001234567" },
  { icon: Phone, label: "Speak with sales", title: "Direct phone", value: "+92 300 123 4567", href: "tel:+923001234567" },
  { icon: Mail, label: "Quotes and documents", title: "Email", value: "sales@jcexport.com", href: "mailto:sales@jcexport.com" },
  { icon: MapPin, label: "Client support", title: "Peshawar office", value: "Pakistan", href: undefined },
];

export default function ContactPage() {
  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <PublicPageHero
        current="Contact"
        kicker="Export support desk"
        title={<>Talk to the team handling <em>your next step.</em></>}
        description="Ask about available vehicles, a sourcing request, shipping routes, payment, documentation, or the status of an existing shipment."
        actions={<Link href="/quote" className={styles.heroPrimary}>Request a vehicle quote <ArrowRight aria-hidden="true" /></Link>}
      />

      <section className={styles.contactPage} aria-labelledby="contact-options-title">
        <div className={styles.sectionHeadingRow}>
          <div><p className={styles.sectionKicker}>Choose a channel</p><h2 id="contact-options-title">Reach us in the way that <em>fits the question.</em></h2></div>
          <p>WhatsApp is usually fastest for stock and shipping questions. Email is better when you need to attach documents or keep a formal record.</p>
        </div>

        <div className={styles.channelGrid}>
          {channels.map((channel) => {
            const Icon = channel.icon;
            const content = <><Icon aria-hidden="true" /><span>{channel.label}</span><h3>{channel.title}</h3><p>{channel.value}</p>{channel.href && <small>Open channel <ArrowRight aria-hidden="true" /></small>}</>;
            return channel.href ? <a key={channel.title} href={channel.href} className={styles.channelCard}>{content}</a> : <article key={channel.title} className={styles.channelCard}>{content}</article>;
          })}
        </div>

        <div className={styles.contactLayout}>
          <div className={styles.contactContext}>
            <p className={styles.sectionKicker}>Send a general inquiry</p>
            <h2>Give us enough context to <em>answer properly.</em></h2>
            <p>Include a stock number for vehicle questions, the destination port for freight questions, and your invoice or shipment reference for an existing order.</p>
            <div className={styles.contactTips}>
              <span><Clock3 aria-hidden="true" /><strong>Business-day replies</strong><small>Urgent sailing matters should be sent through WhatsApp.</small></span>
              <span><Ship aria-hidden="true" /><strong>Shipment questions</strong><small>Include the stock, invoice, or bill-of-lading reference.</small></span>
              <span><Mail aria-hidden="true" /><strong>Document review</strong><small>Email is preferred when attachments are required.</small></span>
            </div>
          </div>
          <ContactInquiryForm />
        </div>
      </section>

      <section className={styles.contactLinksBand}>
        <div><strong>Looking for a quick answer?</strong><span>Read common questions about condition, shipping, payment, and documents.</span></div>
        <Link href="/faq">Browse FAQs <ArrowRight aria-hidden="true" /></Link>
        <Link href="/shipping-and-payment">Shipping and payment guide <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
