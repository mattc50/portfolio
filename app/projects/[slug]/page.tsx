import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/projects";
import styles from "./slug.module.css";

export async function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const paragraphs = project.description
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className={styles.article}>
      {/* Back */}
      <Link href="/projects" className={`${styles.back} anim-fade-in`}>
        <span aria-hidden>←</span> All Projects
      </Link>

      {/* Header */}
      <header className={`${styles.header} anim-fade-up`}>
        <div className={styles.roles}>
          {project.roles.map((role) => (
            <span key={role} className={styles.tag}>{role}</span>
          ))}
        </div>

        <h1 className={styles.heading}>{project.title}</h1>
        <p className={styles.tagline}>{project.tagline}</p>

        <dl className={styles.metaStrip}>
          <div>
            <dt className={styles.metaLabel}>Company</dt>
            <dd className={styles.metaValue}>{project.company}</dd>
          </div>
          <div>
            <dt className={styles.metaLabel}>Year</dt>
            <dd className={styles.metaValue}>{project.year}</dd>
          </div>
        </dl>
      </header>

      {/* Cover */}
      <div className={`${styles.cover} anim-fade-in delay-2`}>
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImage} alt={`${project.title} cover`} className={styles.coverImg} />
        ) : (
          <span className={styles.coverLabel}>Cover image</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={`${styles.description} anim-fade-up delay-2`}>
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <aside className={`anim-fade-up delay-3`}>
          <div className={styles.sidebar}>
            <span className={styles.sidebarEyebrow}>View the work</span>
            <p className={styles.sidebarText}>
              The full case study — flows, explorations, and final designs — is
              available in Figma.
            </p>
            <a
              href={project.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.figmaBtn}
            >
              Open in Figma
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
