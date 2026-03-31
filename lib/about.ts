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
    `Passionate about understanding people and interested in studying psychology, I didn't realize how this could synergize with artistic creativity until I encountered Product Design in university. I loved talking to people to learn about them, and creating tangible and emotional experiences that stemmed from the findings of those discussions.`,
    `After graduating from university, I worked as a User Experience Designer for a fintech startup, and learned through collaboration with financial engineers, software engineers, product managers, and senior leadership about how the different sectors of a software company come together to deliver successful product launches and experiences. Also recognizing how tied together a software's services (backend) and user interface (frontend) are, I started to learn full-stack programming on the side, and quickly became a point of contact not only for designing the product experience, but also how to implement it with precision in code.`,
    `Currently, I work as a freelance Product Design consultant and founding Product Designer across different early-stage software ventures, and I look to continuously utilize and grow my understanding of UX design, full-stack development, and project management to deliver products that elicit delight while truly addressing peoples' needs.`,
    `I am a tinkerer at heart, and find the acquisition of growth of new skills extremely fulfilling. In my free time, you can find me toying with web/mobile development, watching/playing soccer, or attempting to make latte art!`,
  ],

  // Currently section — shown as a simple list
  currently: [
    "Product Designer & Engineer @ iSonic.ai",
    // "Open to senior IC and lead roles",
    "Based in Hoboken, NJ",
  ],

  // Links shown in the sidebar / contact area
  links: [
    { label: "matthewcanabarro.com", href: "https://matthewcanabarro.com" },
    { label: "LinkedIn", href: "https://linkedin.com/in/matthewcanabarro" },
    { label: "GitHub", href: "https://github.com/matthewcanabarro" },
    { label: "Email", href: "mailto:hello@matthewcanabarro.com" }, // ← update
  ],
} as const;
