import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/projects";
import styles from "./slug.module.css";
import { Footer } from "@/components/Footer";

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
    <>
      <article className={styles.article}>
        {/* Back */}
        <Link href="/" className={`${styles.back} anim-fade-in`}>
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
              <dt className={styles.metaLabel}>{project.slug === "unified-inbox" ? "Company" : "Product"}</dt>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.80163 9.51296C7.41104 9.51296 6.28375 10.6399 6.28375 12.03C6.28375 13.4201 7.41104 14.547 8.80163 14.547H11.3876V12.03V9.51296H8.80163ZM15.1303 8.28847L15.1984 8.28847C16.589 8.28847 17.7163 7.16157 17.7163 5.77146C17.7163 4.38136 16.589 3.25446 15.1984 3.25446H12.6125V8.28847L15.1303 8.28847ZM17.2509 8.90072C18.269 8.23205 18.9412 7.08023 18.9412 5.77146C18.9412 3.70509 17.2655 2.02997 15.1984 2.02997H12.6125H12H11.3876H8.80163C6.73454 2.02997 5.05884 3.70509 5.05884 5.77146C5.05884 7.08023 5.73105 8.23205 6.74915 8.90072C5.73105 9.56938 5.05884 10.7212 5.05884 12.03C5.05884 13.3387 5.73105 14.4906 6.74915 15.1592C5.73105 15.8279 5.05884 16.9797 5.05884 18.2885C5.05884 20.3591 6.75577 22.03 8.81855 22.03C10.9001 22.03 12.6125 20.3439 12.6125 18.2545V15.7715V15.1592V14.7983C13.2773 15.4029 14.1608 15.7715 15.1303 15.7715H15.1984C17.2655 15.7715 18.9412 14.0963 18.9412 12.03C18.9412 10.7212 18.269 9.56938 17.2509 8.90072ZM15.1984 9.51296L15.1303 9.51296C13.7398 9.51296 12.6125 10.6399 12.6125 12.03C12.6125 13.4201 13.7398 14.547 15.1303 14.547H15.1984C16.589 14.547 17.7163 13.4201 17.7163 12.03C17.7163 10.6399 16.589 9.51296 15.1984 9.51296ZM6.28375 18.2885C6.28375 16.8984 7.41104 15.7715 8.80163 15.7715H11.3876V18.2545C11.3876 19.6591 10.2322 20.8055 8.81855 20.8055C7.42366 20.8055 6.28375 19.6743 6.28375 18.2885ZM11.3876 8.28847H8.80163C7.41104 8.28847 6.28375 7.16157 6.28375 5.77146C6.28375 4.38136 7.41104 3.25446 8.80163 3.25446H11.3876V8.28847Z" fill="white" />
                </svg>
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
      <Footer />
    </>
  );
}
