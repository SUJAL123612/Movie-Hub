import { useState, useEffect } from "react";

const IMG_BASE = "https://image.tmdb.org/t/p";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10770: "TV Movie",
  37: "Western",
};

const FILTERS = [
  "All",
  "Action",
  "Comedy",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Anime",
];

// All API calls go through /api/movies proxy → Vercel → TMDB
const api = (endpoint: string) =>
  fetch(`/api/movies?endpoint=${encodeURIComponent(endpoint)}`).then((r) =>
    r.json()
  );

function StarRating({ score }: { score: number }) {
  const pct = Math.round((score / 10) * 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          position: "relative",
          width: 60,
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            borderRadius: 4,
            background: "linear-gradient(90deg, #e9b54a, #f5d07a)",
          }}
        />
      </div>

      <span style={{ fontSize: 12, color: "#f5d07a", fontWeight: 600 }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function MovieCard({
  movie,
  featured,
  onClick,
}: {
  movie: Movie;
  featured?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const genres = movie.genre_ids
    .slice(0, 2)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const year = movie.release_date?.split("-")[0] ?? "";

  if (featured) {
    return (
      <div
        onClick={onClick}
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          height: 420,
          background: movie.backdrop_path
            ? `url(${IMG_BASE}/w1280${movie.backdrop_path}) center/cover`
            : "linear-gradient(135deg,#1a1a2e,#16213e)",
          cursor: "pointer",
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.01)" : "scale(1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {genres.map((g) => (
              <span
                key={g}
                style={{
                  background: "rgba(233,181,74,0.18)",
                  color: "#f5d07a",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  padding: "3px 10px",
                  borderRadius: 30,
                  border: "1px solid rgba(233,181,74,0.3)",
                  textTransform: "uppercase",
                }}
              >
                {g}
              </span>
            ))}
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.2,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {movie.title}
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              margin: "0 0 12px",
              lineHeight: 1.5,
              maxWidth: 560,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.overview}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <StarRating score={movie.vote_average} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              {year}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        background: "#111827",
        cursor: "pointer",
        transition: "transform 0.25s, box-shadow 0.25s",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.6)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          paddingTop: "150%",
          background: "#1f2937",
        }}
      >
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 48, opacity: 0.2 }}>🎬</span>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 700,
            color: "#f5d07a",
          }}
        >
          ★ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#f9fafb",
            margin: "0 0 4px",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {movie.title}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {year}
          </span>

          {genres[0] && (
            <span
              style={{
                fontSize: 11,
                color: "rgba(233,181,74,0.7)",
                fontWeight: 600,
              }}
            >
              {genres[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", background: "#111827" }}>
      <div
        style={{
          paddingTop: "150%",
          background:
            "linear-gradient(90deg,#1f2937 25%,#374151 50%,#1f2937 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            height: 14,
            borderRadius: 4,
            background: "#1f2937",
            marginBottom: 6,
          }}
        />
        <div
          style={{ height: 12, borderRadius: 4, background: "#1f2937", width: "60%" }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  // Fetch trending
  useEffect(() => {
    api("/trending/movie/week?")
      .then((d) => setTrending(d.results?.slice(0, 5) ?? []))
      .catch(() => setTrending([]));
  }, []);

  // Fetch movies based on filter/search/page
  useEffect(() => {
    setLoading(true);

    const genreId =
      Object.keys(GENRE_MAP).find((k) => GENRE_MAP[+k] === activeFilter) ?? "";

    const endpoint = query
      ? `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : activeFilter === "Anime"
      ? `/discover/movie?with_genres=16&sort_by=popularity.desc&page=${page}`
      : activeFilter !== "All"
      ? `/discover/movie?sort_by=popularity.desc&page=${page}&with_genres=${genreId}`
      : `/discover/movie?sort_by=popularity.desc&page=${page}`;

    api(endpoint)
      .then((d) => {
        setMovies(d.results ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, activeFilter, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search.trim());
    setPage(1);
    setActiveFilter("All");
  };

  const openTrailer = async (movieId: number) => {
    try {
      const data = await api(`/movie/${movieId}/videos?`);
      const trailer = data.results?.find(
        (video: any) => video.site === "YouTube" && video.type === "Trailer"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const featuredMovie = trending[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        color: "#f9fafb",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shimmer { to { background-position: -200% 0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        ::-webkit-scrollbar { width: 6px }
        ::-webkit-scrollbar-track { background: #111 }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px }
      `}</style>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          onClick={() => setShowTrailer(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 900,
              background: "#000",
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 18,
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8,12,20,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 64,
            gap: 32,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              background: "linear-gradient(135deg,#e9b54a,#f5d07a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Playfair Display',serif",
              letterSpacing: -0.5,
            }}
          >
            MovieHub
          </span>

          <div style={{ display: "flex", gap: 24, flex: 1 }}>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#f5d07a",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              Home
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div style={{ position: "relative" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 30,
                  padding: "8px 16px 8px 38px",
                  color: "#fff",
                  fontSize: 14,
                  width: 220,
                  outline: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 15,
                }}
              >
                🔍
              </span>
            </div>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg,#e9b54a,#d4943a)",
                border: "none",
                borderRadius: 30,
                padding: "8px 18px",
                color: "#1a1100",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 2rem 4rem" }}>
        {!query && featuredMovie && (
          <section style={{ marginBottom: "3rem", animation: "fadeUp 0.6s ease both" }}>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Featured this week
            </h2>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}
            >
              <MovieCard
                movie={featuredMovie}
                featured
                onClick={() => openTrailer(featuredMovie.id)}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {trending.slice(1, 4).map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => openTrailer(m.id)}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      background: "#111827",
                      borderRadius: 12,
                      padding: "10px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "rgba(233,181,74,0.4)",
                        minWidth: 20,
                      }}
                    >
                      #{i + 2}
                    </span>
                    <img
                      src={m.poster_path ? `${IMG_BASE}/w92${m.poster_path}` : ""}
                      alt={m.title}
                      style={{
                        width: 36,
                        height: 54,
                        objectFit: "cover",
                        borderRadius: 6,
                        background: "#1f2937",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#f9fafb",
                          margin: "0 0 3px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {m.title}
                      </p>
                      <StarRating score={m.vote_average} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!query && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
                style={{
                  background:
                    activeFilter === f
                      ? "linear-gradient(135deg,#e9b54a,#d4943a)"
                      : "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: 30,
                  padding: "7px 18px",
                  color: activeFilter === f ? "#1a1100" : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: activeFilter === f ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 18,
            marginBottom: 32,
          }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.length > 0
            ? movies.map((m) => (
                <MovieCard key={m.id} movie={m} onClick={() => openTrailer(m.id)} />
              ))
            : (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "4rem 0",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 15,
                }}
              >
                No movies found.
              </div>
            )}
        </div>
      </main>
    </div>
  );
}