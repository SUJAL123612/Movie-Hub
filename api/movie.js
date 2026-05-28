const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async function handler(req, res) {
  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "Missing endpoint" });
  }

  const API_KEY = process.env.TMDB_API_KEY;
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `https://api.themoviedb.org/3${endpoint}${separator}api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
}