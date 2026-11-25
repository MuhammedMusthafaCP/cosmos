import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { API_URL } from "../../config";
import PostComments from "../Comment/PostComments";
import PostCard from "./PostCard";
import { EmptyState, ErrorState, PostSkeletonGrid } from "./PostFeedStates";
import usePostActions from "./usePostActions";

function SavedPosts({ userData, setUserData }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [commentPostID, setCommentPostID] = useState("");
  const { toggleLike, toggleSave } = usePostActions({ userData, setUserData, setPosts });
  const userId = userData?._id;

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`${API_URL}/posts/getmysavedPosts/${userId}`);
      setPosts(response.data);
    } catch (err) {
      console.error("Error in saved posts", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const openComments = (postId) => {
    setCommentPostID(postId);
    setCommentModal(true);
  };

  let content;
  if (loading) content = <PostSkeletonGrid />;
  else if (error) content = <ErrorState message="We couldn't load your saved posts." onRetry={load} />;
  else if (posts.length === 0)
    content = (
      <EmptyState icon={Bookmark} title={userData ? "No saved posts yet" : "Log in to see saved posts"}>
        {userData ? "Tap the bookmark on any post to keep it here." : "Your saved posts will appear here once you sign in."}
      </EmptyState>
    );
  else
    content = (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            userData={userData}
            onLike={toggleLike}
            onSave={toggleSave}
            onComment={openComments}
          />
        ))}
      </div>
    );

  return (
    <>
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

export default SavedPosts;
