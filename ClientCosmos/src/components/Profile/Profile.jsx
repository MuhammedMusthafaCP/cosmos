import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { Camera, ImageOff, Loader2, Plus } from "lucide-react";
import { imDB } from "../Firebase/firebase";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import SectionHeading from "../ui/SectionHeading";
import Avatar from "../ui/Avatar";
import ConfirmDialog from "../ui/ConfirmDialog";
import PostForm from "../Forms/PostForm";
import PostEditForm from "../Forms/PostEditForm";
import PostComments from "../Comment/PostComments";
import PostCard from "../Posts/PostCard";
import { EmptyState, ErrorState, PostSkeletonGrid } from "../Posts/PostFeedStates";
import usePostActions from "../Posts/usePostActions";

function Profile() {
  const { valid, userData, setUserData, loading: userLoading } = useUserData();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [commentPostID, setCommentPostID] = useState("");
  const [deletePostId, setDeletePostId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bioText, setBioText] = useState("");
  const [bioSaving, setBioSaving] = useState(false);
  const [picChanging, setPicChanging] = useState(false);

  const { toggleLike, toggleSave } = usePostActions({ userData, setUserData, setPosts: setMyPosts });
  const userId = userData?._id;

  const mypostFetch = useCallback(async () => {
    if (!userId) return;
    setPostsError(false);
    try {
      const response = await axios.get(`${API_URL}/posts/getmyposts/${userId}`);
      setMyPosts(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setPostsError(true);
    } finally {
      setPostsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    mypostFetch();
  }, [mypostFetch]);

  useEffect(() => {
    setBioText(userData?.bio || "");
  }, [userData?.bio]);

  const handleSaveBio = async () => {
    setBioSaving(true);
    try {
      const response = await axios.put(`${API_URL}/users/editBio/${userId}`, { bioText });
      const bio = response.data?.bio ?? bioText;
      setBioText(bio);
      setUserData((prev) => ({ ...prev, bio }));
      setEditMode(false);
      toast.success("Bio updated");
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error("Could not update your bio. Please try again.");
    } finally {
      setBioSaving(false);
    }
  };

  const cancelBioEdit = () => {
    setBioText(userData?.bio || "");
    setEditMode(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setPicChanging(true);
    try {
      const imgS = ref(imDB, `images${v4()}`);
      const uploadData = await uploadBytes(imgS, file);
      const imageUrl = await getDownloadURL(uploadData.ref);
      await axios.patch(`${API_URL}/users/updateProfilePic/${userId}`, { imageUrl });
      setUserData((prev) => ({ ...prev, profilePic: imageUrl }));
      toast.success("Profile picture updated");
    } catch (err) {
      console.log("Error while updating the profile picture", err);
      toast.error("Could not update your profile picture.");
    } finally {
      setPicChanging(false);
    }
  };

  const deleteMyPost = async () => {
    const id = deletePostId;
    setDeletePostId(null);
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      mypostFetch();
    } catch (err) {
      console.log("Error while deleting the Post", err);
      toast.error("Could not delete the post. Please try again.");
    }
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const openComments = (postId) => {
    setCommentPostID(postId);
    setCommentModal(true);
  };

  let posts;
  if (!userData && !userLoading) {
    posts = (
      <EmptyState icon={ImageOff} title="Log in to see your posts">
        <button type="button" onClick={() => navigate("/login")} className="d-btn-primary mt-2">
          Log in
        </button>
      </EmptyState>
    );
  } else if (postsLoading || !userData) {
    posts = <PostSkeletonGrid />;
  } else if (postsError) {
    posts = <ErrorState message="We couldn't load your posts." onRetry={mypostFetch} />;
  } else if (myPosts.length === 0) {
    posts = (
      <EmptyState icon={ImageOff} title="You haven't posted yet">
        Share your first space photo with the community.
      </EmptyState>
    );
  } else {
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
              onEdit={openEditModal}
              onDelete={setDeletePostId}
            />
          ))}
      </div>
    );
  }

  return (
    <SiteLayout valid={valid} userData={userData}>
      <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside aria-label="Profile" className="d-card h-fit p-6 lg:sticky lg:top-24">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {picChanging ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20" role="status" aria-label="Uploading picture">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <Avatar src={userData?.profilePic} name={userData?.name || "Guest"} size="xl" />
              )}
              {userData && (
                <>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={picChanging}
                  />
                  <label
                    htmlFor="file-input"
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-2 text-black shadow transition hover:bg-sky-50 focus-within:ring-2 focus-within:ring-sky-400"
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change profile picture</span>
                  </label>
                </>
              )}
            </div>
            <h1 className="mt-4 break-words font-poppins text-2xl font-bold">{userData?.name || "Guest"}</h1>
          </div>

          {userData && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  My bio
                </label>
                {!editMode && (
                  <button type="button" onClick={() => setEditMode(true)} className="text-sm font-medium text-sky-300 hover:text-sky-200">
                    Edit
                  </button>
                )}
              </div>
              <textarea
                id="bio"
                rows={4}
                disabled={!editMode || bioSaving}
                className="d-input mt-2 resize-none"
                value={bioText}
                placeholder={editMode ? "Tell people about yourself" : "No bio yet"}
                onChange={(e) => setBioText(e.target.value)}
              />
              {editMode && (
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={handleSaveBio} disabled={bioSaving} className="d-btn-primary">
                    {bioSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save
                  </button>
                  <button type="button" onClick={cancelBioEdit} disabled={bioSaving} className="d-btn">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>

        <section aria-labelledby="your-posts-heading" className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <SectionHeading className="!text-2xl">
              <span id="your-posts-heading">Your posts</span>
            </SectionHeading>
            {userData && (
              <button type="button" onClick={() => setModalOpen(true)} className="d-btn">
                <Plus className="h-4 w-4" /> Create post
              </button>
            )}
          </div>
          {posts}
        </section>
      </div>

      <PostComments
        post_id={commentPostID}
        userData={userData}
        commentModal={commentModal}
        toggleCommentModal={() => setCommentModal(false)}
      />
      <ConfirmDialog
        open={deletePostId !== null}
        title="Delete this post?"
        message="This can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={deleteMyPost}
        onCancel={() => setDeletePostId(null)}
      />
      {modalOpen && <PostForm Modal={modalOpen} setModalOpen={setModalOpen} mypostFetch={mypostFetch} />}
      {editModalOpen && (
        <PostEditForm
          EditModal={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          mypostFetch={mypostFetch}
          post={selectedPost}
        />
      )}
    </SiteLayout>
  );
}

export default Profile;
