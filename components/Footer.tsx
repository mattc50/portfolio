"use client";

import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInfo}>
        <span>
          © Matthew Canabarro 2026
        </span><br />
        <span>
          Built with <img src="/footer/heart.svg" /> <span style={{ whiteSpace: "nowrap" }}>using Next.js & TypeScript</span>
        </span>
      </div>
      <div className={styles.footerLinks}>
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