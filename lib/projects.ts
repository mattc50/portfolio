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
    tagline: "Centralizing creator-fan engagement across platforms into a single, intelligent inbox.",
    description: `The iSonic creator platform had engagement happening across DMs, comments, and fan messages from multiple sources — with no unified surface to manage it. Creators were context-switching constantly and missing high-value interactions.

I led end-to-end design of the Unified Inbox: from initial concept and information architecture through component design, interaction patterns, and handoff. The inbox aggregates messages across channels, surfaces AI-prioritized conversations, and gives creators and their teams the tooling to respond at scale.`,
    company: "iSonic.ai",
    year: "2024",
    roles: ["Product Design", "Design Systems"],
    figmaUrl: "https://figma.com/your-link-here", // ← replace with real share URL
    coverImage: undefined,
    published: true,
  },
  {
    slug: "lenz",
    title: "Lenz",
    tagline: "A mobile-first tool for photographers to manage shoots, edits, and client delivery.",
    description: `Lenz started as a freelance engagement to redesign a photography workflow app that had grown unwieldy. The core problem: photographers needed a single place to manage shoot logistics, selects, and final delivery — without it feeling like project management software.

I redesigned the core flows from the ground up, with a strong focus on the gallery and delivery experience. The result was a significantly simplified IA and a mobile-first interface that matched how photographers actually work on set.`,
    company: "Lenz",
    year: "2023",
    roles: ["Product Design", "UX Design"],
    figmaUrl: "https://figma.com/your-link-here", // ← replace with real share URL
    coverImage: undefined,
    published: true,
  },
  {
    slug: "venmo-split",
    title: "Venmo Split",
    tagline: "Reimagining group expense splitting as a native, frictionless Venmo experience.",
    description: `A speculative redesign exploring how Venmo could better support the group splitting use case that already drives much of its organic usage. The existing flow required too many steps and lacked clarity around who owed what.

I designed an end-to-end splitting experience — from initiating a split to settling up — with an emphasis on reducing cognitive load and making the social context of splitting feel natural rather than transactional.`,
    company: "Case Study",
    year: "2023",
    roles: ["Product Design", "UX Design"],
    figmaUrl: "https://figma.com/your-link-here", // ← replace with real share URL
    coverImage: undefined,
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
