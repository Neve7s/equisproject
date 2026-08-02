export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/exchange-rate") {
      const date = url.searchParams.get("date") || new Date().toLocaleDateString("sv-SE", { timeZone: "America/Lima" });
      try {
        const res = await fetch(`https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha=${date}`);
        if (!res.ok) throw new Error(`SUNAT ${res.status}`);
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
