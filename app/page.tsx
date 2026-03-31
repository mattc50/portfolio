import Link from "next/link";
import { getPublishedProjects } from "@/lib/projects";
import styles from "./home.module.css";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const projects = getPublishedProjects();

  return (
    <>
      <section className={styles.section}>
        <div className={styles["section-content"]}>
          <div className={`${styles.hero} anim-fade-up`}>
            <h1 className={styles.heading1}>
              Matthew Canabarro
            </h1>
            <p className={styles.subheading}>
              Product Designer & Design Engineer based in Hoboken (let's just say NYC).
            </p>
          </div>

          <div className={`${styles.header} anim-fade-up`}>
            <h4 className={styles.heading4}>Projects</h4>
          </div>

          <div className={styles.grid}>
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
