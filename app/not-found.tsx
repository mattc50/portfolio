import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.section}>
      <span className={styles.eyebrow}>404</span>
      <h1 className={styles.heading}>Page not found</h1>
      <Link href="/" className={styles.back}>← Back home</Link>
    </section>
  );
}
