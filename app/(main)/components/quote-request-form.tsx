"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  MapPin,
  Send,
  Ship,
} from "lucide-react";

import { submitWebsiteInquiry } from "@/data/website-inquiries";
import styles from "./public-pages.module.css";

type QuoteRequestFormProps = {
  initialVehicle?: string;
  initialVehicleId?: string;
};

type QuoteValues = {
  vehicle: string;
  make: string;
  model: string;
  year: string;
  budget: string;
  country: string;
  port: string;
  shipping: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
};

const steps = ["Vehicle", "Destination", "Contact"];

export function QuoteRequestForm({
  initialVehicle = "",
  initialVehicleId = "",
}: QuoteRequestFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState("");
  const [error, setError] = useState("");
  const [values, setValues] = useState<QuoteValues>({
    vehicle: initialVehicle,
    make: "",
    model: "",
    year: "",
    budget: "",
    country: "",
    port: "",
    shipping: "Not sure",
    name: "",
    email: "",
    phone: "",
    message: "",
    privacyConsent: false,
    marketingConsent: false,
  });

  const canContinue =
    step === 0
      ? Boolean(values.vehicle || values.make)
      : step === 1
        ? Boolean(values.country)
        : Boolean(
            values.name &&
              (values.phone || values.email) &&
              values.privacyConsent,
          );

  function update(field: keyof QuoteValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submitRequest() {
    setSubmitting(true);
    setError("");
    try {
      const result = await submitWebsiteInquiry({
        source: "WEBSITE",
        vehicleSlug: initialVehicleId || undefined,
        vehicle: values.vehicle,
        make: values.make,
        model: values.model,
        year: values.year,
        budget: values.budget,
        country: values.country,
        port: values.port,
        shipping: values.shipping,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        privacyConsent: values.privacyConsent,
      });
      const reference = result.data.reference;
      setSubmittedReference(reference);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We could not send your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappUrl = submittedReference
    ? `https://wa.me/923001234567?text=${encodeURIComponent(
        [
          "Hello JC Export, I submitted an export quote request.",
          `Inquiry reference: ${submittedReference}`,
          `Vehicle/stock: ${values.vehicle || "Sourcing request"}`,
        ].join("\n"),
      )}`
    : "";

  return (
    <div className={styles.quoteFormShell}>
      <div className={styles.quoteProgress}>
        {steps.map((label, index) => (
          <div key={label} data-active={index <= step}>
            <span>{index < step ? <Check aria-hidden="true" /> : index + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>

      <div className={styles.quoteStep} hidden={step !== 0}>
        <p className={styles.formEyebrow}>Step 1 of 3</p>
        <h2>What vehicle do you need?</h2>
        <p>Use a stock number or describe the vehicle you want us to source.</p>
        <div className={styles.formGrid}>
          <label className={styles.fullField}>
            <span>Vehicle or stock number</span>
            <input
              value={values.vehicle}
              onChange={(event) => update("vehicle", event.target.value)}
              placeholder="e.g. TC-2026-0155 or Toyota Corolla"
            />
          </label>
          <label>
            <span>Preferred make</span>
            <input value={values.make} onChange={(event) => update("make", event.target.value)} placeholder="Toyota" />
          </label>
          <label>
            <span>Preferred model</span>
            <input value={values.model} onChange={(event) => update("model", event.target.value)} placeholder="Land Cruiser" />
          </label>
          <label>
            <span>Year or range</span>
            <input value={values.year} onChange={(event) => update("year", event.target.value)} placeholder="2019–2022" />
          </label>
          <label>
            <span>Maximum budget (USD)</span>
            <div className={styles.inputWithIcon}>
              <CircleDollarSign aria-hidden="true" />
              <input value={values.budget} onChange={(event) => update("budget", event.target.value)} placeholder="15,000" />
            </div>
          </label>
        </div>
      </div>

      <div className={styles.quoteStep} hidden={step !== 1}>
        <p className={styles.formEyebrow}>Step 2 of 3</p>
        <h2>Where should it be shipped?</h2>
        <p>Destination determines freight, vessel options, and documentation.</p>
        <div className={styles.formGrid}>
          <label>
            <span>Destination country</span>
            <div className={styles.inputWithIcon}>
              <MapPin aria-hidden="true" />
              <input value={values.country} onChange={(event) => update("country", event.target.value)} placeholder="Kenya" />
            </div>
          </label>
          <label>
            <span>Preferred port</span>
            <input value={values.port} onChange={(event) => update("port", event.target.value)} placeholder="Mombasa" />
          </label>
          <label className={styles.fullField}>
            <span>Shipping preference</span>
            <select value={values.shipping} onChange={(event) => update("shipping", event.target.value)}>
              <option>Not sure</option>
              <option>RoRo</option>
              <option>Container</option>
              <option>Shared container</option>
            </select>
          </label>
        </div>
        <div className={styles.formNotice}>
          <Ship aria-hidden="true" />
          <p><strong>We will confirm the practical route.</strong><span>Availability and pricing depend on vehicle dimensions, port access, and the next sailing.</span></p>
        </div>
      </div>

      <div className={styles.quoteStep} hidden={step !== 2}>
        <p className={styles.formEyebrow}>Step 3 of 3</p>
        <h2>Where should we reply?</h2>
        <p>Provide either WhatsApp or email. Both is better for shipping documents.</p>
        <div className={styles.formGrid}>
          <label className={styles.fullField}>
            <span>Full name</span>
            <input value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" />
          </label>
          <label>
            <span>WhatsApp / phone</span>
            <input value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+00 000 000 000" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" />
          </label>
          <label className={styles.fullField}>
            <span>Anything else?</span>
            <textarea value={values.message} onChange={(event) => update("message", event.target.value)} rows={4} placeholder="Color, mileage limit, must-have features, timing..." />
          </label>
        </div>
        <label className={styles.consentField}>
          <input
            type="checkbox"
            checked={values.privacyConsent}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                privacyConsent: event.target.checked,
              }))
            }
          />
          <span>I agree to the privacy policy and consent to JC Export using these details to respond to this inquiry.</span>
        </label>
        <label className={styles.consentField}>
          <input
            type="checkbox"
            checked={values.marketingConsent}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                marketingConsent: event.target.checked,
              }))
            }
          />
          <span>Send me relevant stock and export updates.</span>
        </label>
        {submittedReference && (
          <div className={styles.successNotice}>
            <Check aria-hidden="true" />
            <div>
              Request received. Your reference is <strong>{submittedReference}</strong>.
              {" "}
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                Continue in WhatsApp
              </a>
            </div>
          </div>
        )}
        {error && <div className={styles.errorNotice}>{error}</div>}
      </div>

      <div className={styles.quoteFormActions}>
        {step > 0 ? (
          <button type="button" className={styles.backButton} onClick={() => setStep((current) => current - 1)}>
            <ArrowLeft aria-hidden="true" /> Back
          </button>
        ) : <span />}
        {step < 2 ? (
          <button type="button" disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>
            Continue <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canContinue || submitting || Boolean(submittedReference)}
            onClick={submitRequest}
          >
            {submittedReference ? (
              <><Check aria-hidden="true" /> Request sent</>
            ) : (
              <><Send aria-hidden="true" /> {submitting ? "Sending..." : "Send quote request"}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
