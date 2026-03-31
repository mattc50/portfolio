// ─── lib/about.ts ────────────────────────────────────────────────────────────
// Edit your About page content here.
// ────────────────────────────────────────────────────────────────────────────

export const about = {
  name: "Matt Canabarro",
  role: "Product Designer & Design Engineer",

  // Shown as the large intro paragraph at the top of /about
  intro: `I design and build digital products — with enough engineering depth
to close the gap between design intent and shipped reality.`,

  // Body copy — each string renders as a paragraph
  bio: [
    `Currently at iSonic.ai, where I own end-to-end product design and contribute to frontend implementation across consumer, creator, and admin surfaces. Previously Head of Design at d1g1t, a wealth management platform where I led design across billing, KYC, and goals-based planning.`,
    `My background spans product design, design engineering, and AI product work. I'm most comfortable at the intersection of systems thinking and interaction craft — building design systems that scale and shipping interfaces that feel considered at every detail.`,
    `I work primarily in Figma, React, and TypeScript. I care deeply about the moments between states: loading, empty, error, transition.`,
  ],

  // Currently section — shown as a simple list
  currently: [
    "Product Design @ iSonic.ai",
    "Open to senior IC and lead roles",
    "Based in Jersey City, NJ",
  ],

  // Links shown in the sidebar / contact area
  links: [
    { label: "matthewcanabarro.com", href: "https://matthewcanabarro.com" },
    { label: "LinkedIn", href: "https://linkedin.com/in/matthewcanabarro" },
    { label: "GitHub", href: "https://github.com/matthewcanabarro" },
    { label: "Email", href: "mailto:hello@matthewcanabarro.com" }, // ← update
  ],
} as const;
