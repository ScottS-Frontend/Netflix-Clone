export default async function handler(req, res) {
  const token = process.env.TMDB_BEARER_TOKEN; // server-only env var

  if (!token) {
    return res.status(500).json({ error: "Missing TMDB_BEARER_TOKEN" });
  }

  // Example: /api/tmdb?path=movie/now_playing&language=en-US&page=1
  const { path, ...rest } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path" });
  }

  const params = new URLSearchParams(rest);
  const url = `https://api.themoviedb.org/3/${path}?${params.toString()}`;

  try {
    const r = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "TMDB fetch failed", details: String(err) });
  }
}
