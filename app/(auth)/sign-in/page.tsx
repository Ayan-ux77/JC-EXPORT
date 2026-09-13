import Link from "next/link";
import { FileCheck2, ShieldCheck, Ship } from "lucide-react";

import { SignInForm } from "../components/auth-forms";
import styles from "../auth.module.css";

type SignInPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next = "/account" } = await searchParams;

  return (
    <section className={styles.page}>
      <aside className={styles.aside}>
        <div>
          <p className={styles.eyebrow}>Japan Car Export customer portal</p>
          <h1>
            Your vehicle journey, <em>clearly tracked.</em>
          </h1>
          <p>
            Sign in to review your inquiries, reservations, invoices, payments, shipping
            progress, and export documents in one secure place.
          </p>
        </div>
        <ul className={styles.trustList}>
          <li><ShieldCheck aria-hidden="true" /> Secure account, tied to your records</li>
          <li><Ship aria-hidden="true" /> Live shipment milestones</li>
          <li><FileCheck2 aria-hidden="true" /> Invoices and export documents</li>
        </ul>
      </aside>

      <div className={styles.main}>
        <section className={styles.panel}>
          <p className={styles.formEyebrow}>Welcome back</p>
          <h2>Sign in</h2>
          <p className={styles.intro}>
            Use the email and password connected to your Japan Car Export customer
            account.
          </p>
          <SignInForm nextPath={next} />
          <p className={styles.footer}>
            New to Japan Car Export? <Link href="/sign-up">Create an account</Link>
          </p>
        </section>
      </div>
    </section>
  );
}
