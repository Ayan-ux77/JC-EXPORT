import type { ReactNode } from "react";
import type { CSSProperties } from "react";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import styles from "./public-pages.module.css";

type PublicPageHeroProps = {
  current: string;
  kicker: string;
  title: ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
  /**
   * Focal points for `image`, from data/hero.ts. Without it the banner falls
   * back to dead centre, which cuts the cars out of a portrait source.
   */
  focal?: CSSProperties;
  actions?: ReactNode;
};

export function PublicPageHero({
  current,
  kicker,
  title,
  description,
  image,
  imageAlt = "",
  focal,
  actions,
}: PublicPageHeroProps) {
  return (
    <section className={styles.hero} style={focal}>
      {image && (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className={styles.heroImage}
        />
      )}
      <div className={styles.heroOverlay} />
      <div className={styles.heroInner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight aria-hidden="true" />
          <span>{current}</span>
        </nav>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.heroDescription}>{description}</p>
        {actions && <div className={styles.heroActions}>{actions}</div>}
      </div>
    </section>
  );
}
