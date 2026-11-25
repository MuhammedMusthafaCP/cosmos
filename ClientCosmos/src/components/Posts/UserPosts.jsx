import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ImageOff } from "lucide-react";
import { POST_TOPICS } from "../utils/postMeta";
import Select from "../ui/Select";
import { API_URL } from "../../config";
import PostComments from "../Comment/PostComments";
import PostCard from "./PostCard";
import { EmptyState, ErrorState, PostSkeletonGrid } from "./PostFeedStates";
import usePostActions from "./usePostActions";

const PAGE_SIZE = 12;
const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most liked" },
];

const chip = (active) =>
  `rounded-full border px-3.5 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
    active ? "border-sky-400 bg-sky-400/15 text-sky-200" : "border-white/15 text-gray-300 hover:bg-white/10"
  }`;

function UserPosts({ userData, setUserData }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [topic, setTopic] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [commentPostID, setCommentPostID] = useState("");
  const { toggleLike, toggleSave } = usePostActions({ userData, setUserData, setPosts });

  const fetchPage = useCallback(
    (pageNumber, signal) =>
      axios
        .get(`${API_URL}/posts/feed`, {
          params: { page: pageNumber, limit: PAGE_SIZE, sort, topic: topic || undefined },
          signal,
        })
        .then((response) => response.data),
    [sort, topic]
  );

  // First page, and again whenever the filter or sort changes.
  const load = useCallback(
    (signal) => {
      setLoading(true);
      setError(false);
      return fetchPage(1, signal)
        .then((data) => {
          setPosts(data.items);
          setPage(1);
          setHasMore(data.hasMore);
          setTotal(data.total);
          setLoading(false);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.error("Error fetching posts:", err);
          setError(true);
          setLoading(false);
        });
    },
    [fetchPage]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await fetchPage(page + 1);
      // New posts may have arrived since page 1 was loaded; never show a post twice.
      setPosts((current) => {
        const seen = new Set(current.map((p) => p._id));
        return [...current, ...data.items.filter((p) => !seen.has(p._id))];
      });
      setPage(page + 1);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (err) {
      console.error("Error loading more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const openComments = (postId) => {
    setCommentPostID(postId);
    setCommentModal(true);
  };

  let content;
  if (loading) content = <PostSkeletonGrid />;
  else if (error) content = <ErrorState message="We couldn't load posts right now." onRetry={load} />;
  else if (posts.length === 0)
    content = (
      <EmptyState icon={ImageOff} title={topic ? "No posts in this topic yet" : "No posts yet"}>
        {topic ? "Try another topic, or be the first to share one." : "Nobody has shared anything yet. Check back soon."}
      </EmptyState>
    );
  else
    content = (
      <>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userData={userData}
              onLike={toggleLike}
              onSave={toggleSave}
              onComment={openComments}
              onTopicClick={setTopic}
            />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-2">
          {hasMore ? (
            <button type="button" onClick={loadMore} disabled={loadingMore} className="d-btn disabled:opacity-50">
              {loadingMore ? "Loading…" : "Load more posts"}
            </button>
          ) : (
            <p className="text-sm text-gray-500">You&apos;re all caught up.</p>
          )}
        </div>
      </>
    );

  return (
    <>
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by topic">
          <button type="button" aria-pressed={!topic} onClick={() => setTopic("")} className={chip(!topic)}>
            All topics
          </button>
          {POST_TOPICS.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={topic === t.value}
              onClick={() => setTopic(topic === t.value ? "" : t.value)}
              className={chip(topic === t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500" aria-live="polite">
            {!loading && !error && `${total} ${total === 1 ? "post" : "posts"}`}
          </p>
          <Select label="Sort by" value={sort} onChange={setSort} options={SORTS} />
        </div>
      </div>
      {content}
      <PostComments
        post_id={commentPostID}
        userData={userData}
        commentModal={commentModal}
        toggleCommentModal={() => setCommentModal(false)}
      />
    </>
  );
}

export default UserPosts;
