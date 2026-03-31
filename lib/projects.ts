// ─── lib/projects.ts ────────────────────────────────────────────────────────
// Single source of truth for all case study data.
// Add, remove, or reorder projects here — pages update automatically.
// ────────────────────────────────────────────────────────────────────────────

export type ProjectRole =
  | "Product Design"
  | "Design Engineering"
  | "UX Design"
  | "Design Systems"
  | "Frontend Engineering";

export interface Project {
  /** URL slug, e.g. "unified-inbox" → /projects/unified-inbox */
  slug: string;
  /** Display title */
  title: string;
  /** One-line description shown on the project card */
  tagline: string;
  /** Full description shown on the project detail page */
  description: string;
  /** Company or client */
  company: string;
  /** Year(s), e.g. "2024" or "2023–2024" */
  year: string;
  /** Your roles on this project */
  roles: ProjectRole[];
  /** Figma view-only share URL — shown as primary CTA on detail page */
  figmaUrl: string;
  /** Optional: cover image path under /public, e.g. "/projects/unified-inbox/cover.png" */
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
    slug: "unified-inbox",
    title: "Unified Inbox",
    tagline: "Turning fragmented creator conversations into a unified, content-aware response system.",
    description: `I led end-to-end design of the Unified Inbox: from product definition and interaction architecture through high-fidelity interface design and system-level component work. The experience consolidates messages across social platforms, connects each conversation to a creator's content library, and enables AI-assisted replies that remain grounded in existing content and customizable brand voice.`,
    company: "iSonic.ai",
    year: "2024",
    roles: ["Product Design", "Design Systems", "Frontend Engineering"],
    figmaUrl: "https://www.figma.com/deck/pjQmKuFEGApisZcb6ifY6s", // ← replace with real share URL
    coverImage: "/projects/unified-inbox.png",
    published: true,
  },
  {
    slug: "lenz",
    title: "Lenz",
    tagline: "Transforming property inspections into a self-serve, evidence-driven experience for tenants.",
    description: `I led end-to-end product design for Lenz, a tenancy inspection platform built to help renters independently document property condition across check-in, mid-term, and check-out stages. I translated inspection requirements into a progressive mobile workflow, designed reporting and comparison systems that make evidence easy to capture and review, and implemented advanced React Native interactions—including animated components and a dynamic tenancy timeline—to preserve a rich, trustworthy user experience in production.`,
    company: "Lenz",
    year: "2023",
    roles: ["Product Design", "UX Design", "Frontend Engineering"],
    figmaUrl: "https://www.figma.com/deck/8DOz3LMYE6CI7Rhh4wpSzm", // ← replace with real share URL
    coverImage: "/projects/lenz.png",
    published: true,
  },
  {
    slug: "venmo-split",
    title: "Venmo Split",
    tagline: "Reframing peer-to-peer payments around the social moments they support.",
    description: `I designed Venmo Split as a research-led enhancement to Venmo's core payment flow, identifying how users manage shared expenses and translating those behaviors into a multi-person bill-splitting experience. From interviews and affinity mapping through IA redesign, interaction design, and high-fidelity prototyping, I created a receipt-based request flow that simplifies item assignment, tax and tip distribution, and reimbursement visibility while staying consistent with Venmo's existing design language.`,
    company: "Case Study",
    year: "2023",
    roles: ["Product Design", "UX Design"],
    figmaUrl: "https://www.figma.com/deck/QUiqv1VXvKBCQmyWdqrwjB", // ← replace with real share URL
    coverImage: "/projects/venmo-split.png",
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
