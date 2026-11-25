import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import Avatar from "../ui/Avatar";
import SafeImage from "../ui/SafeImage";
import Lightbox from "../ui/Lightbox";
import { postAge, postDate, postTopicLabel } from "../utils/postMeta";

const LONG_CAPTION = 140;

/**
 * Single post card shared by the feed, saved posts, own profile and other users' profiles.
 * Pass onEdit/onDelete to show owner actions, onTopicClick to make the topic chip a filter.
 */
export default function PostCard({ post, userData, onLike, onSave, onComment, onEdit, onDelete, onTopicClick }) {
  const [expanded, setExpanded] = useState(false);
  const [viewing, setViewing] = useState(false);
  const loggedIn = Boolean(userData?._id);
  const liked = loggedIn && post.likes.includes(userData._id);
  const saved = Boolean(userData?.saved_posts?.includes(post._id));
  const loginHint = loggedIn ? undefined : "Log in to interact";
  const topic = postTopicLabel(post.topic);
  const created = postDate(post);
  const age = postAge(post);
  const isLong = (post.caption || "").length > LONG_CAPTION;
  const authorPath = post.createdBy ? (post.createdBy === userData?._id ? "/profile" : `/userprofile/${post.createdBy}`) : null;
  const iconBtn =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <article className="d-card flex flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={post.profilePic} name={post.name} size="sm" />
          <div className="min-w-0 leading-tight">
            <h3 className="truncate text-sm font-semibold text-white">
              {authorPath ? (
                <Link to={authorPath} className="hover:underline focus:outline-none focus-visible:underline">
                  {post.name}
                </Link>
              ) : (
                post.name
              )}
            </h3>
            {age && (
              <time
                dateTime={created.toISOString()}
                title={created.toLocaleString()}
                className="text-xs text-gray-500"
              >
                {age}
              </time>
            )}
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <button type="button" onClick={() => onEdit(post)} aria-label="Edit post" className="d-btn !p-2">
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(post._id)}
                aria-label="Delete post"
                className="d-btn !p-2 hover:!bg-red-500/10 hover:!text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </header>

      {post.image ? (
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label="View full image"
          className="mt-3 block w-full cursor-zoom-in overflow-hidden bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
        >
          <SafeImage
            src={post.image}
            alt={post.caption ? `Post image: ${post.caption}` : "Post image"}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        </button>
      ) : (
        <SafeImage src={null} alt="" className="mt-3 aspect-[4/3] w-full" />
      )}
      {viewing && <Lightbox src={post.image} alt={post.caption} onClose={() => setViewing(false)} />}

      <div className="px-4 pt-3">
        {topic &&
          (onTopicClick ? (
            <button
              type="button"
              onClick={() => onTopicClick(post.topic)}
              className="mb-2 rounded-full bg-sky-400/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-sky-300 transition hover:bg-sky-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              {topic}
            </button>
          ) : (
            <span className="mb-2 inline-block rounded-full bg-sky-400/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-sky-300">
              {topic}
            </span>
          ))}
        <p
          className={`whitespace-pre-line break-words text-sm leading-relaxed text-gray-200 ${
            isLong && !expanded ? "line-clamp-3" : ""
          }`}
        >
          {post.caption}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 text-xs font-medium text-sky-300 hover:text-sky-200"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <footer className="mt-auto flex items-center justify-between gap-2 px-2 pb-3 pt-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onLike(post)}
            disabled={!loggedIn}
            title={loginHint}
            aria-pressed={liked}
            aria-label={`${liked ? "Unlike" : "Like"} post, ${post.likes.length} likes`}
            className={iconBtn}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current text-red-500" : ""}`} />
            <span>{post.likes.length}</span>
          </button>
          <button
            type="button"
            onClick={() => onComment(post._id)}
            aria-label={`Open comments, ${post.comments.length} comments`}
            className={iconBtn}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments.length}</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSave(post)}
          disabled={!loggedIn}
          title={loginHint}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save post"}
          className={iconBtn}
        >
          <Bookmark className={`h-5 w-5 ${saved ? "fill-current text-sky-400" : ""}`} />
        </button>
      </footer>
    </article>
  );
}
