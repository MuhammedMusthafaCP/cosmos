import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, X, Newspaper } from "lucide-react";
import useUserData from "../utils/UserData";
import { formatNewsDate } from "../utils/formatDate";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import NewsImage from "../ui/NewsPlaceholder";
import PageHeader from "../ui/PageHeader";
import { VideoTag } from "../ui/MediaView";

function News({ setSelectedNews }) {
  const navigate = useNavigate();
  const { valid, userData } = useUserData();
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");

  // Wait for a pause in typing before asking the server to search.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchTerm.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPage = useCallback(
    async (pageNumber, signal) => {
      const response = await axios.get(`${API_URL}/news`, {
        params: { page: pageNumber, limit: 24, q: query || undefined },
        signal,
      });
      return response.data;
    },
    [query]
  );

  // First page (and every new search).
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchPage(1, controller.signal)
      .then((data) => {
        setNews(data.items || []);
        setTotal(data.total || 0);
        setHasMore(Boolean(data.hasMore));
        setPage(1);
        setStatus("ready");
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("Error fetching news:", err);
        setStatus("error");
      });
    return () => controller.abort();
  }, [fetchPage]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await fetchPage(page + 1);
      setNews((current) => [...current, ...(data.items || [])]);
      setHasMore(Boolean(data.hasMore));
      setPage(page + 1);
    } catch (err) {
      console.error("Error fetching more news:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNewsClick = (detail) => {
    setSelectedNews(detail);
    navigate(`/news/${detail._id}`);
  };

  return (
    <SiteLayout valid={valid} userData={userData}>
      <PageHeader
        eyebrow="Space news"
        title="News updates"
        description="The latest discoveries, launches and missions from around the universe."
      >
        <div className="relative w-full sm:w-80">
          <label htmlFor="news-search" className="sr-only">
            Search news
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            id="news-search"
            type="search"
            placeholder="Search news"
            className="d-input pl-9 pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PageHeader>


      {status === "loading" && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading news">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="d-card animate-pulse overflow-hidden">
              <div className="aspect-video bg-white/5" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-4/5 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-2/3 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="mt-16 text-center text-gray-400">
          Could not load the news right now. Please try again later.
        </p>
      )}

      {status === "ready" && news.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-2 text-center text-gray-400">
          <Newspaper className="h-8 w-8" />
          <p>{query ? "No news matches your search." : "No news available yet."}</p>
        </div>
      )}

      {status === "ready" && news.length > 0 && (
        <>
          <p className="mt-6 text-sm text-gray-500">
            {total} {total === 1 ? "story" : "stories"}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {news.map((detail) => (
              <button
                key={detail._id}
                type="button"
                onClick={() => handleNewsClick(detail)}
                className="d-card d-card-hover group flex flex-col overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <div className="overflow-hidden">
                  <NewsImage
                    className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                    item={detail}
                    alt=""
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  {detail.video && <VideoTag className="mb-2 self-start" />}
                  <h2 className="line-clamp-2 font-semibold leading-snug group-hover:text-sky-200">{detail.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-400">{detail.description}</p>
                  <p className="mt-auto pt-4 text-xs text-gray-500">
                    {[detail.newsSite, formatNewsDate(detail.publishedAt)].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more stories"}
              </button>
            </div>
          )}
        </>
      )}
    </SiteLayout>
  );
}

export default News;
