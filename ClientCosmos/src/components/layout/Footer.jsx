import { Link } from "react-router-dom";
import { Linkedin, Mail, Orbit } from "lucide-react";
import { TOPICS } from "./navLinks";

const EXPLORE = [
  { label: "Home", to: "/HomePage" },
  { label: "News", to: "/news" },
  { label: "Posts", to: "/userPosts" },
  { label: "Chats", to: "/chats" },
];

const COMPANY = [
  { label: "About us", to: "/about" },
  { label: "Contact us", to: "/contact" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
];

const linkClass = "text-gray-400 transition hover:text-white";

function Column({ title, items }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={linkClass}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-black text-gray-300">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/HomePage" className="inline-flex items-center gap-2">
            <Orbit className="h-5 w-5 text-sky-400" />
            <span className="font-poppins text-lg font-bold tracking-[0.25em] text-white">COSMOS</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            Your hub for everything space: daily NASA imagery, the latest news, and a community of
            people who love looking up.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.linkedin.com/in/musthafa-cp-312b59287"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-gray-300 transition hover:border-white/40 hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:musthafacp0007@gmail.com"
              aria-label="Email us"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-gray-300 transition hover:border-white/40 hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <Column title="Explore" items={EXPLORE} />
        <Column title="Topics" items={TOPICS} />
        <Column title="Company" items={COMPANY} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} COSMOS. Built by Musthafa CP.</p>
          <p>Space data and imagery courtesy of NASA.</p>
        </div>
      </div>
    </footer>
  );
}
