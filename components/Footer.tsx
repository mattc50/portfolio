"use client";

import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        © Matthew Canabarro 2026
      </span>
      <div className={styles["footer-links"]}>
        <a href="https://www.linkedin.com/in/matthew-canabarro/">
          <img src="/footer/linkedin.svg" />
        </a>
        <a href="https://github.com/mattc50">
          <img src="/footer/github.svg" />
        </a>
      </div>
    </footer>
  )
}