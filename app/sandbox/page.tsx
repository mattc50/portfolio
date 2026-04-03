import type { Metadata } from "next";
import { getPublishedSandboxItems } from "@/lib/sandbox";
import { SandboxGrid } from "@/components/SandboxGrid";
import styles from "./sandbox.module.css";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Small side projects, prototypes, and experiments.",
};

export default function SandboxPage() {
  const items = getPublishedSandboxItems();

  return (
    <section className={styles.section}>
      <div className={`${styles.header} anim-fade-up`}>
        <span className={styles.eyebrow}>Experiments</span>
        <h1 className={styles.heading}>Sandbox</h1>
        <p className={styles.subheading}>
          Side projects, prototypes, and things built to answer a question.
        </p>
      </div>

      <SandboxGrid items={items} />
    </section>
  );
}
