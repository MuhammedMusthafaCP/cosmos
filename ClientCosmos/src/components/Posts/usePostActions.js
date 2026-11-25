import { useCallback } from "react";
import axios from "axios";
import { API_URL } from "../../config";

/**
 * Shared like/save handlers for post lists.
 * Calls the same endpoints as before and only updates local state after the API succeeds.
 */
export default function usePostActions({ userData, setUserData, setPosts }) {
  const toggleLike = useCallback(
    async (post) => {
      if (!userData?._id) return;
      const userId = userData._id;
      const action = post.likes.includes(userId) ? "unliked" : "liked";
      try {
        await axios.post(`${API_URL}/posts/like/${post._id}`, { userId, action });
        setPosts((prev) =>
          prev.map((p) =>
            p._id !== post._id
              ? p
              : {
                  ...p,
                  likes:
                    action === "liked"
                      ? [...p.likes.filter((id) => id !== userId), userId]
                      : p.likes.filter((id) => id !== userId),
                }
          )
        );
      } catch (error) {
        console.error("Error updating post:", error.response?.data || error.message);
      }
    },
    [userData, setPosts]
  );

  const toggleSave = useCallback(
    async (post) => {
      if (!userData?._id || !setUserData) return;
      const userId = userData._id;
      const saved = userData.saved_posts || [];
      const action = saved.includes(post._id) ? "unsaved" : "saved";
      try {
        await axios.post(`${API_URL}/users/saveThePost/${userId}`, { postId: post._id, action });
        setUserData({
          ...userData,
          saved_posts: action === "saved" ? [...saved, post._id] : saved.filter((id) => id !== post._id),
        });
      } catch (error) {
        console.error("Error saving post:", error.response?.data || error.message);
      }
    },
    [userData, setUserData]
  );

  return { toggleLike, toggleSave };
}
