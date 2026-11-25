import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { PulseLoader } from "react-spinners";
import { Compass, Plus, Users } from "lucide-react";
import useUserData from "../utils/UserData";
import { imDB } from "../Firebase/firebase";
import { API_URL } from "../../config";
import { formatListTime } from "../utils/chatTime";
import Avatar from "../ui/Avatar";
import ConfirmDialog from "../ui/ConfirmDialog";
import ImagePicker from "../ui/ImagePicker";
import ChatShell from "./ChatShell";
import ChatSidebar, { ListMessage, ListSkeleton } from "./ChatSidebar";
import ChatListItem from "./ChatListItem";
import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import Composer, { ComposerNotice } from "./Composer";
import EmptyPane from "./EmptyPane";
import Sheet from "./Sheet";
import useChatSocket from "./useChatSocket";
import useMessages from "./useMessages";
import { fromCommunity } from "./chatMessages";

const PAGE = 40;
const auth = { withCredentials: true };

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

function CommunityChats() {
  const { userData: me, valid, loading } = useUserData();
  const navigate = useNavigate();
  const { socket, status, send } = useChatSocket(valid);

  const [tab, setTab] = useState("joined"); // "joined" | "discover"
  const [lists, setLists] = useState({ joined: [], discover: [] });
  const [listStatus, setListStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [unread, setUnread] = useState({});
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState("");
  const [notice, setNotice] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // "delete" | "exit" | null
  const [actionError, setActionError] = useState("");
  const [joining, setJoining] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [picture, setPicture] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const selectedIdRef = useRef(null);
  const firstLoad = useRef(true);
  useEffect(() => {
    selectedIdRef.current = selected?._id ?? null;
  }, [selected]);

  const loadLists = useCallback(async () => {
    if (!me?._id) return;
    try {
      const [joined, discover] = await Promise.all([
        axios.get(`${API_URL}/community/mycommunities/${me._id}`, auth),
        axios.get(`${API_URL}/community/getAll/${me._id}`, auth),
      ]);
      setLists({ joined: joined.data, discover: discover.data });
      setListStatus("ready");
      // First visit: land on Discover if you haven't joined anything yet.
      if (firstLoad.current && joined.data.length === 0) setTab("discover");
      firstLoad.current = false;
    } catch (error) {
      console.error("Error fetching communities:", error);
      setListStatus("error");
    }
  }, [me?._id]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const fetchPage = useCallback(
    ({ before }) =>
      axios
        .get(`${API_URL}/chat/${selected._id}`, { params: { before, limit: PAGE }, ...auth })
        .then((response) => response.data),
    [selected]
  );

  const history = useMessages({
    conversationKey: selected?._id,
    fetchPage,
    getTime: (message) => message.date,
  });
  const { append } = history;

  // Live: messages for every community you belong to, and deletions.
  useEffect(() => {
    if (!socket || !me?._id) return undefined;

    const onMessage = (message) => {
      const id = String(message.communityId);
      const lastMessage = { name: message.name, message: message.message, date: message.date };
      setLists((current) => {
        const index = current.joined.findIndex((c) => c._id === id);
        if (index === -1) return current;
        const updated = { ...current.joined[index], lastMessage };
        return { ...current, joined: [updated, ...current.joined.filter((_, i) => i !== index)] };
      });
      if (selectedIdRef.current === id) append(message);
      else if (String(message.senderId) !== me._id) setUnread((counts) => ({ ...counts, [id]: (counts[id] || 0) + 1 }));
    };

    const onDeleted = ({ communityId }) => {
      setLists((current) => ({
        joined: current.joined.filter((c) => c._id !== communityId),
        discover: current.discover.filter((c) => c._id !== communityId),
      }));
      if (selectedIdRef.current === communityId) {
        setSelected(null);
        setDetailsOpen(false);
        setNotice("That community was deleted by its creator.");
      }
    };

    socket.on("communityMessage", onMessage);
    socket.on("communityDeleted", onDeleted);
    return () => {
      socket.off("communityMessage", onMessage);
      socket.off("communityDeleted", onDeleted);
    };
  }, [socket, me?._id, append]);

  // Details drawer: description, member count, first page of members.
  useEffect(() => {
    if (!detailsOpen || !selected) return undefined;
    let cancelled = false;
    setDetails(null);
    axios
      .get(`${API_URL}/community/details/${selected._id}`, auth)
      .then((response) => !cancelled && setDetails(response.data))
      .catch((error) => console.error("Error fetching community details:", error));
    return () => {
      cancelled = true;
    };
  }, [detailsOpen, selected]);

  const loadMoreMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await axios.get(`${API_URL}/community/details/${selected._id}`, {
        params: { page: details.page + 1 },
        ...auth,
      });
      setDetails((current) => ({
        ...response.data,
        members: [...current.members, ...response.data.members],
      }));
    } catch (error) {
      console.error("Error fetching more members:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const openCommunity = (community) => {
    setSelected(community);
    setDraft("");
    setSendError("");
    setNotice("");
    setUnread((counts) => ({ ...counts, [community._id]: 0 }));
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !selected) return;
    setSendError("");
    const result = await send("communityMessage", { communityId: selected._id, text });
    if (result.ok) {
      setDraft("");
      append(result.message);
    } else {
      setSendError(result.error);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    setSendError("");
    try {
      await axios.post(`${API_URL}/community/join`, { communityid: selected._id }, auth);
      setSelected((current) => ({ ...current, isMember: true, memberCount: current.memberCount + 1 }));
      await loadLists();
    } catch (error) {
      console.error("Error while joining", error);
      setSendError("Couldn't join this community. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateError("");
  };

  const onCreate = async (values) => {
    setCreateError("");
    setCreating(true);
    try {
      let communityprofile;
      if (picture) {
        const upload = await uploadBytes(ref(imDB, `images${v4()}`), picture);
        communityprofile = await getDownloadURL(upload.ref);
      }
      const response = await axios.post(
        `${API_URL}/community/create`,
        { name: values.name, description: values.description, communityprofile },
        auth
      );
      reset();
      setPicture(null);
      closeCreate();
      setTab("joined");
      setSearch("");
      await loadLists();
      openCommunity(response.data.community);
    } catch (error) {
      console.error("Error creating community:", error);
      setCreateError(error.response?.data?.error || "Could not create the community. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const leaveOrDelete = async () => {
    setActionError("");
    try {
      if (confirmAction === "delete") {
        await axios.delete(`${API_URL}/community/delete/${selected._id}`, auth);
      } else {
        await axios.post(`${API_URL}/community/exit`, { communityId: selected._id }, auth);
      }
      setConfirmAction(null);
      setDetailsOpen(false);
      setSelected(null);
      await loadLists();
    } catch (error) {
      setConfirmAction(null);
      setActionError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return lists[tab].filter(
      (c) => (c.name || "").toLowerCase().includes(term) || (c.description || "").toLowerCase().includes(term)
    );
  }, [lists, tab, search]);

  const messages = useMemo(
    () => (me ? history.items.map((m) => fromCommunity(m, me)) : []),
    [history.items, me]
  );

  const isCreator = selected && String(selected.creator) === me?._id;
  const offline = status !== "connected";

  const subFilter = (
    <div role="tablist" aria-label="Community filter" className="grid grid-cols-2 gap-1">
      {[
        ["joined", "Joined", lists.joined.length],
        ["discover", "Discover", lists.discover.length],
      ].map(([key, label, count]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={tab === key}
          onClick={() => setTab(key)}
          className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            tab === key
              ? "border-sky-400 bg-sky-400/15 text-sky-200"
              : "border-white/15 text-gray-300 hover:bg-white/10"
          }`}
        >
          {label} <span className="text-xs opacity-70">{count}</span>
        </button>
      ))}
    </div>
  );

  let list;
  if (listStatus === "loading") list = <ListSkeleton />;
  else if (listStatus === "error") {
    list = (
      <ListMessage icon={Users} title="Couldn't load communities">
        <button type="button" onClick={loadLists} className="d-btn mt-2">
          Try again
        </button>
      </ListMessage>
    );
  } else if (visible.length === 0) {
    list =
      search || tab === "discover" ? (
        <ListMessage icon={Compass} title={search ? "No communities match your search" : "You've joined them all"}>
          {search ? "Try a different word." : "Create a new community for something you love."}
        </ListMessage>
      ) : (
        <ListMessage icon={Users} title="You haven't joined any communities">
          <button type="button" onClick={() => setTab("discover")} className="d-btn mt-2">
            Discover communities
          </button>
        </ListMessage>
      );
  } else {
    list = (
      <ul className="space-y-0.5">
        {visible.map((community) => {
          const last = community.lastMessage;
          const mine = last && last.name === me?.name;
          return (
            <ChatListItem
              key={community._id}
              name={community.name}
              avatar={community.communityprofile}
              preview={last ? `${mine ? "You" : last.name}: ${last.message}` : community.description}
              meta={plural(community.memberCount, "member")}
              time={last ? formatListTime(last.date) : ""}
              unread={unread[community._id] || 0}
              selected={selected?._id === community._id}
              onClick={() => openCommunity(community)}
            />
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <ChatShell
        valid={valid}
        userData={me}
        title="Community chats"
        hasSelection={Boolean(selected)}
        connection={valid ? status : "connected"}
        sidebar={
          <ChatSidebar
            active="community"
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search communities"
            subFilter={subFilter}
            action={
              <button type="button" onClick={() => setCreateOpen(true)} className="d-btn-primary w-full">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create community
              </button>
            }
          >
            {notice && (
              <p role="status" className="mb-2 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
                {notice}
              </p>
            )}
            {list}
          </ChatSidebar>
        }
      >
        {selected ? (
          <>
            <ConversationHeader
              name={selected.name}
              avatar={selected.communityprofile}
              subtitle={`${plural(selected.memberCount, "member")} · ${selected.description}`}
              onBack={() => setSelected(null)}
              onDetails={() => setDetailsOpen(true)}
              detailsLabel="Community details"
            />
            <MessageList
              messages={messages}
              status={history.status}
              hasMore={history.hasMore}
              loadingEarlier={history.loadingEarlier}
              onLoadEarlier={history.loadEarlier}
              onRetry={history.retry}
              showNames
              emptyTitle="No messages yet"
              emptyHint={selected.isMember ? "Be the first to say something." : "Join to start the conversation."}
            />
            {!selected.isMember ? (
              <ComposerNotice>
                {sendError && (
                  <p role="alert" className="mb-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300">
                    {sendError}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-gray-400">You&apos;re previewing this community.</p>
                  <button type="button" onClick={handleJoin} disabled={joining} className="d-btn-primary">
                    {joining ? "Joining…" : "Join community"}
                  </button>
                </div>
              </ComposerNotice>
            ) : status === "unauthorized" ? (
              <ComposerNotice>
                <button type="button" onClick={() => navigate("/login")} className="d-btn-primary w-full">
                  Log in again to send messages
                </button>
              </ComposerNotice>
            ) : (
              <Composer
                value={draft}
                onChange={setDraft}
                onSend={handleSend}
                disabled={offline}
                placeholder={offline ? "Reconnecting…" : `Message ${selected.name}`}
                error={sendError}
              />
            )}
          </>
        ) : (
          <EmptyPane icon={Users} title="Community chats">
            Join a community to talk with people who share your interests, or create your own.
          </EmptyPane>
        )}
      </ChatShell>

      {/* Community details drawer */}
      <Sheet open={detailsOpen} side title={selected?.name || "Community"} onClose={() => setDetailsOpen(false)}>
        {details ? (
          <div>
            <div className="flex flex-col items-center text-center">
              <Avatar src={details.communityprofile} name={details.name} size="xl" />
              <p className="mt-3 text-sm text-gray-400">{plural(details.memberCount, "member")}</p>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm text-gray-300">{details.description}</p>

            <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-gray-500">Members</h3>
            <ul className="space-y-1">
              {details.members.map((member) => (
                <li key={member._id}>
                  <button
                    type="button"
                    onClick={() => navigate(member._id === me?._id ? "/profile" : `/userprofile/${member._id}`)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-2 text-left transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <Avatar src={member.profilePic} name={member.name} size="md" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{member.name}</span>
                    {String(member._id) === String(details.creator) && (
                      <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-sky-300">
                        Creator
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {details.hasMoreMembers && (
              <button type="button" onClick={loadMoreMembers} disabled={loadingMembers} className="d-btn mt-3 w-full">
                {loadingMembers ? "Loading…" : "Show more members"}
              </button>
            )}

            {selected?.isMember && (
              <div className="mt-8 border-t border-white/10 pt-5">
                {actionError && (
                  <p role="alert" className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {actionError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmAction(isCreator ? "delete" : "exit")}
                  className="d-btn-danger w-full"
                >
                  {isCreator ? "Delete community" : "Leave community"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Loading details…</p>
        )}
      </Sheet>

      {/* Create community */}
      <Sheet open={createOpen} title="Create a community" onClose={closeCreate}>
        <form onSubmit={handleSubmit(onCreate)} noValidate className="space-y-4">
          <div>
            <label htmlFor="community-name" className="mb-1 block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="community-name"
              type="text"
              maxLength={60}
              className="d-input"
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name", {
                validate: (v) => (v.trim().length >= 2 ? true : "Give it a name of at least 2 characters"),
              })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="community-desc" className="mb-1 block text-sm font-medium text-gray-300">
              What is it about?
            </label>
            <textarea
              id="community-desc"
              rows={3}
              maxLength={300}
              className="d-input resize-none"
              aria-invalid={errors.description ? "true" : "false"}
              {...register("description", {
                validate: (v) => (v.trim() ? true : "Tell people what this community is about"),
              })}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>
          <ImagePicker file={picture} onChange={setPicture} label="Picture (optional)" />
          {createError && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {createError}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeCreate} className="d-btn">
              Cancel
            </button>
            <button type="submit" disabled={creating} className="d-btn-primary min-w-[6rem]">
              {creating ? <PulseLoader color="#000000" size={8} /> : "Create"}
            </button>
          </div>
        </form>
      </Sheet>

      <ConfirmDialog
        open={confirmAction !== null}
        danger
        title={confirmAction === "delete" ? "Delete this community?" : "Leave this community?"}
        message={
          confirmAction === "delete"
            ? "This permanently removes the community and its messages for all members."
            : "You will no longer receive messages from this community."
        }
        confirmLabel={confirmAction === "delete" ? "Delete" : "Leave"}
        onConfirm={leaveOrDelete}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={!loading && !valid}
        title="Please log in to continue"
        message="You need to be signed in to use chats."
        confirmLabel="Login"
        cancelLabel="Cancel"
        onConfirm={() => navigate("/login")}
        onCancel={() => navigate("/HomePage")}
      />
    </>
  );
}

export default CommunityChats;
