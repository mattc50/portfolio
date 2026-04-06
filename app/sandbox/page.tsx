import type { Metadata } from "next";
import { getPublishedSandboxItems } from "@/lib/sandbox";
import { SandboxGrid } from "@/components/SandboxGrid";
import styles from "./sandbox.module.css";
import { Footer } from "@/components/Footer";
import { MultiplayerCanvas } from "@/components/MultiplayerCanvas";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Small side projects, prototypes, and experiments.",
};

export default function SandboxPage() {
  const items = getPublishedSandboxItems();

  return (
    <>
      <section className={styles.section}>
        <div className={`${styles.header} anim-fade-up`}>
          <h1 className={styles.heading}>Sandbox</h1>
          <p className={styles.subheading}>
            I absolutely love tinkering with new ideas, and being able to use engineering as a medium through which to explore what is possible to bring to life in design.
          </p>
          <p className={styles.subheading}>
            The way I see code is akin to that of a paintbrush. It is a tool to translate design intent into action — or in this case, pixels doing what you want them to do.
          </p>
          <p className={styles.subheading}>
            I wanted to have a place on my website to house the documentation of many prototypes, explorations, and mini side projects I have completed — a core part of what fuels my passion for design and engineering.
          </p>
        </div>

        <SandboxGrid items={items} />
      </section>
      {/* <section>
        <div style={{ width: "100vw", height: "100vh" }}>
          <MultiplayerCanvas />
        </div>
      </section> */}
      <Footer />
    </>
  );
}
