import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import UserPosts from "./UserPosts";
import SavedPosts from "./SavedPosts";
import AllAOD from "./AllAOD";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import PageHeader from "../ui/PageHeader";
import Avatar from "../ui/Avatar";

const TABS = [
  { id: "userPosts", label: "User posts", title: "User posts", blurb: "Astrophotography, observations and questions from the community." },
  { id: "allAODS", label: "AODs", title: "Astronomy pictures", blurb: "NASA's picture of the day, collected over time." },
  { id: "savedPosts", label: "Saved", title: "Saved posts", blurb: "Posts you bookmarked to come back to." },
];

function Posts() {
  const { valid, userData, setUserData } = useUserData();
  const navigate = useNavigate();
  const [randomUsers, setRandomUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("userPosts");

  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/getusersforuserpost`);
        setRandomUsers(response.data);
      } catch (err) {
        console.log("Error while fetching the user data's", err);
      }
    };
    fetchRandomUsers();
  }, []);

  const onTabKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === activeTab);
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  };

  const active = TABS.find((t) => t.id === activeTab);

  return (
    <SiteLayout valid={valid} userData={userData}>
      <PageHeader eyebrow="Community" title={active.title} description={active.blurb}>
        {valid && (
          <Link to="/Postform" className="d-btn-primary">
            <Plus className="h-4 w-4" /> New post
          </Link>
        )}
      </PageHeader>

      <div
        role="tablist"
        aria-label="Post categories"
        className="mt-6 inline-flex gap-1 rounded-full border border-white/10 bg-white/5 p-1"
        onKeyDown={onTabKeyDown}
      >
        {TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="posts-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                selected ? "bg-white text-black" : "text-gray-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-label="Suggested users" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Suggested users</h2>
          {randomUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No suggestions right now.</p>
          ) : (
            <ul className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[70vh] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
              {randomUsers.map((user) => (
                <li key={user._id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => navigate(`/userprofile/${user._id}`)}
                    className="d-card d-card-hover flex w-full items-center gap-3 px-3 py-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <Avatar src={user.profilePic} name={user.name} size="sm" />
                    <span className="max-w-[10rem] truncate text-sm font-medium lg:max-w-none">{user.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div role="tabpanel" id="posts-panel" aria-labelledby={`tab-${activeTab}`} className="min-w-0">
          {activeTab === "userPosts" && <UserPosts userData={userData} setUserData={setUserData} />}
          {activeTab === "savedPosts" && <SavedPosts userData={userData} setUserData={setUserData} />}
          {activeTab === "allAODS" && <AllAOD />}
        </div>
      </div>
    </SiteLayout>
  );
}

export default Posts;
