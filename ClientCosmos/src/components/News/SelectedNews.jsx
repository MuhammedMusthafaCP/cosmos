import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Newspaper, Share2 } from "lucide-react";
import useUserData from "../utils/UserData";
import { formatNewsDate } from "../utils/formatDate";
import { topicInfo } from "../utils/newsTopics";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import NewsImage from "../ui/NewsPlaceholder";
import MediaView, { newsMedia, VideoTag } from "../ui/MediaView";
import { format } from "date-fns";

function ArticleSkeleton() {
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-3" aria-busy="true" role="status" aria-label="Loading story">
      <div className="space-y-4 lg:col-span-2">
        <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-24 animate-pulse rounded-lg bg-white/5" />
        <div className="aspect-video animate-pulse rounded-2xl bg-white/5" />
        <div className="h-24 animate-pulse rounded-lg bg-white/5" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  );
}

function ShareButton({ story }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet dismissed or clipboard unavailable: nothing to do */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}

/** Article page at /news/:id. Renders instantly from the clicked card, then loads the story itself. */
function SelectedNews({ selectedNews }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { valid, userData } = useUserData();

  const preloaded = selectedNews?._id === id ? selectedNews : null;
  const [story, setStory] = useState(preloaded);
  const [status, setStatus] = useState(preloaded ? "ready" : "loading");
  const [related, setRelated] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    setStatus((current) => (preloaded ? current : "loading"));
    axios
      .get(`${API_URL}/news/${id}`, { signal: controller.signal })
      .then((response) => {
        setStory(response.data);
        setStatus("ready");
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setStatus(err.response?.status === 404 ? "missing" : preloaded ? "ready" : "error");
      });
    return () => controller.abort();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const topic = story?.topic;
  useEffect(() => {
    if (!topic) return undefined;
    const controller = new AbortController();
    axios
      .get(`${API_URL}/news/related/${encodeURIComponent(topic)}`, {
        params: { exclude: id, limit: 5 },
        signal: controller.signal,
      })
      .then((response) => setRelated(Array.isArray(response.data) ? response.data : []))
      .catch((err) => {
        if (!axios.isCancel(err)) console.error("Error while fetching related news", err);
      });
    return () => controller.abort();
  }, [topic, id]);

  useEffect(() => {
    if (!story?.title) return undefined;
    const previous = document.title;
    document.title = `${story.title} | Cosmos`;
    return () => {
      document.title = previous;
    };
  }, [story?.title]);

  const backLink = (
    <Link
      to="/news"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to news
    </Link>
  );

  if (status === "missing" || status === "error" || (status === "ready" && !story)) {
    return (
      <SiteLayout valid={valid} userData={userData}>
        <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
          <Newspaper className="h-10 w-10 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold">
            {status === "error" ? "Couldn't load this story" : "Story not found"}
          </h1>
          <p className="mt-2 text-gray-400">
            {status === "error"
              ? "Something went wrong. Please try again in a moment."
              : "It may be older than our two-month archive and has been removed."}
          </p>
          <div className="mt-6">{backLink}</div>
        </div>
      </SiteLayout>
    );
  }

  if (status === "loading" || !story) {
    return (
      <SiteLayout valid={valid} userData={userData}>
        {backLink}
        <ArticleSkeleton />
      </SiteLayout>
    );
  }

  const { label: topicLabel, path: topicPath } = topicInfo(story.topic);
  const published = story.publishedAt ? new Date(story.publishedAt) : null;
  const byline = (story.authors || []).filter((name) => name && name !== story.newsSite).slice(0, 2).join(", ");

  return (
    <SiteLayout valid={valid} userData={userData}>
      {backLink}

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {topicPath ? (
              <Link
                to={topicPath}
                className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-sky-300 transition hover:bg-sky-400/20"
              >
                {topicLabel}
              </Link>
            ) : (
              <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-sky-300">
                {topicLabel}
              </span>
            )}
            {story.video && <VideoTag />}
          </div>

          <h1 className="mt-4 font-poppins text-3xl font-bold leading-tight sm:text-4xl">{story.title}</h1>

          <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-gray-400">
            {story.newsSite && <span className="font-medium text-gray-200">{story.newsSite}</span>}
            {byline && <span>by {byline}</span>}
            {published && (
              <time dateTime={published.toISOString()} title={format(published, "PPpp")}>
                {story.newsSite || byline ? "· " : ""}
                {format(published, "d MMMM yyyy")} ({formatNewsDate(story.publishedAt)})
              </time>
            )}
          </p>

          <MediaView
            media={newsMedia(story)}
            alt={story.title}
            loading="eager"
            className="mt-6 aspect-video w-full rounded-2xl object-cover ring-1 ring-white/10"
          />

          {story.description && (
            <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-300">{story.description}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/80"
              >
                {story.video ? "Watch" : "Read the full story"}
                {story.newsSite ? ` on ${story.newsSite}` : ""}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <ShareButton story={story} />
          </div>

          <p className="mt-6 max-w-3xl text-xs text-gray-500">
            This is a summary. The full story and all credit belong to {story.newsSite || "the original publisher"}.
          </p>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-poppins text-lg font-semibold uppercase tracking-wide">
            More in {topicLabel}
          </h2>
          {related.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">No related stories yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/news/${item._id}`)}
                    className="d-card d-card-hover flex w-full items-start gap-3 p-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <NewsImage
                      item={item}
                      compact
                      alt=""
                      loading="lazy"
                      className="h-20 w-28 shrink-0 rounded-md object-cover"
                    />
                    <span className="min-w-0">
                      {item.video && <VideoTag className="mb-1" />}
                      <span className="line-clamp-2 block font-semibold leading-snug">{item.title}</span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {[item.newsSite, formatNewsDate(item.publishedAt)].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link to="/news" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-sky-300 hover:text-sky-200">
            All news <ArrowUpRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </SiteLayout>
  );
}

export default SelectedNews;
