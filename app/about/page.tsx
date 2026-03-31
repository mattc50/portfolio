import type { Metadata } from "next";
import { about } from "@/lib/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
};

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 4L7 7.5L11.5 4M3 10.5H11C11.2761 10.5 11.5 10.2761 11.5 10V4C11.5 3.72386 11.2761 3.5 11 3.5H3C2.72386 3.5 2.5 3.72386 2.5 4V10C2.5 10.2761 2.72386 10.5 3 10.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

export default function AboutPage() {
  return (
    <section className={styles.section}>
      <div className={`${styles.header} anim-fade-up`}>
        <span className={styles.eyebrow}>About</span>
        <h1 className={styles.heading}>{about.intro}</h1>
      </div>

      <div className={styles.body}>
        {/* Bio */}
        <div className={`${styles.bio} anim-fade-up delay-2`}>
          {about.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} anim-fade-up delay-3`}>
          <div className={styles.sidebarSection}>
            <h2>Currently</h2>
            <ul>
              {about.currently.map((item, index) => {
                return (
                  index < about.currently.length - 1
                    ? <li key={item}>{item}</li>
                    : (
                      <li>
                        <a href="mailto:mattcanabarro50@gmail.com?subject=Hello%20from%20Your%20Portfolio!">
                          <EmailIcon />{item}
                        </a>
                      </li>
                    )
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
