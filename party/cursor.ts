import type * as Party from "partykit/server";

interface CursorState {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export default class CursorParty implements Party.Server {
  cursors: Record<string, CursorState> = {};

  constructor(readonly party: Party.Party) { }

  onConnect(conn: Party.Connection) {
    conn.send(JSON.stringify({ type: "init", cursors: this.cursors }));
  }

  onMessage(message: string, sender: Party.Connection) {
    let data: { type: string } & Partial<CursorState>;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

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
      this._removeCursor(sender.id);
    }
  }

  onClose(conn: Party.Connection) {
    this._removeCursor(conn.id);
  }

  onError(conn: Party.Connection) {
    this._removeCursor(conn.id);
  }

  private _removeCursor(id: string) {
    if (!this.cursors[id]) return;
    delete this.cursors[id];
    this.party.broadcast(JSON.stringify({ type: "leave", id }));
  }
}