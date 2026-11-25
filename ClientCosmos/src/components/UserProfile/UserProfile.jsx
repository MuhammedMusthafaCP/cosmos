import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff } from "lucide-react";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import SectionHeading from "../ui/SectionHeading";
import Avatar from "../ui/Avatar";
import PostComments from "../Comment/PostComments";
import PostCard from "../Posts/PostCard";
import { EmptyState, ErrorState, PostSkeletonGrid } from "../Posts/PostFeedStates";
import usePostActions from "../Posts/usePostActions";

function UserProfile() {
  const { valid, userData, setUserData } = useUserData();
  const { id } = useParams();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userprofile, setUserprofile] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [commentPostID, setCommentPostID] = useState("");
  const { toggleLike, toggleSave } = usePostActions({ userData, setUserData, setPosts: setMyPosts });

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const [profile, posts] = await Promise.all([
        axios.get(`${API_URL}/users/getAsingleUser/${id}`),
        axios.get(`${API_URL}/posts/getmyposts/${id}`),
      ]);
      setUserprofile(profile.data);
      setMyPosts(posts.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const openComments = (postId) => {
    setCommentPostID(postId);
    setCommentModal(true);
  };

  let posts;
  if (loading) posts = <PostSkeletonGrid />;
  else if (error) posts = <ErrorState message="We couldn't load this profile." onRetry={load} />;
  else if (myPosts.length === 0)
    posts = (
      <EmptyState icon={ImageOff} title="No posts yet">
        {userprofile?.name || "This user"} hasn&apos;t posted anything yet.
      </EmptyState>
    );
  else
    posts = (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {myPosts
          .slice()
          .reverse()
          .map((post) => (
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
    <SiteLayout valid={valid} userData={userData}>
      <button type="button" onClick={() => navigate(-1)} className="d-btn mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside aria-label="Profile" className="d-card h-fit p-6 text-center lg:sticky lg:top-24">
          <div className="flex justify-center">
            <Avatar src={userprofile?.profilePic} name={userprofile?.name} size="xl" />
          </div>
          <h1 className="mt-4 break-words font-poppins text-2xl font-bold">{userprofile?.name}</h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-gray-500">
              {myPosts.length} {myPosts.length === 1 ? "post" : "posts"}
            </p>
          )}
          {userprofile?.bio && <p className="mt-3 break-words text-sm leading-relaxed text-gray-400">{userprofile.bio}</p>}
        </aside>

        <section aria-labelledby="posts-heading" className="min-w-0">
          <SectionHeading className="mb-6 !text-2xl">
            <span id="posts-heading">Posts</span>
          </SectionHeading>
          {posts}
        </section>
      </div>

      <PostComments
        post_id={commentPostID}
        userData={userData}
        commentModal={commentModal}
        toggleCommentModal={() => setCommentModal(false)}
      />
    </SiteLayout>
  );
}

export default UserProfile;
