// app/api/guestbook/route.ts
// import { db } from '@/lib/db';
import { createClient } from '@libsql/client';

// Run once to set up the table:
// await db.execute(`CREATE TABLE IF NOT EXISTS entries (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   created_at INTEGER NOT NULL
// )`);

// const db = createClient({
//   url: process.env.TURSO_DB_URL!,
//   authToken: process.env.TURSO_AUTH_TOKEN!,
// });

function getDb() {
  return createClient({
    url: process.env.TURSO_DB_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

export async function GET() {
  const db = getDb();
  const { rows } = await db.execute(
    'SELECT * FROM entries ORDER BY created_at DESC'
  );
  const count = rows.length;
  return Response.json({ count, entries: rows });
}

export async function POST(req: Request) {
  const db = getDb();
  try {
    const { name } = await req.json();
    if (!name) return Response.json({ error: 'Missing fields' }, { status: 400 });

    await db.execute({
      sql: 'INSERT INTO entries (name, created_at) VALUES (?, ?)',
      args: [name, Date.now()],
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}