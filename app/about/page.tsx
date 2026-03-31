import type { Metadata } from "next";
import { about } from "@/lib/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
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
              {about.currently.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h2>Links</h2>
            <ul>
              {about.links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    {label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
