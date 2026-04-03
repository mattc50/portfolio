import { generateUUID } from "@/utils/generateUUID";

const ADJECTIVES = [
  "Swift", "Quiet", "Bright", "Calm", "Bold", "Clever", "Gentle", "Keen",
  "Lively", "Nimble", "Radiant", "Sage", "Vivid", "Witty", "Zesty",
];

const COLORS = [
  "#e85d75", "#5d9ee8", "#5de8a0", "#e8c05d", "#b05de8",
  "#e8825d", "#5de8d8", "#e85db0", "#8de85d", "#5d75e8",
];

export interface Identity {
  id: string;
  color: string;
  name: string;
}

export function getOrCreateIdentity(): Identity {
  if (typeof window === "undefined") {
    return { id: "ssr", color: COLORS[0], name: "Visitor" };
  }

  const stored = localStorage.getItem("visitor-id");
  if (stored) {
    try {
      return JSON.parse(stored) as Identity;
    } catch {
      // fall through to create new
    }
  }

  const id = generateUUID();
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const name =
    ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] + " Visitor";
  const identity: Identity = { id, color, name };

  localStorage.setItem("visitor-id", JSON.stringify(identity));
  return identity;
}