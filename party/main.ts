import type * as Party from "partykit/server";

interface CursorState {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

interface CanvasElement {
  id: string;
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  lockedBy: string | null;
}

export default class CanvasParty implements Party.Server {
  cursors: Record<string, CursorState> = {};
  elements: Record<string, CanvasElement> = {
    "rect-1": {
      id: "rect-1",
      type: "rect",
      x: 100,
      y: 100,
      width: 200,
      height: 120,
      lockedBy: null,
    },
  };

  constructor(readonly party: Party.Party) { }

  onConnect(conn: Party.Connection) {
    conn.send(
      JSON.stringify({
        type: "init",
        cursors: this.cursors,
        elements: this.elements,
      })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    let data: Record<string, any>;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    // ── Cursor events ─────────────────────────────────────────────────────
    if (data.type === "move") {
      this.cursors[sender.id] = {
        id: sender.id,
        x: data.x ?? 0,
        y: data.y ?? 0,
        color: data.color ?? "#888",
        name: data.name ?? "Visitor",
      };
      this.party.broadcast(
        JSON.stringify({ type: "move", ...this.cursors[sender.id] }),
        [sender.id]
      );
      return;
    }

    if (data.type === "leave") {
      this._removeClient(sender.id);
      return;
    }

    // ── Element events ────────────────────────────────────────────────────
    if (data.type === "rect:drag-start") {
      const el = this.elements[data.id];
      if (!el || el.lockedBy) return; // already locked — reject silently
      el.lockedBy = sender.id;
      this.party.broadcast(
        JSON.stringify({ type: "rect:locked", id: data.id, lockedBy: sender.id })
      );
      return;
    }

    if (data.type === "rect:move") {
      const el = this.elements[data.id];
      if (!el || el.lockedBy !== sender.id) return; // must own the lock
      el.x = data.x;
      el.y = data.y;
      // Broadcast to everyone except the dragger (they update optimistically)
      this.party.broadcast(
        JSON.stringify({ ...el, type: "rect:update" }),
        [sender.id]
      );
      return;
    }

    if (data.type === "rect:drag-end") {
      const el = this.elements[data.id];
      if (!el || el.lockedBy !== sender.id) return;
      el.lockedBy = null;
      this.party.broadcast(
        JSON.stringify({ type: "rect:released", id: data.id })
      );
      return;
    }

    if (data.type === "rect:reset") {
      const el = this.elements[data.id];
      if (!el || el.lockedBy) return;
      el.x = data.x;
      el.y = data.y;
      this.party.broadcast(JSON.stringify({ ...el, type: "rect:update" }));
      return;
    }
  }

  onClose(conn: Party.Connection) {
    this._removeClient(conn.id);
  }

  onError(conn: Party.Connection) {
    this._removeClient(conn.id);
  }

  private _removeClient(id: string) {
    // Remove cursor
    if (this.cursors[id]) {
      delete this.cursors[id];
      this.party.broadcast(JSON.stringify({ type: "leave", id }));
    }

    // Release any locks held by this client
    for (const el of Object.values(this.elements)) {
      if (el.lockedBy === id) {
        el.lockedBy = null;
        this.party.broadcast(
          JSON.stringify({ type: "rect:released", id: el.id })
        );
      }
    }
  }
}