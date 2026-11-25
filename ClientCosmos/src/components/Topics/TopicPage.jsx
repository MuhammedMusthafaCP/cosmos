import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import useUserData from "../utils/UserData";
import { formatNewsDate } from "../utils/formatDate";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import SafeImage from "../ui/SafeImage";
import { VideoTag } from "../ui/MediaView";
import NewsImage from "../ui/NewsPlaceholder";

/** Route for each topic label used in "Discover more" cards. */
const TOPIC_PATHS = {
  "SOLAR SYSTEM": "/solarsystem",
  STARS: "/stars",
  GALAXIES: "/galaxies",
  NEBULAS: "/nebulas",
  NEBULAE: "/nebulas",
  "BLACK HOLE": "/blackholes",
  SUPERNOVAS: "/supernovas",
};

const bodyText = "text-base leading-8 text-gray-300 sm:text-lg";
const h2Class = "mt-16 font-poppins text-2xl font-bold text-white sm:text-3xl";
const h3Class = "mt-10 font-poppins text-xl font-semibold text-white sm:text-2xl";

function Paragraphs({ text }) {
  const list = Array.isArray(text) ? text : [text];
  return list.map((p, i) => (
    <p key={i} className={`${bodyText} mt-5 max-w-3xl`}>
      {p}
    </p>
  ));
}

function Block({ block }) {
  switch (block.type) {
    case "h2":
      return <h2 className={h2Class}>{block.text}</h2>;
    case "h3":
      return <h3 className={h3Class}>{block.text}</h3>;
    case "text":
      return <Paragraphs text={block.text} />;
    case "image":
      return (
        <figure className="mt-8 flex justify-center">
          <SafeImage
            src={block.src}
            alt={block.alt || ""}
            loading="lazy"
            className="max-h-[32rem] w-full max-w-2xl rounded-2xl object-contain"
          />
        </figure>
      );
    case "wideImage":
      return (
        <SafeImage
          src={block.src}
          alt={block.alt || ""}
          loading="lazy"
          className="mt-8 w-full rounded-2xl object-cover ring-1 ring-white/10"
        />
      );
    case "video":
      return (
        <div className="mt-8">
          {block.intro && <p className={`${bodyText} max-w-3xl`}>{block.intro}</p>}
          <div className="mt-4 aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-gray-900">
            <iframe
              className="h-full w-full"
              src={block.src}
              title={block.title || "Video"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          {block.credit && <p className="mt-2 text-sm text-gray-400">{block.credit}</p>}
        </div>
      );
    case "embed":
      return (
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
          <iframe className="h-full w-full" src={block.src} title={block.title} loading="lazy" />
        </div>
      );
    case "facts":
      return (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => (
            <li key={item._id} className="d-card d-card-hover p-5">
              <h3 className="font-poppins text-sm font-semibold uppercase tracking-widest text-sky-300">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-300 sm:text-base">{item.text}</p>
            </li>
          ))}
        </ul>
      );
    case "definitions":
      return (
        <ul className="mt-6 max-w-3xl space-y-5">
          {block.items.map((item, i) => (
            <li key={i} className={bodyText}>
              {item.label && <span className="font-semibold text-white">{item.label} </span>}
              {item.text}
            </li>
          ))}
        </ul>
      );
    case "mediaList":
      return (
        <ul className="mt-6 space-y-6">
          {block.items.map((item, i) => (
            <li key={i} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className={`${bodyText} flex-1`}>{item.text}</p>
              <SafeImage
                src={item.image}
                alt={item.alt || ""}
                loading="lazy"
                className="h-40 w-full rounded-lg object-cover sm:w-48"
              />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[32rem] text-left">
            <thead className="bg-white/5 text-white">
              <tr>
                {block.columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-sm font-semibold uppercase tracking-wide sm:px-6">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-gray-300">
              {block.rows.map((row) => (
                <tr key={row.name}>
                  <td className="px-4 py-4 font-medium text-white sm:px-6">{row.name}</td>
                  <td className="px-4 py-4 sm:px-6">{row.text}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <SafeImage
                      src={row.image}
                      alt={row.alt || row.name}
                      loading="lazy"
                      className="h-24 w-36 rounded-md object-cover"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "gallery":
      return (
        <ul
          tabIndex={0}
          aria-label="Planet gallery (scroll horizontally)"
          className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          {block.items.map((item) => (
            <li
              key={item.name}
              className="relative h-72 w-56 shrink-0 snap-start overflow-hidden rounded-2xl bg-gray-900 ring-1 ring-white/10 sm:h-80 sm:w-64"
            >
              <SafeImage src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-12">
                <span className="font-poppins text-xl font-bold text-white">{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}


const MEDIA = new Set(["image", "video", "embed"]);
const FULL = new Set(["wideImage", "facts", "table", "gallery", "mediaList", "h2"]);

/** Lays out a run of flow blocks: text on the left, images/videos on the right (text-only runs use 2 columns). */
function Run({ items }) {
  const media = items.filter((b) => MEDIA.has(b.type));
  const text = items.filter((b) => !MEDIA.has(b.type));
  if (media.length === 0) {
    return (
      <div className="lg:columns-2 lg:gap-14 [&_p]:max-w-none">
        {text.map((b, i) => <Block key={i} block={b} />)}
      </div>
    );
  }
  if (text.length === 0) {
    return <div>{media.map((b, i) => <Block key={i} block={b} />)}</div>;
  }
  return (
    <div className="grid items-start gap-x-14 lg:grid-cols-2">
      <div className="[&_p]:max-w-none">{text.map((b, i) => <Block key={i} block={b} />)}</div>
      <div className="lg:sticky lg:top-24 [&_figure]:mt-8 [&_div]:max-w-none">{media.map((b, i) => <Block key={i} block={b} />)}</div>
    </div>
  );
}

function Blocks({ blocks }) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length) out.push(<Run key={`run-${out.length}`} items={run} />);
    run = [];
  };
  blocks.forEach((b, i) => {
    if (FULL.has(b.type)) {
      flush();
      out.push(<Block key={`b-${i}`} block={b} />);
    } else {
      run.push(b);
    }
  });
  flush();
  return out;
}

function NewsCard({ news, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(news)}
        className="d-card d-card-hover group flex w-full flex-col overflow-hidden text-left sm:flex-row"
      >
        <NewsImage
          item={news}
          alt=""
          loading="lazy"
          className="aspect-video w-full shrink-0 object-cover sm:aspect-auto sm:h-auto sm:min-h-48 sm:w-64"
        />
        <span className="flex min-w-0 flex-col gap-2 p-5">
          {news.video && <VideoTag className="self-start" />}
          <span className="line-clamp-2 font-poppins text-lg font-semibold sm:text-xl">{news.title}</span>
          <span className="line-clamp-3 text-sm leading-7 text-gray-400 sm:text-base">
            {news.description}
          </span>
          {news.publishedAt && (
            <span className="text-xs text-gray-400">
              {[news.newsSite, formatNewsDate(news.publishedAt)].filter(Boolean).join(" · ")}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="d-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-white"
      >
        <span>{item.question}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm leading-7 text-gray-300 sm:text-base">{item.answer}</p>}
    </div>
  );
}

/**
 * Shared layout for all topic pages (Galaxies, Nebulas, Stars, Black Holes, Solar System).
 *
 * Props:
 *  - hero: { image, title?, alt? }  large banner (optional title overlay)
 *  - blocks: ordered content blocks, see <Block /> for supported `type`s
 *  - topic / newsHeading: latest news for that topic, loaded from the API (click -> /news/:id)
 *  - faqs: [{ question, answer }]
 *  - discover: [{ title, imageUrl }] other topics
 *  - children: extra content rendered after the blocks (for unique sections)
 */
export default function TopicPage({
  hero,
  blocks = [],
  topic,
  newsHeading = "Related news",
  faqs = [],
  discover = [],
  setSelectedNews,
  children,
}) {
  const navigate = useNavigate();
  const { valid, userData } = useUserData();
  const [openIndex, setOpenIndex] = useState(-1);
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (!topic) return undefined;
    let cancelled = false;
    axios
      .get(`${API_URL}/news/related/${encodeURIComponent(topic)}`, { params: { limit: 4 } })
      .then((response) => {
        if (!cancelled) setNews(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => console.error("Error fetching topic news:", err));
    return () => {
      cancelled = true;
    };
  }, [topic]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectNews = (item) => {
    if (setSelectedNews) setSelectedNews(item);
    navigate(`/news/${item._id}`);
  };

  return (
    <SiteLayout valid={valid} userData={userData}>
      {hero && (
        <section className="relative flex min-h-[18rem] items-end overflow-hidden rounded-3xl bg-gray-900 ring-1 ring-white/10 sm:min-h-[26rem] lg:min-h-[32rem]">
          <SafeImage
            src={hero.image}
            alt={hero.alt || ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {hero.title && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <h1 className="relative p-6 font-poppins text-4xl font-bold tracking-tight text-white sm:p-10 sm:text-6xl lg:p-14 lg:text-7xl">
                {hero.title}
              </h1>
            </>
          )}
        </section>
      )}

      <div className="pb-6">
        <Blocks blocks={blocks} />
        {children}
      </div>

      {news.length > 0 && (
        <section className="mt-20">
          <h2 className="font-poppins text-2xl font-bold text-white sm:text-3xl">{newsHeading}</h2>
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {news.map((item) => (
              <NewsCard key={item._id} news={item} onSelect={selectNews} />
            ))}
          </ul>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mt-20">
          <h2 className="font-poppins text-2xl font-bold text-white sm:text-3xl">People also ask</h2>
          <div className="mt-6 grid gap-3 lg:grid-cols-2 lg:items-start">
            {faqs.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </section>
      )}

      {discover.length > 0 && (
        <section className="mt-20">
          <h2 className="font-poppins text-2xl font-bold text-white sm:text-3xl">Discover more topics</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {discover.map((item) => (
              <li key={item._id}>
                <Link
                  to={TOPIC_PATHS[item.title] || "/HomePage"}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 ring-1 ring-white/10"
                >
                  <SafeImage
                    src={item.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-12 font-poppins text-xl font-bold text-white">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </SiteLayout>
  );
}
