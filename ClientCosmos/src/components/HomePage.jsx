import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import SOLARSYSTEM from "../Assets/SOLARSYSTEM1.webp";
import BLACKHOLE from "../Assets/blackhole.webp";
import useUserData from "./utils/UserData";
import { API_URL } from "../config";
import SiteLayout from "./layout/SiteLayout";
import SectionHeading from "./ui/SectionHeading";
import SafeImage from "./ui/SafeImage";
import NewsImage from "./ui/NewsPlaceholder";
import MediaView, { apodMedia, VideoTag } from "./ui/MediaView";
import Avatar from "./ui/Avatar";
import { TOPIC_OPTIONS } from "./Forms/topics";

function HomePage({ setSelectedNews }) {
  const { valid, userData, loading, setLoading } = useUserData();
  const navigate = useNavigate();
  const [apod, setAPOD] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [userposts, setUserposts] = useState([]);
  const [showFullApod, setShowFullApod] = useState(false);

  const selectedNews = (e) => {
    setSelectedNews(e);
    navigate(`/news/${e._id}`);
  };

  useEffect(() => {
    const load = async (path, set, label) => {
      try {
        const response = await axios.get(`${API_URL}${path}`);
        set(response.data);
      } catch (err) {
        console.log(`Error while fetching ${label}`, err);
      }
    };

    const timer = setTimeout(() => setLoading(false), 1000);
    load("/news/apod", setAPOD, "APOD");
    load("/news/latest", setNewsData, "the news data");
    load("/posts/getrandomposts", setUserposts, "userPosts");
    return () => clearTimeout(timer);
  }, [setLoading]);

  const topics = [
    { name: "Solar System", to: "/solarsystem", img: SOLARSYSTEM, blurb: "Our Sun, eight planets and everything in orbit." },
    { name: "Stars", to: "/stars", img: "/seed-images/pleiades.jpg", blurb: "How they are born, shine and die." },
    { name: "Galaxies", to: "/galaxies", img: "/seed-images/andromeda.jpg", blurb: "Billions of stars, bound by gravity." },
    { name: "Nebulae", to: "/nebulas", img: "/seed-images/orion-nebula.jpg", blurb: "Stellar nurseries and cosmic clouds." },
    { name: "Black Holes", to: "/blackholes", img: BLACKHOLE, blurb: "Where gravity wins against light." },
  ];
  const topicLabel = (value) => TOPIC_OPTIONS.find((t) => t.value === value)?.label;
  const [featured, ...moreNews] = newsData;

  if (loading) {
    return (
      <div className="grid h-screen w-screen place-items-center bg-black">
        <div className="loading-container">
          <div className="loader">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  const viewAll = "inline-flex items-center gap-1 text-sm font-medium text-gray-400 transition hover:text-white";

  return (
    <SiteLayout valid={valid} userData={userData}>
      <h1 className="sr-only">COSMOS: your hub for everything space</h1>

      {/* Astronomy picture of the day */}
      {apod && apod.title && (
        <section aria-labelledby="apod-heading" className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <MediaView
              media={apodMedia(apod)}
              alt={apod.title}
              loading="eager"
              className={`w-full rounded-2xl ring-1 ring-white/10 ${
                apod.media_type === "video" ? "aspect-video" : "max-h-[70vh] object-cover"
              }`}
            />
          </div>
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Picture of the day
            </span>
            <h2 id="apod-heading" className="mt-4 font-poppins text-3xl font-bold leading-tight sm:text-4xl">
              {apod.title}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {apod.date} &middot; Credit: {apod.copyright || "NASA"}
            </p>
            <p className={`mt-5 leading-relaxed text-gray-300 ${showFullApod ? "" : "line-clamp-6"}`}>
              {apod.explanation}
            </p>
            <button
              type="button"
              onClick={() => setShowFullApod((v) => !v)}
              aria-expanded={showFullApod}
              className="mt-3 text-sm font-medium text-sky-300 hover:text-sky-200"
            >
              {showFullApod ? "Show less" : "Read more"}
            </button>
          </div>
        </section>
      )}

      {/* Latest news */}
      {featured && (
        <section className="mt-20" aria-labelledby="news-heading">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading><span id="news-heading">Latest news</span></SectionHeading>
            <Link to="/news" className={viewAll}>All news <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <button
              type="button"
              onClick={() => selectedNews(featured)}
              className="group relative min-h-[22rem] overflow-hidden rounded-2xl bg-gray-900 text-left lg:col-span-7"
            >
              <NewsImage
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                item={featured}
                alt=""
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-sky-300">
                  Featured {featured.video && <VideoTag />}
                </span>
                <h3 className="mt-2 line-clamp-3 font-poppins text-2xl font-bold leading-snug sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-gray-300 sm:text-base">{featured.description}</p>
              </span>
            </button>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {moreNews.map((news) => (
                <button
                  key={news._id}
                  type="button"
                  onClick={() => selectedNews(news)}
                  className="group flex flex-1 gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <NewsImage className="h-24 w-28 shrink-0 rounded-lg object-cover sm:h-28 sm:w-36" item={news} alt="" />
                  <span className="min-w-0 self-center">
                    {news.video && <VideoTag className="mb-1" />}
                    <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-sky-200">{news.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-400">{news.description}</p>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community posts */}
      {userposts.length > 0 && (
        <section className="mt-20" aria-labelledby="posts-heading">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading><span id="posts-heading">From the community</span></SectionHeading>
            <Link to="/userPosts" className={viewAll}>All posts <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {userposts.map((post) => (
              <button
                key={post._id}
                type="button"
                onClick={() => navigate("/userPosts")}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:-translate-y-1 hover:border-white/25"
              >
                <div className="relative">
                  <SafeImage
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    src={post.image}
                    alt={post.caption}
                  />
                  {topicLabel(post.topic) && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      {topicLabel(post.topic)}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2">
                    <Avatar src={post.profilePic} name={post.name} size="xs" />
                    <span className="truncate text-sm font-medium text-gray-200">{post.name}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">{post.caption}</p>
                  <div className="mt-auto flex items-center gap-4 pt-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" /> {post.comments.length}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Topics */}
      <section className="mt-20" aria-labelledby="topics-heading">
        <SectionHeading><span id="topics-heading">Explore topics</span></SectionHeading>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:h-[34rem] lg:grid-cols-4 lg:grid-rows-2">
          {topics.map((topic, i) => (
            <Link
              key={topic.name}
              to={topic.to}
              className={`group relative min-h-[11rem] overflow-hidden rounded-2xl bg-gray-900 ${
                i === 0 ? "sm:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <img
                src={topic.img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <span>
                  <span className={`block font-poppins font-bold ${i === 0 ? "text-3xl" : "text-xl"}`}>{topic.name}</span>
                  <span className="mt-1 block text-sm text-gray-300">{topic.blurb}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      {!valid && (
        <section className="mt-20 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-transparent px-6 py-12 text-center sm:px-12">
          <h2 className="font-poppins text-2xl font-bold sm:text-3xl">Join the COSMOS community</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Share your astrophotography, discuss the latest discoveries and chat with fellow stargazers.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-sky-50">
              Create a free account
            </Link>
            <Link to="/login" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium hover:bg-white/10">
              Log in
            </Link>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

export default HomePage;
