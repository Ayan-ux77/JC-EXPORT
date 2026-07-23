import Link from "next/link";

import styles from "./public-pages.module.css";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalDocument({
  eyebrow,
  title,
  introduction,
  updated,
  sections,
}: LegalDocumentProps) {
  return (
    <main className={styles.legalPage}>
      <header className={styles.legalHeader}>
        <div>
          <Link href="/">JC Export</Link>
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{introduction}</p>
          <small>Last updated: {updated}</small>
        </div>
      </header>

      <div className={styles.legalLayout}>
        <aside>
          <strong>On this page</strong>
          <nav aria-label={`${title} sections`}>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
          <Link href="/contact">Questions about this policy?</Link>
        </aside>

        <article className={styles.legalContent}>
          {sections.map((section, index) => (
            <section key={section.id} id={section.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
