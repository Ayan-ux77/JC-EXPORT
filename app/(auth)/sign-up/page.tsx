import Link from "next/link";
import { CircleDollarSign, ClipboardCheck, UserRoundCheck } from "lucide-react";

import { RegisterForm } from "../components/auth-forms";
import styles from "../auth.module.css";

export default function SignUpPage() {
  return (
    <section className={styles.page}>
      <aside className={styles.aside}>
        <div>
          <p className={styles.eyebrow}>Create your customer account</p>
          <h1>
            Buy from Japan with <em>fewer unknowns.</em>
          </h1>
          <p>
            Your account connects inquiries, vehicle quotations, reservations,
            payments, shipping, and documents to one customer record.
          </p>
        </div>
        <ul className={styles.trustList}>
          <li><ClipboardCheck aria-hidden="true" /> Verified vehicle information</li>
          <li><CircleDollarSign aria-hidden="true" /> Clear FOB and CIF pricing</li>
          <li><UserRoundCheck aria-hidden="true" /> Direct export support</li>
        </ul>
      </aside>

      <div className={styles.main}>
        <section className={styles.panel}>
          <p className={styles.formEyebrow}>Customer registration</p>
          <h2>Create account</h2>
          <p className={styles.intro}>
            Register once to keep every vehicle request and export milestone
            under the same secure profile.
          </p>
          <RegisterForm />
          <p className={styles.footer}>
            Already registered? <Link href="/sign-in">Sign in</Link>
          </p>
        </section>
      </div>
    </section>
  );
}
