import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";

const app = new Hono();
app.use("*", cors());

const cache = new Map<string, { data: TcData; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000;

interface TcData {
  compra: number;
  venta: number;
  fecha: string;
  origen: string;
}

function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "America/Lima" });
}

function parseNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

async function fetchSunat(date: string): Promise<TcData> {
  const url = `https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha=${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SUNAT API returned ${res.status}`);
  const json = await res.json() as Record<string, unknown>;

  const compra = parseNum(json.compra);
  const venta = parseNum(json.venta);
  if (compra === null && venta === null) throw new Error("No TC data in response");

  return {
    compra: compra ?? 0,
    venta: venta ?? 0,
    fecha: String(json.fecha ?? date),
    origen: String(json.origen ?? "SUNAT"),
  };
}

app.get("/api/exchange-rate", async (c) => {
  const date = c.req.query("date") || todayISO();
  const nowUtc5 = new Date().toLocaleString("sv-SE", { timeZone: "America/Lima" });
  const cached = cache.get(date);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return c.json({ ...cached.data, source: "cache", utc5: nowUtc5 });
  }
  try {
    const data = await fetchSunat(date);
    cache.set(date, { data, ts: Date.now() });
    return c.json({ ...data, source: "sunat", utc5: nowUtc5 });
  } catch (e) {
    if (cached) {
      return c.json({ ...cached.data, source: "stale-cache", utc5: nowUtc5 });
    }
    return c.json({ error: e instanceof Error ? e.message : "Failed to fetch", utc5: nowUtc5 }, { status: 502 });
  }
});

app.get("/api/health", (c) => c.json({ ok: true }));

const distPath = import.meta.dir + "/../../web/dist";

app.use("/*", serveStatic({ root: distPath }));
app.get("/*", serveStatic({ root: distPath, path: "index.html" }));

const port = Number(process.env.PORT) || 3001;

const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`Server running at http://localhost:${server.port}`);
