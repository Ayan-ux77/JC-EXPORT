import styles from "./portal.module.css";

export default function AccountLoading() {
  return (
    <div className={styles.loading} aria-label="Loading account">
      <span />
      <span />
      <span />
    </div>
  );
}
