import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageCircle, UserRound } from "lucide-react";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import { formatListTime } from "../utils/chatTime";
import ConfirmDialog from "../ui/ConfirmDialog";
import ChatShell from "./ChatShell";
import ChatSidebar, { ListHeading, ListMessage, ListSkeleton } from "./ChatSidebar";
import ChatListItem from "./ChatListItem";
import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import Composer, { ComposerNotice } from "./Composer";
import EmptyPane from "./EmptyPane";
import useChatSocket from "./useChatSocket";
import useMessages from "./useMessages";
import { fromPersonal } from "./chatMessages";

const PAGE = 40;

/** Direct messages: people you've talked to first, then everyone else on Cosmos. */
function Chats() {
  const { userData: me, valid, loading } = useUserData();
  const navigate = useNavigate();
  const { socket, status, send } = useChatSocket(valid);

  const [people, setPeople] = useState([]);
  const [peopleStatus, setPeopleStatus] = useState("loading");
  const [selected, setSelected] = useState(null);
  const [unread, setUnread] = useState({});
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState("");
  const selectedIdRef = useRef(null);

  useEffect(() => {
    selectedIdRef.current = selected?._id ?? null;
  }, [selected]);

  const loadPeople = useCallback(async () => {
    if (!me?._id) return;
    setPeopleStatus("loading");
    try {
      const response = await axios.get(`${API_URL}/users/friends/${me._id}`);
      setPeople(response.data);
      setPeopleStatus("ready");
    } catch (error) {
      console.error("Error fetching people:", error);
      setPeopleStatus("error");
    }
  }, [me?._id]);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  const fetchPage = useCallback(
    ({ before }) =>
      axios
        .get(`${API_URL}/chat/personalMessages/${selected._id}`, {
          params: { before, limit: PAGE },
          withCredentials: true,
        })
        .then((response) => response.data),
    [selected]
  );

  const history = useMessages({
    conversationKey: selected?._id,
    fetchPage,
    getTime: (message) => message.timestamp,
  });
  const { append } = history;

  // Live messages for every conversation arrive on the user's own room.
  useEffect(() => {
    if (!socket || !me?._id) return undefined;
    const onMessage = (message) => {
      const otherId = String(message.senderId) === me._id ? message.receiverId : message.senderId;
      setPeople((current) => {
        const index = current.findIndex((p) => p._id === otherId);
        if (index === -1) return current;
        const updated = { ...current[index], latestMessage: message };
        return [updated, ...current.filter((_, i) => i !== index)];
      });
      if (selectedIdRef.current === otherId) append(message);
      else if (String(message.senderId) !== me._id) {
        setUnread((counts) => ({ ...counts, [otherId]: (counts[otherId] || 0) + 1 }));
      }
    };
    socket.on("personalMessage", onMessage);
    return () => socket.off("personalMessage", onMessage);
  }, [socket, me?._id, append]);

  const openConversation = (person) => {
    setSelected(person);
    setDraft("");
    setSendError("");
    setUnread((counts) => ({ ...counts, [person._id]: 0 }));
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !selected) return;
    setSendError("");
    const result = await send("personalMessage", { receiverId: selected._id, text });
    if (result.ok) {
      setDraft("");
      append(result.message);
    } else {
      setSendError(result.error);
    }
  };

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase();
    return people.filter((p) => (p.name || "").toLowerCase().includes(term));
  }, [people, search]);
  const recent = matches.filter((p) => p.latestMessage);
  const others = matches.filter((p) => !p.latestMessage);

  const messages = useMemo(
    () => (me && selected ? history.items.map((m) => fromPersonal(m, me, selected)) : []),
    [history.items, me, selected]
  );

  const row = (person) => {
    const latest = person.latestMessage;
    return (
      <ChatListItem
        key={person._id}
        name={person.name}
        avatar={person.profilePic}
        preview={latest ? `${String(latest.senderId) === me._id ? "You: " : ""}${latest.text}` : ""}
        meta={latest ? "" : "Say hello"}
        time={latest ? formatListTime(latest.timestamp) : ""}
        unread={unread[person._id] || 0}
        selected={selected?._id === person._id}
        onClick={() => openConversation(person)}
      />
    );
  };

  let list;
  if (peopleStatus === "loading") list = <ListSkeleton />;
  else if (peopleStatus === "error") {
    list = (
      <ListMessage icon={UserRound} title="Couldn't load your chats">
        <button type="button" onClick={loadPeople} className="d-btn mt-2">
          Try again
        </button>
      </ListMessage>
    );
  } else if (matches.length === 0) {
    list = (
      <ListMessage icon={UserRound} title={search ? "No people match your search" : "No one to chat with yet"}>
        {search ? "Try a different name." : "Other members will show up here."}
      </ListMessage>
    );
  } else {
    list = (
      <>
        {recent.length > 0 && (
          <>
            <ListHeading>Recent</ListHeading>
            <ul className="space-y-0.5">{recent.map(row)}</ul>
          </>
        )}
        {others.length > 0 && (
          <>
            <ListHeading>{recent.length > 0 ? "People" : "Start a conversation"}</ListHeading>
            <ul className="space-y-0.5">{others.map(row)}</ul>
          </>
        )}
      </>
    );
  }

  const offline = status !== "connected";

  return (
    <>
      <ChatShell
        valid={valid}
        userData={me}
        title="Direct messages"
        hasSelection={Boolean(selected)}
        connection={valid ? status : "connected"}
        sidebar={
          <ChatSidebar active="personal" search={search} onSearch={setSearch} searchPlaceholder="Search people">
            {list}
          </ChatSidebar>
        }
      >
        {selected ? (
          <>
            <ConversationHeader
              name={selected.name}
              avatar={selected.profilePic}
              subtitle={selected.bio}
              onBack={() => setSelected(null)}
              onDetails={() => navigate(`/userprofile/${selected._id}`)}
              detailsLabel={`View ${selected.name}'s profile`}
            />
            <MessageList
              messages={messages}
              status={history.status}
              hasMore={history.hasMore}
              loadingEarlier={history.loadingEarlier}
              onLoadEarlier={history.loadEarlier}
              onRetry={history.retry}
              emptyTitle={`No messages with ${selected.name} yet`}
              emptyHint="Say hello and start the conversation."
            />
            {status === "unauthorized" ? (
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
          <EmptyPane icon={MessageCircle} title="Your messages">
            Pick someone from the list to start chatting.
          </EmptyPane>
        )}
      </ChatShell>

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

export default Chats;
