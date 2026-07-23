import { CircleDollarSign, Mail, UserRound } from "lucide-react";

import { getCustomerSession } from "@/data/customer-session";

import styles from "../portal.module.css";

export default async function ProfilePage() {
  const profile = await getCustomerSession();
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Customer record</p>
          <h1>Profile</h1>
          <span>Your website account is linked directly to this ERP customer.</span>
        </div>
      </header>
      {profile && (
        <section className={styles.profilePanel}>
          <div className={styles.profileAvatar}>
            <UserRound aria-hidden="true" />
          </div>
          <div className={styles.profileIdentity}>
            <span>Customer account</span>
            <h2>{profile.full_name}</h2>
            <p>{profile.customer_name}</p>
          </div>
          <dl>
            <div>
              <dt><Mail aria-hidden="true" /> Email</dt>
              <dd>{profile.user}</dd>
            </div>
            <div>
              <dt><CircleDollarSign aria-hidden="true" /> Default currency</dt>
              <dd>{profile.default_currency}</dd>
            </div>
            <div>
              <dt>ERP customer ID</dt>
              <dd>{profile.customer}</dd>
            </div>
          </dl>
          <p className={styles.profileNote}>
            Contact JC Export support to change legal company details or the
            customer transaction currency after invoices have been created.
          </p>
        </section>
      )}
    </>
  );
}
