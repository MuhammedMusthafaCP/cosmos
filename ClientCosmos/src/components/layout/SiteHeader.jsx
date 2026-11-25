import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Orbit, X } from "lucide-react";
import {
  AltArrowDownIcon,
  GearIcon,
  LetterIcon,
  LogoutIcon,
  MenuIcon,
  UserCircleIcon,
} from "../ui/icons";
import Avatar from "../ui/Avatar";
import ConfirmDialog from "../ui/ConfirmDialog";
import useLogout from "../../hooks/useLogout";
import { TOPICS } from "./navLinks";

const LINKS = [
  { label: "Home", to: "/HomePage" },
  { label: "News", to: "/news" },
  { label: "Posts", to: "/userPosts" },
  { label: "Chats", to: "/chats", also: "/communitychats" },
  { label: "About", to: "/about" },
];

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

// Active links get a soft pill plus a glowing dot under the label.
const linkClass = ({ isActive }) =>
  `relative rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${focusRing} ${
    isActive
      ? "bg-white/10 text-white after:absolute after:-bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-sky-400 after:shadow-[0_0_8px_2px_rgba(56,189,248,0.8)] after:content-['']"
      : "text-gray-400 hover:bg-white/5 hover:text-white"
  }`;

/** Closes `onClose` on outside click or Escape while `active`. */
function useDismiss(ref, active, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && onClose();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, active, onClose]);
}

function Dropdown({ label, active, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = () => setOpen(false);
  useDismiss(ref, open, close);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${focusRing} ${
          open || active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {label}
        <AltArrowDownIcon className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            onClick={close}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full z-50 mt-3 w-56 origin-top-left rounded-xl border border-white/10 bg-neutral-950/95 p-1.5 shadow-2xl shadow-black/60 ring-1 ring-black backdrop-blur-xl"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const menuItem =
  `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none`;

export default function SiteHeader({ valid, userData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const userRef = useRef(null);
  const [userOpen, setUserOpen] = useState(false);
  const { pathname } = useLocation();
  // A link can also light up for related routes (Chats covers the community chats page).
  const linkFor = (l) => ({ isActive }) =>
    linkClass({ isActive: isActive || Boolean(l.also && pathname.toLowerCase().startsWith(l.also)) });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();
  useDismiss(userRef, userOpen, () => setUserOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);

  const authButtons = (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className={`rounded-full px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white ${focusRing}`}
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className={`group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_-4px_rgba(255,255,255,0.5)] transition hover:-translate-y-px hover:bg-sky-50 hover:shadow-[0_0_24px_-2px_rgba(125,211,252,0.7)] ${focusRing}`}
      >
        Sign up
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b text-white backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? "border-white/10 bg-black/80 shadow-lg shadow-black/40" : "border-white/5 bg-black/95"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            to="/HomePage"
            aria-label="COSMOS home"
            className={`group flex items-center gap-2 rounded-md ${focusRing}`}
          >
            <Orbit className="h-5 w-5 text-sky-400 transition-transform duration-700 group-hover:rotate-180" />
            <span className="bg-gradient-to-r from-white to-sky-200 bg-clip-text font-poppins text-lg font-bold tracking-[0.25em] text-transparent">
              COSMOS
            </span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {LINKS.slice(0, 2).map((l) => (
              <NavLink key={l.to} to={l.to} className={linkFor(l)}>{l.label}</NavLink>
            ))}
            <Dropdown label="Topics" active={TOPICS.some((t) => pathname.startsWith(t.to))}>
              {TOPICS.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  role="menuitem"
                  className={`${menuItem} ${pathname.startsWith(t.to) ? "bg-white/10 text-white" : ""}`}
                >
                  {t.label}
                </Link>
              ))}
            </Dropdown>
            {LINKS.slice(2).map((l) => (
              <NavLink key={l.to} to={l.to} className={linkFor(l)}>{l.label}</NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center lg:flex">
          {valid ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={userOpen}
                onClick={() => setUserOpen((o) => !o)}
                className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-colors hover:bg-white/10 ${focusRing}`}
              >
                <Avatar src={userData?.profilePic} name={userData?.name} size="sm" />
                <span className="max-w-[10rem] truncate text-sm">{userData?.name}</span>
                <AltArrowDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                      <Avatar src={userData?.profilePic} name={userData?.name} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{userData?.name}</p>
                        {userData?.email && (
                          <p className="truncate text-xs text-gray-500">{userData.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="p-1.5">
                      <button role="menuitem" className={menuItem} onClick={() => navigate("/profile")}>
                        <UserCircleIcon className="shrink-0 text-gray-500" /> View profile
                      </button>
                      <button role="menuitem" className={menuItem} onClick={() => navigate("/chats")}>
                        <LetterIcon className="h-[18px] w-[18px] shrink-0 text-gray-500" /> Messages
                      </button>
                      <button role="menuitem" className={menuItem} onClick={() => navigate("/settings")}>
                        <GearIcon className="shrink-0 text-gray-500" /> Account settings
                      </button>
                    </div>
                    <div className="border-t border-white/10 p-1.5">
                      <button
                        role="menuitem"
                        className={`${menuItem} hover:!bg-red-500/10 hover:!text-red-300`}
                        onClick={() => setConfirmLogout(true)}
                      >
                        <LogoutIcon className="shrink-0 text-gray-500" /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            authButtons
          )}
        </div>

        <button
          type="button"
          className={`rounded-full p-2 transition-colors hover:bg-white/10 lg:hidden ${focusRing}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-black px-4 pb-6 pt-3 lg:hidden">
          {valid && (
            <Link to="/profile" className="mb-3 flex items-center gap-3 rounded-lg bg-white/10 p-3">
              <Avatar src={userData?.profilePic} name={userData?.name} size="md" />
              <span className="truncate font-medium">{userData?.name}</span>
            </Link>
          )}
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkFor(l)}>{l.label}</NavLink>
            ))}
            <p className="mt-3 px-3 text-xs uppercase tracking-widest text-gray-500">Topics</p>
            {TOPICS.map((t) => (
              <NavLink key={t.to} to={t.to} className={linkClass}>{t.label}</NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-white/10 pt-4">
            {valid ? (
              <div className="flex flex-col gap-1">
                <NavLink to="/settings" className={linkClass}>Settings</NavLink>
                <button
                  onClick={() => setConfirmLogout(true)}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-300 hover:bg-white/10"
                >
                  Log out
                </button>
              </div>
            ) : (
              authButtons
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmLogout}
        title="Log out of COSMOS?"
        message="You will need to sign in again to post or chat."
        confirmLabel="Log out"
        danger
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </header>
  );
}
