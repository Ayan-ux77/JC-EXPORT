import { CircleDollarSign, Mail, Phone, UserRound } from "lucide-react";

import { getPortalOverview } from "@/data/customer-session";

import styles from "../portal.module.css";

export default async function ProfilePage() {
  const overview = await getPortalOverview();
  const profile = overview.profile;

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Customer record</p>
          <h1>Profile</h1>
          <span>Your website account is linked directly to your Japan Car Export customer record.</span>
        </div>
      </header>
      <section className={styles.profilePanel}>
        <div className={styles.profileAvatar}>
          <UserRound aria-hidden="true" />
        </div>
        <div className={styles.profileIdentity}>
          <span>Customer account</span>
          <h2>{profile.name}</h2>
          <p>{profile.company_name || profile.email}</p>
        </div>
        <dl>
          <div>
            <dt><Mail aria-hidden="true" /> Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt><Phone aria-hidden="true" /> Phone</dt>
            <dd>{profile.phone || "Not provided"}</dd>
          </div>
          <div>
            <dt><CircleDollarSign aria-hidden="true" /> Default currency</dt>
            <dd>{profile.default_currency}</dd>
          </div>
        </dl>
        <p className={styles.profileNote}>
          Contact Japan Car Export support to change legal company details or the
          customer transaction currency after invoices have been created.
        </p>
      </section>
    </>
  );
}
