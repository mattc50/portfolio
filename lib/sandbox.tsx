// ─── lib/sandbox.ts ──────────────────────────────────────────────────────────
// Single source of truth for all sandbox items.
// Add items here — the grid and lightbox update automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { ReactNode } from "react";

export interface SandboxItem {
  /** Unique identifier, used as React key */
  id: string;
  /** Display title shown on the tile and in the lightbox */
  title: string;
  /** Short label shown below the title on the tile (e.g. tool, context) */
  label?: string;
  /** Path to .webm under /public, e.g. "/sandbox/drag-reorder.webm" */
  media: string;
  mediaType: "video" | "image";
  /**
   * Optional poster image shown before the video loads.
   * Path under /public, e.g. "/sandbox/drag-reorder.jpg"
   */
  poster?: string;
  /** Why you built it, what it was for — shown in the lightbox */
  description: ReactNode;
  /** Set false to hide without deleting */
  published?: boolean;
}

// ─── Your Items ───────────────────────────────────────────────────────────────

export const sandboxItems: SandboxItem[] = [
  {
    id: "skeuomorphic-button",
    title: "Skeuomorphic button",
    label: "CSS · React",
    media: "/sandbox/demo1.webm",
    mediaType: "video",
    description: (
      <>
        <p>I wanted to make a button that appeared physical — using realistic lighting and shadows to create the perception of natural form.</p>
        <p>The overall effect is achieved with animations to <code>scale</code> and <code>box-shadow</code>, an <code>:active</code> effect, and a state to manage whether the button is toggled.</p>
      </>
    ),
    published: true,
  },
  {
    id: "timeline-with-date-as-progress",
    title: "Timeline with date as progress",
    label: "CSS · JavaScript",
    media: "/sandbox/demo2.webm",
    mediaType: "video",
    description: (
      <>
        <p>I wanted to make a curving timeline that showed progress from a start date to a finish date.</p>
        <p>First, I created the SVG stroke for the track, then duplicated it and placed one on top of the other. The bottom one became the <b>track</b> while the top one became the <b>progress</b>.</p>
        <p>I calculated the "percent completion" of time from the current date to the finish date, relative to the days between the start and finish.</p>
        <p>I then used this percent to calculate a <code>strokeDashoffset</code> for the <b>progress</b> path, creating the visual of the progress path being filled along the curving track.</p>
        <b>Purpose</b>
        <p>I built this for an accessible inspection app to be used by students, and wanted to make something more engaging than a static progress indicator.</p>
        <p>Additionally, the timeline was supposed to show events that the user logged throughout their tenancy, so the ability to have the timeline take up both horizonatl and vertical space meant that "flags" for those events could be shown without making the timeline too cramped.</p>
      </>
    ),
    published: true,
  },
  {
    id: "rotating-cube-with-stop",
    title: "Rotating cube with stop",
    label: "CSS · JavaScript · Web Animations API",
    media: "/sandbox/demo3.webm",
    mediaType: "video",
    description: (
      <>
        <p>I wanted to make a cube animation that could be stopped at an arbitrary point by a user action.</p>
        <b>Inspiration</b>
        <p>I was building a feature for an accessible home inspection app where the user could take photos in different areas of the room. I envisioned a room being abstracted to a cube, with accompanying text informing the user to take photos. I also envisioned that after this infromational screen, the user would see the grid to which they could add photos. </p>
        <p>This transition from 3D room to square photo frame is what inspired this exploration.</p>
        <b>How it was done</b>
        <p>I first created a cube with transformations to 6 square <code>&lt;div&gt;</code> elements.</p>
        <p>Then, with JavaScript, I used the <b>Web Animations API</b> to create an animation, as I wanted strict control over its <code>playback rate</code> and visibility into the amount of <code>iterations</code> it had played through.</p>
        <p>I added a button to simulate the user action of dismissing the animation. When pressed, the animation playback rate would be increased 8-fold, and ~ this is where the the real magic happens ~ the timing of the animation would be set to play only until it had played <code>iterations + 1</code> times.</p>
        <p>This logic meant that once the user pressed the button, the animation would speed up and end consistently — no matter where in the animation the user invoked the action.</p>
        <p>The last part was having another animation take place a sert interval after the user pressed the button, which reset the transformations done on the cube panels to bring back the "square" look.</p>
      </>
    ),
    published: true,
  },
  {
    id: "negotiation-mode-animation",
    title: "Negotiation mode animation",
    label: "HTML · CSS",
    media: "/sandbox/demo4.webm",
    mediaType: "video",
    description: (
      <>
        <p>An animation showcasing an AI-powered vehicle marketplace's negotiation flow with <b>manual review</b> enabled (green) or disabled (dark).</p>
        <p>Made entirely with HTML and CSS.</p>
      </>
    ),
    published: true,
  },
  {
    id: "bouncy-button",
    title: "Bouncy button",
    label: "HTML · CSS",
    media: "/sandbox/demo5.webm",
    mediaType: "video",
    description: (
      <>
        <p>I wanted to create a button similar to <b>Mailchimp's</b>.</p>
        <p>The key to the effect was giving the button surface a transition with the following timing function:</p>
        <code>cubic-bezier(0.5, 2.5, 0.7, 0.7)</code>
        <p>The large <span style={{ fontStyle: "italic", marginRight: "6px" }}>P<sub>1</sub></span>
          causes the transition effect to "overshoot" — making the transition's final value to slightly exceed where it's suppoesed to end, leading to the "bounce".</p>
      </>
    ),
    published: true,
  },
  {
    id: "source-to-highlight-effect",
    title: "Source-to-highlight effect",
    label: "CSS · React",
    media: "/sandbox/demo6.webm",
    mediaType: "video",
    description: (
      <>
        <p>I wanted to examine how to highlight inline text tied to a specific citation in a list elsewhere.</p>
        <b>Purpose</b>
        <p>I was designing and implementing the UI for a conversational interface that returns context URLs with responses. I wanted to create a way to visually associate text to the sources they came from without replying on inline numbering, which even if subtly integrated could interrupot the readability of the text.</p>
        <b>How it works</b>
        <p>It came down to giving each text-link pair a <b>data attribute</b> (<code>data-spanid</code>) and setting it as a state value when either is moused over. This state value would cause the highlight styling to be conditionally applied to the correct elements.</p>
        <p>When moused out, the state value would be reset.</p>
      </>
    ),
    published: true,
  },
  {
    id: "automatic-source-detection-on-link-paste",
    title: "Automatic source detection on link paste",
    label: "CSS · React",
    media: "/sandbox/demo7.webm",
    mediaType: "video",
    description: (
      <>
        <b>Purpose</b>
        <p>I was designing a system that allows users to enter URLs from various sources. At the time, we required users to both categorize what kind of link it is, as well as enter the link itself.</p>
        <p>I wanted to alleviate as much of the effort around adding links as possible.</p>
        <b>How it works</b>
        <p>First, I wanted to maximize the consistency of users entering the right URL per source.</p>
        <p>Through observing user behaviors, I identified that people typically added their social profile links in 2 ways:
          <ol>
            <li>
              By going to the profile, copying the search bar text, and pasting it into the field; and
            </li>
            <li>
              Assuming the URL takes a standard pattern (e.g. <code>www.example.com/username</code>) and entering their username/handle at the end of the assumed domain
            </li>
          </ol>
        </p>
        <p>In the second case, an issue could arise where the URL could require an <code>@</code> before the username — such is the case with TikTok – and the assumption in case 2 could cause the URL to be invalid. We'd validate the URL structure and inform the user, but the error would have already been made.</p>
        <p>Therefore, I wanted to ensure that when specific sources were entered, the URL would have a <b>prefix</b> (e.g. <code>https://tiktok.com/@</code>)that maximizes the likelihood of consistent input from the user when a given source is selected.</p>
        <p>The natural follow-up question would be: <em>if I paste a URL like <code>https://tiktok.com/@username</code> after a prefix, the entire URL would be <code>https://tiktok.com/@https://tiktok.com/@username</code> — which would be wrong.</em></p>
        <p>That is true! Therefore, I implemented an <code>onPaste</code> handler that detects the source of the pasted URL using a regex, automatically changing the source as well as removing the <code>prefix</code> portion of the pasted URL (this remaining part being called the <code>suffix</code>) — ensuring the pasted URL is consistently entered.</p>
        <p>Behind the scenes, the entire <code>prefix + suffix</code> would be the value stored in the component state on the frontend and validated on backend after the form was submitted. Additionally, there would be a plain text input that would facilitate the value mutations — however, the actual value of this field would be <em>invisible to the user</em>. To protect the integrity of the <code>prefix</code>, if the user tries to hit <code>backspace</code> within that section of the string, the action would be blocked.</p>
        <p>In terms of what the user sees, a second <em>overlay component</em> is used to display the <code>prefix + suffix</code>, with the <code>prefix</code>shown in a slightly lighter color than the <code>suffix</code> (editable part of the field).</p>
      </>
    ),
    published: true,
  },
  {
    id: "icon-gradient-along-a-path",
    title: "Icon gradient along a path",
    label: "CSS · React",
    media: "/sandbox/demo8.webm",
    mediaType: "video",
    description: (
      <>
        <p>I made a component that programmatically changes <code>strokeDasharray</code> and <code>strokeDashoffset</code> based on a duration to control the movement of a path with a <code>stroke</code> property of a <code>linearGradient</code>.</p>
        <p>Additionally, I made the component maintain a <code>hovered</code> state that, when active, causes the <code>offset</code> movement to accelerate, as well as change the gradient color.</p>
      </>
    ),
    published: true,
  },
  {
    id: "mobile-animation",
    title: "Mobile animation",
    label: "CSS · React",
    media: "/sandbox/demo11.webm",
    mediaType: "video",
    description: (
      <>
        <p>An animation I made to demonstrate the conversational interface of <a href="https://isonic.ai" target="_blank" rel="noopener noreferrer">iSonic.ai</a>. It was housed in a previous version of the landing page.</p>
      </>
    ),
    published: true,
  },
  {
    id: "campbell-skateboard",
    title: "Campbell skateboard",
    label: "React",
    media: "/sandbox/demo9.png",
    mediaType: "image",
    description: (
      <>
        <p>I was inspired to embark on this project from a friend, who had taken up the hobby of painting the famous Andy Warhol Campbell Soup Can onto skateboards for her friends. I wanted to create a resource where people could visualize the skateboard they wanted her to paint, and then send her the exact colors they wanted.</p>
        <b>How it works</b>
        <p>I thought of each color of the Campbell Skateboard as being a "layer", with each layer having its own color. With this model in mind, I created SVGs for each layer which would then be stacked on top of each other, providing the framework for customizability by the user on a website.</p>
      </>
    ),
    published: true,
  },
  {
    id: "timeline-model",
    title: "Timeline model",
    label: "Rhino · V-Ray",
    media: "/sandbox/demo10.png",
    mediaType: "image",
    description: (
      <>
        <p>As my early professional career has unfolded, I wanted to create a 3D model reflecting on different structures which represent moments in my "personal timeline".</p>
        <p>From left to right: my high school; my parents' house (where I spent most of my formative years); <a href="https://www.google.com/maps/place/McGraw+Tower/@42.4475739,-76.4876288,17z/data=!3m1!4b1!4m6!3m5!1s0x89d0818bd4d85755:0x19299d4d6ca11ed1!8m2!3d42.4475739!4d-76.4850539!16zL20vMGducGZj?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">McGraw Tower</a> (the famous clocktower of Cornell); <a href="google.com/maps/place/Martha+Van+Rensselaer+Hall/@42.4475739,-76.4876288,17z/data=!4m6!3m5!1s0x89d0833ba1a7a891:0x24ebe0ce85027b0c!8m2!3d42.449771!4d-76.4791325!16s%2Fg%2F11tfb3b_bx?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Martha van Rensselaer Hall</a> (also known as MVR; lots of hours spent in its design studios); and the <a href="https://www.google.com/maps/place/CN+Tower/@43.6425662,-79.3896317,17z/data=!3m2!4b1!5s0x882b34d819a55ff7:0xad7cf7bcaf4e239b!4m6!3m5!1s0x882b34d68bf33a9b:0x15edd8c4de1c7581!8m2!3d43.6425662!4d-79.3870568!16zL20vMDF0d3M?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">CN Tower</a> (architectural icon of Toronto, where my post-college career began — although I was working remotely from the US)</p>
      </>
    ),
    published: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPublishedSandboxItems(): SandboxItem[] {
  return sandboxItems.filter((item) => item.published !== false);
}
