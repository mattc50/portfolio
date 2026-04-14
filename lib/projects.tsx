// ─── lib/projects.ts ────────────────────────────────────────────────────────
// Single source of truth for all case study data.
// Add, remove, or reorder projects here — pages update automatically.
// ────────────────────────────────────────────────────────────────────────────

import { ReactNode } from "react";

export type ProjectRole =
  | "Product Design"
  | "Design Engineering"
  | "UX Research"
  | "UX Design"
  | "Enterprise UX Design"
  | "Design Systems"
  | "Frontend Engineering";

export interface Project {
  /** URL slug, e.g. "unified-inbox" → /unified-inbox */
  slug: string;
  /** Display title */
  title: string;
  /** One-line description shown on the project card */
  tagline: string;
  /** Full description shown on the project detail page */
  description: ReactNode;
  /** Company or client */
  company: string;
  /** Year(s), e.g. "2024" or "2023–2024" */
  year: string;
  /** Your roles on this project */
  roles: ProjectRole[];
  /** Optional: Figma view-only share URL — shown as primary CTA on detail page */
  figmaUrl?: string;
  /** Optional: Article URL if the CTA should be an external webpage */
  articleUrl?: string;
  /** Optional: CTA accompanying article */
  articleCta?: string;
  /** Optional: Document URL if the CTA should be an external document */
  docUrl?: string;
  /** Optional: CTA accompanying document */
  docCta?: string;
  /** Optional: cover image path under /public, e.g. "/unified-inbox/cover.png" */
  coverImage?: string;
  /** Optional: accent color override for this project card (CSS color value) */
  accentColor?: string;
  /** Set false to hide from the projects grid without deleting */
  published?: boolean;
}

// ─── Your Projects ────────────────────────────────────────────────────────────
// Replace placeholder values with your real content.

export const projects: Project[] = [
  {
    slug: "isonic-unified-inbox",
    title: "iSonic Unified Inbox",
    tagline: "Turning fragmented creator conversations into a unified, content-aware response system.",
    description: (
      <>
        <p>I led end-to-end design of the Unified Inbox: from product definition and interaction architecture through high-fidelity interface design and system-level component work. The experience <strong>helps content creators consolidate messages that are fragmented across social platforms</strong>&nbsp;—&nbsp;connecting each conversation to their content library, and enabling AI-assisted replies that remain grounded in existing content and customizable brand voice.</p>
      </>
    ),
    company: "iSonic.ai",
    year: "2025",
    roles: ["UX Research", "Product Design", "Design Systems", "Frontend Engineering"],
    figmaUrl: "https://www.figma.com/deck/pjQmKuFEGApisZcb6ifY6s",
    coverImage: "/unified-inbox.png",
    published: true,
  },
  {
    slug: "lenz",
    title: "Lenz",
    tagline: "Transforming property inspections into a self-serve, evidence-driven experience for tenants.",
    description: (
      <>
        <p>I led end-to-end product design for Lenz, a tenancy inspection platform built to <strong>empower renters to independently document property condition</strong>  across check-in, mid-term, and check-out stages. I translated inspection requirements into a progressive mobile workflow, designed reporting and comparison systems that make evidence easy to capture and review, and implemented advanced React Native interactions&nbsp;—&nbsp;including animated components and a dynamic tenancy timeline&nbsp;—&nbsp;to preserve a rich, trustworthy user experience in production.</p>
      </>
    ),
    company: "Lenz",
    year: "2024",
    roles: ["Product Design", "Frontend Engineering"],
    figmaUrl: "https://www.figma.com/deck/8DOz3LMYE6CI7Rhh4wpSzm",
    coverImage: "/lenz.png",
    published: true,
  },
  {
    slug: "venmo-split",
    title: "Venmo Split",
    tagline: "Reframing peer-to-peer payments around the social moments they support.",
    description: (
      <>
        <p>I designed Venmo Split as a research-led enhancement to Venmo's core payment flow, identifying <strong>how people manage shared expenses</strong> and translating those behaviors into a multi-person bill-splitting experience. From interviews and affinity mapping through an information architecture enhancement, interaction design, and high-fidelity prototyping, I created a receipt-based request flow that simplifies item assignment, tax and tip distribution, and reimbursement visibility while staying consistent with Venmo's existing design language.</p>
      </>
    ),
    company: "Case Study",
    year: "2023",
    roles: ["UX Research", "Product Design"],
    figmaUrl: "https://www.figma.com/deck/QUiqv1VXvKBCQmyWdqrwjB",
    coverImage: "/venmo-split.png",
    published: true,
  },
  {
    slug: "d1g1t-billing-solution",
    title: "d1g1t Billing Solution",
    tagline: "Powering how advisory firms manage fees at scale.",
    description: (
      <>
        <p>I designed the user experience and interfaces for d1g1t's billing solution, <strong>providing wealth management firms and their advisors with a streamlined workflow</strong> for generating, analyzing, reviewing, approving, and processing fees, as well as sending invoices\u00A0—\u00A0all within the d1g1t product ecosystem.</p>
      </>
    ),
    company: "d1g1t Inc.",
    year: "2023",
    roles: ["Product Design", "Enterprise UX Design"],
    articleUrl: "https://www.d1g1t.com/billing/",
    articleCta: "View Article",
    docUrl: "https://www.d1g1t.com/wp-content/uploads/2024/12/d1g1t-Billing-Solution-Sheet.pdf",
    docCta: "Read Solution Sheet",
    coverImage: "/d1g1t.png",
    published: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPublishedProjects(): Project[] {
  return projects.filter((p) => p.published !== false);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
