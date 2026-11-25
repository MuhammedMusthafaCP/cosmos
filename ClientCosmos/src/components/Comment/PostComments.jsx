import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Loader2, MessageCircle, Send } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../config";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";

function PostComments({ post_id, userData, commentModal, toggleCommentModal }) {
  const [yourComment, setYourComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!post_id) return;
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`${API_URL}/posts/getAllComments/${post_id}`);
      setComments(response.data);
    } catch (err) {
      console.log("Error while fetching comments", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [post_id]);

  useEffect(() => {
    setComments([]);
    fetchComments();
  }, [fetchComments]);

  const addComment = async (e) => {
    e?.preventDefault();
    const text = yourComment.trim();
    if (!text || sending) return;
    const newComment = {
      postid: post_id,
      comment: text,
      name: userData?.name,
      profilepic: userData?.profilePic,
    };
    setSending(true);
    try {
      await axios.post(`${API_URL}/posts/addcomment`, newComment);
      setComments((prev) => [...prev, newComment]);
      setYourComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Error adding comment. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const composer = userData ? (
    <form onSubmit={addComment} className="flex gap-2">
      <label htmlFor="comment-input" className="sr-only">
        Your comment
      </label>
      <input
        id="comment-input"
        type="text"
        className="d-input"
        placeholder="Share your thoughts"
        value={yourComment}
        onChange={(e) => setYourComment(e.target.value)}
      />
      <button type="submit" disabled={!yourComment.trim() || sending} className="d-btn-primary shrink-0">
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  ) : (
    <p className="text-center text-sm text-gray-400">Log in to join the conversation.</p>
  );

  return (
    <>
      <ToastContainer position="top-center" />
      <Modal open={Boolean(commentModal)} onClose={toggleCommentModal} title="Comments" footer={composer}>
        {loading ? (
          <p className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400" role="status">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading comments...
          </p>
        ) : error ? (
          <div role="alert" className="py-10 text-center text-sm text-red-400">
            Could not load comments.{" "}
            <button type="button" onClick={fetchComments} className="font-medium underline">
              Retry
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center text-gray-500">
            <MessageCircle className="mb-2 h-8 w-8" aria-hidden="true" />
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {comments
              .slice()
              .reverse()
              .map((comment, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={comment.profilepic} name={comment.name} size="sm" />
                    <h3 className="text-sm font-semibold">{comment.name}</h3>
                  </div>
                  <p className="mt-2 break-words text-sm text-gray-300">{comment.comment}</p>
                </li>
              ))}
          </ul>
        )}
      </Modal>
    </>
  );
}

export default PostComments;
