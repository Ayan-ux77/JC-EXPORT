import { MailCheck, ShieldCheck, Timer } from "lucide-react";

import { VerifyOtpForm } from "../components/auth-forms";
import styles from "../auth.module.css";

type VerifyOtpPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: VerifyOtpPageProps) {
  const { email = "" } = await searchParams;

  return (
    <section className={styles.page}>
      <aside className={styles.aside}>
        <div>
          <p className={styles.eyebrow}>Confirm your email</p>
          <h1>
            One code away from a <em>verified account.</em>
          </h1>
          <p>
            Enter the 6-digit code we emailed you to confirm this address is
            yours.
          </p>
        </div>
        <ul className={styles.trustList}>
          <li><MailCheck aria-hidden="true" /> Email-based verification</li>
          <li><Timer aria-hidden="true" /> Codes expire after 15 minutes</li>
          <li><ShieldCheck aria-hidden="true" /> Your account stays active either way</li>
        </ul>
      </aside>

      <div className={styles.main}>
        <section className={styles.panel}>
          <p className={styles.formEyebrow}>Email verification</p>
          <h2>Verify your email</h2>
          <p className={styles.intro}>
            Check your inbox for the code we sent when you registered.
          </p>
          <VerifyOtpForm email={email} />
        </section>
      </div>
    </section>
  );
}
