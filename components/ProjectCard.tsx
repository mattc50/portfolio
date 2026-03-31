import Link from "next/link";
import type { Project } from "@/lib/projects";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const delayClass = `delay-${Math.min(index + 1, 5)}`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`${styles.card} anim-fade-up ${delayClass}`}
    >
      {/* Cover */}
      <div
        className={styles.cover}
        style={project.accentColor ? { backgroundColor: project.accentColor + "22" } : {}}
      >
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImage} alt={project.title} className={styles.coverImg} />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span className={styles.label}>Cover image</span>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className={styles.meta}>
        <div>
          <h2 className={styles.title}>{project.title}</h2>
          <p className={styles.tagline}>{project.tagline}</p>
        </div>
        <div className={styles.metaRight}>
          <span className={styles.label}>{project.company}</span>
          <span className={styles.label}>{project.year}</span>
        </div>
      </div>

      {/* Role tags */}
      <div className={styles.roles}>
        {project.roles.map((role) => (
          <span key={role} className={styles.tag}>{role}</span>
        ))}
      </div>
    </Link>
  );
}
