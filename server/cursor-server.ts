import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";

interface CursorState {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  /** Which page path they're on */
  room: string;
}

// Map of connectionId → { socket, cursor }
const clients = new Map<string, { ws: WebSocket; cursor: CursorState }>();

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const connectionId = crypto.randomUUID();
  // Room is the page pathname, passed as ?room=/about
  const room = parse(req.url ?? "", true).query.room as string ?? "/";

  ws.on("message", (raw) => {
    let data: { type: string } & Partial<CursorState>;
    try { data = JSON.parse(raw.toString()); }
    catch { return; }

    if (data.type === "move") {
      const cursor: CursorState = {
        id: connectionId,
        x: data.x ?? 0,
        y: data.y ?? 0,
        color: data.color ?? "#888",
        name: data.name ?? "Visitor",
        room,
      };
      clients.set(connectionId, { ws, cursor });

      broadcast(room, { type: "move", ...cursor }, connectionId);
    }

    if (data.type === "leave") {
      removeCursor(connectionId, room);
    }
  });

  ws.on("close", () => removeCursor(connectionId, room));
  ws.on("error", () => removeCursor(connectionId, room));

  // Send existing cursors in this room to the new joiner
  const roomCursors = getRoomCursors(room);
  ws.send(JSON.stringify({ type: "init", cursors: roomCursors }));
});

function broadcast(room: string, message: object, excludeId?: string) {
  const payload = JSON.stringify(message);
  for (const [id, { ws, cursor }] of clients) {
    if (id === excludeId) continue;
    if (cursor.room !== room) continue;
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

function removeCursor(id: string, room: string) {
  if (!clients.has(id)) return;
  clients.delete(id);
  broadcast(room, { type: "leave", id });
}

function getRoomCursors(room: string) {
  return Object.fromEntries(
    [...clients.entries()]
      .filter(([, { cursor }]) => cursor.room === room)
      .map(([id, { cursor }]) => [id, cursor])
  );
}

console.log("Cursor WS server running on ws://localhost:3001");