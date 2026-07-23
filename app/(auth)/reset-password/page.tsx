import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

import { ResetPasswordForm } from "../components/auth-forms";
import styles from "../auth.module.css";

type ResetPasswordPageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { key = "" } = await searchParams;

  return (
    <section className={styles.page}>
      <aside className={styles.aside}>
        <div>
          <p className={styles.eyebrow}>Secure account recovery</p>
          <h1>
            Choose a new <em>strong password.</em>
          </h1>
          <p>
            Your new password is sent directly to the ERP authentication
            service and is never stored by the website.
          </p>
        </div>
        <ul className={styles.trustList}>
          <li><KeyRound aria-hidden="true" /> Single-use recovery key</li>
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
          <ResetPasswordForm resetKey={key} />
        </section>
      </div>
    </section>
  );
}
