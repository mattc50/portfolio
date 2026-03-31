import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Product design and design engineering case studies.",
};

export default function ProjectsPage() {
  const projects = getPublishedProjects();

  return (
    <section className={styles.section}>
      <div className={`${styles.header} anim-fade-up`}>
        <span className={styles.eyebrow}>Selected Work</span>
        <h1 className={styles.heading}>Projects</h1>
      </div>

      <div className={styles.grid}>
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
