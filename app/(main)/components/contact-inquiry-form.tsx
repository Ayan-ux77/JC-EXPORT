"use client";

import { useState, type FormEvent } from "react";
import { Check, MessageCircle, Send } from "lucide-react";

import styles from "./public-pages.module.css";

export function ContactInquiryForm() {
  const [opened, setOpened] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hello JC Export, I have a question.",
      `Name: ${data.get("name")}`,
      `Subject: ${data.get("subject")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Message: ${data.get("message")}`,
    ].join("\n");
    window.open(
      `https://wa.me/923001234567?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setOpened(true);
  }

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
      <button type="submit" className={styles.contactSubmit}>
        <MessageCircle aria-hidden="true" /> Continue in WhatsApp
      </button>
      {opened && (
        <p className={styles.formOpenedMessage}>
          <Check aria-hidden="true" /> WhatsApp opened. Send the prepared message to complete your inquiry.
        </p>
      )}
    </form>
  );
}
