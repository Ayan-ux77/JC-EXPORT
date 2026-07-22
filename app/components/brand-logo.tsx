import styles from "./brand-logo.module.css";

type BrandLogoProps = {
  tone?: "on-light" | "on-dark";
  size?: "compact" | "default" | "footer";
};

export function BrandLogo({
  tone = "on-light",
  size = "default",
}: BrandLogoProps) {
  return (
    <span
      className={styles.logo}
      data-tone={tone}
      data-size={size}
      role="img"
      aria-label="JC Export"
    >
      <span className={styles.j}>J</span>
      <span className={styles.c}>C</span>
      <span className={styles.export}>Export</span>
    </span>
  );
}
