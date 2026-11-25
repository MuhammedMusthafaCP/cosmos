import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import Modal from "../ui/Modal";
import { TOPIC_OPTIONS } from "./topics";

function PostEditForm({ EditModal, setEditModalOpen, mypostFetch, post }) {
  const { user } = useUserData();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues: { caption: post?.caption ?? "", topic: post?.topic ?? "home" } });

  useEffect(() => {
    if (post) {
      setValue("caption", post.caption);
      setValue("topic", post.topic);
    }
  }, [post, setValue]);

  const close = () => {
    if (!submitting) setEditModalOpen?.(false);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await axios.put(`${API_URL}/posts/${post._id}`, data, {
        headers: {
          "X-Profile": JSON.stringify(user),
          "Content-Type": "application/json",
        },
      });
      toast.success("Post updated successfully");
      setEditModalOpen?.(false);
      mypostFetch?.();
    } catch (error) {
      console.log(error);
      setSubmitError("Could not update the post. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Modal open={Boolean(EditModal)} onClose={close} title="Update your post">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="edit-caption" className="mb-1 block text-sm font-medium text-gray-300">
            Caption
          </label>
          <input
            type="text"
            id="edit-caption"
            className="d-input"
            aria-invalid={Boolean(errors.caption)}
            aria-describedby={errors.caption ? "edit-caption-error" : undefined}
            {...register("caption", { required: "Caption is required", validate: (v) => v.trim() !== "" || "Caption is required" })}
          />
          {errors.caption && (
            <p id="edit-caption-error" role="alert" className="mt-1 text-xs text-red-400">
              {errors.caption.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-topic" className="mb-1 block text-sm font-medium text-gray-300">
            Topic
          </label>
          <select id="edit-topic" className="d-input" {...register("topic")}>
            {TOPIC_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-red-400">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="d-btn-primary w-full !py-3">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Saving..." : "Update post"}
        </button>
      </form>
    </Modal>
  );
}

export default PostEditForm;
