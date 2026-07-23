"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Fuel } from "lucide-react";

import { submitWebsiteInquiry } from "@/data/website-inquiries";

import styles from "../page.module.css";

export function HomeInquiryForm() {
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await submitWebsiteInquiry({
        inquiryType: "Sourcing Request",
        name: String(form.get("name") || ""),
        country: String(form.get("country") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        bodyType: String(form.get("vehicle") || ""),
        message: String(form.get("message") || ""),
        privacyConsent: form.get("privacyConsent") === "on",
      });
      setReference(result.data.reference);
      sessionStorage.setItem(
        `jcexport-inquiry:${result.data.reference}`,
        result.data.lookup_token,
      );
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

  return (
    <form className={styles.quoteForm} onSubmit={submit}>
      <div className={styles.quoteFormHeader}>
        <span>Export inquiry</span>
        <Fuel aria-hidden="true" />
      </div>
      <div className={styles.formGrid}>
        <label>
          <span>Full name</span>
          <input name="name" type="text" required placeholder="Your name" autoComplete="name" />
        </label>
        <label>
          <span>Destination country</span>
          <input name="country" type="text" required placeholder="e.g. Kenya" autoComplete="country-name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
        </label>
        <label>
          <span>Phone / WhatsApp</span>
          <input name="phone" type="tel" placeholder="+00 000 000 000" autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>Vehicle interest</span>
        <select name="vehicle" defaultValue="">
          <option value="">Select a body type</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
        </select>
      </label>
      <label>
        <span>What should we source?</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Make, model, year range, budget, and any must-have features"
        />
      </label>
      <label className={styles.homeConsent}>
        <input name="privacyConsent" type="checkbox" required />
        <span>I agree to the privacy policy and consent to a response about this request.</span>
      </label>
      <button type="submit" className={styles.submitButton} disabled={submitting || Boolean(reference)}>
        {reference ? (
          <><Check aria-hidden="true" /> Inquiry sent</>
        ) : (
          <>{submitting ? "Sending..." : "Send inquiry"} <ArrowRight aria-hidden="true" /></>
        )}
      </button>
      {reference && (
        <p className={styles.formSuccess} role="status">
          <Check aria-hidden="true" /> Received as {reference}. Create an account
          with the same email to track it in your portal.
        </p>
      )}
      {error && <p className={styles.formError} role="alert">{error}</p>}
      {!reference && (
        <p className={styles.formNote}>
          We only use your details to respond to this request.
        </p>
      )}
    </form>
  );
}
