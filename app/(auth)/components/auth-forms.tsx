"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";

import styles from "../auth.module.css";

type ErrorPayload = {
  error?: {
    message?: string;
  };
};

export function SignInForm({ nextPath = "/account" }: { nextPath?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          remember: form.get("remember") === "on",
        }),
      });
      const payload = (await response.json()) as ErrorPayload;
      if (!response.ok) {
        throw new Error(payload.error?.message || "Sign in failed.");
      }
      router.replace(safeNextPath(nextPath));
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in failed.");
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </label>
      <label className={styles.passwordField}>
        Password
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder="Your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </label>
      <div className={styles.options}>
        <label className={styles.check}>
          <input name="remember" type="checkbox" />
          <span>Keep me signed in</span>
        </label>
        <Link href="/forgot-password">Forgot password?</Link>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"} <ArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== String(form.get("confirmPassword") || "")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          currency: form.get("currency"),
          password,
          privacyConsent: form.get("privacyConsent") === "on",
        }),
      });
      const payload = (await response.json()) as ErrorPayload;
      if (!response.ok) {
        throw new Error(payload.error?.message || "Account creation failed.");
      }
      // An address that already has a portal login gets a 202 here, not a
      // fresh session -- there is no cookie to act on, only a nudge to sign
      // in with whatever password that account already uses.
      if (response.status === 202) {
        setPending(true);
        setSubmitting(false);
        return;
      }
      router.replace("/account");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Account creation failed.");
      setSubmitting(false);
    }
  }

  if (pending) {
    return (
      <div>
        <p className={styles.success}>
          <Check aria-hidden="true" /> An account with this email already exists.
        </p>
        <p className={styles.footer}>
          <Link href="/sign-in">Sign in instead</Link> or{" "}
          <Link href="/forgot-password">reset your password</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.fieldRow}>
        <label>
          Full name
          <input name="fullName" autoComplete="name" required placeholder="Your full name" />
        </label>
        <label>
          Company (optional)
          <input name="company" autoComplete="organization" placeholder="Company name" />
        </label>
      </div>
      <div className={styles.fieldRow}>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </label>
        <label>
          Phone / WhatsApp
          <input name="phone" type="tel" autoComplete="tel" placeholder="+00 000 000 000" />
        </label>
      </div>
      <label>
        Preferred transaction currency
        <select name="currency" defaultValue="USD">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </label>
      <div className={styles.fieldRow}>
        <label className={styles.passwordField}>
          Password
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={10}
            required
            placeholder="10+ characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </label>
        <label>
          Confirm password
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={10}
            required
            placeholder="Repeat password"
          />
        </label>
      </div>
      <label className={styles.check}>
        <input name="privacyConsent" type="checkbox" required />
        <span>
          I agree to the <Link href="/terms">terms</Link> and{" "}
          <Link href="/privacy">privacy policy</Link>.
        </span>
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={submitting}>
        {submitting ? "Creating account..." : "Create account"}
        <ArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as ErrorPayload;
      if (!response.ok) {
        throw new Error(payload.error?.message || "Request failed.");
      }
      setSentTo(email);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <div>
        <p className={styles.success}>
          <Check aria-hidden="true" /> If that address has an account, a 6-digit code is on its way.
        </p>
        <p className={styles.footer}>
          <Link href={`/reset-password?email=${encodeURIComponent(sentTo)}`}>
            Enter the code
          </Link>{" "}
          or <Link href="/sign-in">return to sign in</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send reset code"}
        <ArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}

export function ResetPasswordForm({ email = "" }: { email?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== String(form.get("confirmPassword") || "")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          code: form.get("code"),
          password,
        }),
      });
      const payload = (await response.json()) as ErrorPayload;
      if (!response.ok) {
        throw new Error(payload.error?.message || "Password reset failed.");
      }
      router.replace("/account");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Password reset failed.");
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={email}
          placeholder="you@example.com"
        />
      </label>
      <label>
        6-digit code
        <input
          name="code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="one-time-code"
          required
          placeholder="123456"
        />
      </label>
      <label>
        New password
        <input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label>
        Confirm password
        <input name="confirmPassword" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={submitting}>
        {submitting ? "Updating..." : "Set new password"}
        <ArrowRight aria-hidden="true" />
      </button>
      <p className={styles.footer}>
        Didn&apos;t get a code? <Link href="/forgot-password">Send another</Link>
      </p>
    </form>
  );
}

export function VerifyOtpForm({ email = "" }: { email?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          code: form.get("code"),
        }),
      });
      const payload = (await response.json()) as ErrorPayload;
      if (!response.ok) {
        throw new Error(payload.error?.message || "That code is not valid or has expired.");
      }
      setVerified(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "That code is not valid or has expired.");
    } finally {
      setSubmitting(false);
    }
  }

  async function resend(currentEmail: string) {
    setError("");
    setResent(false);
    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as ErrorPayload;
        throw new Error(payload.error?.message || "Could not resend the code.");
      }
      setResent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not resend the code.");
    }
  }

  if (verified) {
    return (
      <div>
        <p className={styles.success}>
          <Check aria-hidden="true" /> Your email is verified.
        </p>
        <p className={styles.footer}>
          <Link
            href="/sign-in"
            onClick={(event) => {
              event.preventDefault();
              router.replace("/sign-in");
              router.refresh();
            }}
          >
            Continue to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={email}
          placeholder="you@example.com"
        />
      </label>
      <label>
        6-digit code
        <input
          name="code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="one-time-code"
          required
          placeholder="123456"
        />
      </label>
      {resent && (
        <p className={styles.success}>
          <Check aria-hidden="true" /> A new code is on its way.
        </p>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit" disabled={submitting}>
        {submitting ? "Verifying..." : "Verify email"}
        <ArrowRight aria-hidden="true" />
      </button>
      <button
        className={styles.footer}
        type="button"
        onClick={(event) => {
          const emailInput = event.currentTarget.form?.elements.namedItem("email") as HTMLInputElement | null;
          void resend(emailInput?.value || "");
        }}
      >
        Resend code
      </button>
    </form>
  );
}

function safeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}
