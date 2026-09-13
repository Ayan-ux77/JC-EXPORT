import Link from "next/link";
import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";

import { ForgotPasswordForm } from "../components/auth-forms";
import styles from "../auth.module.css";

export default function ForgotPasswordPage() {
  return (
    <section className={styles.page}>
      <aside className={styles.aside}>
        <div>
          <p className={styles.eyebrow}>Account recovery</p>
          <h1>
            Get back to your <em>vehicle journey.</em>
          </h1>
          <p>
            We will send a secure password reset link to the email connected to
            your Japan Car Export customer account.
          </p>
        </div>
        <ul className={styles.trustList}>
          <li><MailCheck aria-hidden="true" /> Email-based recovery</li>
          <li><KeyRound aria-hidden="true" /> Single-use reset link</li>
          <li><ShieldCheck aria-hidden="true" /> Existing sessions protected</li>
        </ul>
      </aside>

      <div className={styles.main}>
        <section className={styles.panel}>
          <p className={styles.formEyebrow}>Password assistance</p>
          <h2>Reset password</h2>
          <p className={styles.intro}>
            Enter your account email. For security, we show the same
            confirmation whether or not an account exists.
          </p>
          <ForgotPasswordForm />
          <p className={styles.footer}>
            Remembered it? <Link href="/sign-in">Return to sign in</Link>
          </p>
        </section>
      </div>
    </section>
  );
}
