"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";

import { submitWebsiteInquiry } from "@/data/website-inquiries";
import styles from "./public-pages.module.css";

export function ContactInquiryForm() {
  const [submittedReference, setSubmittedReference] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const subject = String(data.get("subject") || "");
      const result = await submitWebsiteInquiry({
        source: "CONTACT_FORM",
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        subject,
        message: String(data.get("message") || ""),
        privacyConsent: data.get("privacyConsent") === "on",
      });
      setSubmittedReference(result.data.reference);
      event.currentTarget.reset();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We could not send your inquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappUrl = submittedReference
    ? `https://wa.me/923001234567?text=${encodeURIComponent(
        `Hello JC Export, I submitted inquiry ${submittedReference}.`,
      )}`
    : "";

  return (
    <form className={styles.contactForm} onSubmit={submit}>
      <div className={styles.contactFormHeading}>
        <div>
          <span>General inquiry</span>
          <h2>Send us a message</h2>
        </div>
        <Send aria-hidden="true" />
      </div>
      <div className={styles.formGrid}>
        <label>
          <span>Full name</span>
          <input name="name" required placeholder="Your name" autoComplete="name" />
        </label>
        <label>
          <span>Subject</span>
          <select name="subject" defaultValue="Vehicle question">
            <option>Vehicle question</option>
            <option>Shipping update</option>
            <option>Documentation</option>
            <option>Payment question</option>
            <option>Partnership</option>
          </select>
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
        </label>
        <label>
          <span>WhatsApp / phone</span>
          <input name="phone" placeholder="+00 000 000 000" autoComplete="tel" />
        </label>
        <label className={styles.fullField}>
          <span>Message</span>
          <textarea name="message" required rows={6} placeholder="Tell us how we can help" />
        </label>
      </div>
      <label className={styles.consentField}>
        <input name="privacyConsent" type="checkbox" required />
        <span>I agree to the privacy policy and consent to JC Export using these details to respond to this inquiry.</span>
      </label>
      <button
        type="submit"
        className={styles.contactSubmit}
        disabled={submitting || Boolean(submittedReference)}
      >
        {submittedReference ? (
          <><Check aria-hidden="true" /> Inquiry sent</>
        ) : (
          <><Send aria-hidden="true" /> {submitting ? "Sending..." : "Send inquiry"}</>
        )}
      </button>
      {submittedReference && (
        <p className={styles.formOpenedMessage}>
          <Check aria-hidden="true" /> Inquiry received as {submittedReference}.
          {" "}
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Continue in WhatsApp
          </a>
        </p>
      )}
      {error && <p className={styles.errorNotice}>{error}</p>}
    </form>
  );
}
