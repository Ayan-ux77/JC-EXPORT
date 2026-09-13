import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

import { ResetPasswordForm } from "../components/auth-forms";
import styles from "../auth.module.css";

type ResetPasswordPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { email = "" } = await searchParams;

  return (
    <section className={styles.page}>
      <aside className={styles.aside}>
        <div>
          <p className={styles.eyebrow}>Secure account recovery</p>
          <h1>
            Choose a new <em>strong password.</em>
          </h1>
          <p>
            Enter the 6-digit code we emailed you along with your new
            password.
          </p>
        </div>
        <ul className={styles.trustList}>
          <li><KeyRound aria-hidden="true" /> Single-use recovery code</li>
          <li><LockKeyhole aria-hidden="true" /> Minimum 10 characters</li>
          <li><ShieldCheck aria-hidden="true" /> Automatic secure sign-in</li>
        </ul>
      </aside>

      <div className={styles.main}>
        <section className={styles.panel}>
          <p className={styles.formEyebrow}>Final recovery step</p>
          <h2>Set new password</h2>
          <p className={styles.intro}>
            Use at least 10 characters, including a letter and a number.
          </p>
          <ResetPasswordForm email={email} />
        </section>
      </div>
    </section>
  );
}
