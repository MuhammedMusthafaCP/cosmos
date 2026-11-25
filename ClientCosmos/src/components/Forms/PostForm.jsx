import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ImagePlus, Loader2, X } from "lucide-react";
import { imDB } from "../Firebase/firebase";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import Modal from "../ui/Modal";
import { TOPIC_OPTIONS } from "./topics";

const MAX_BYTES = 50 * 1024 ** 2;

function PostForm({ Modal: isOpen, setModalOpen, mypostFetch }) {
  const { userData } = useUserData();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const close = () => {
    if (!submitting) setModalOpen?.(false);
  };

  const onFileChange = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      setFile(null);
      setFileError("Please choose an image file.");
    } else if (picked.size > MAX_BYTES) {
      setFile(null);
      setFileError("Image must be 50 MB or smaller.");
    } else {
      setFile(picked);
      setFileError("");
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      setFileError("Please choose an image to upload.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const imgS = ref(imDB, `images${v4()}`);
      const uploadData = await uploadBytes(imgS, file);
      const imageUrl = await getDownloadURL(uploadData.ref);

      await axios.post(
        `${API_URL}/posts/newpost`,
        { ...data, image: imageUrl },
        {
          headers: {
            "X-Profile": JSON.stringify(userData),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setModalOpen?.(false);
      mypostFetch?.();
    } catch (error) {
      console.log(error);
      setSubmitError("Something went wrong while creating your post. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Modal open={Boolean(isOpen)} onClose={close} title="Create a post">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="caption" className="mb-1 block text-sm font-medium text-gray-300">
            Caption
          </label>
          <input
            type="text"
            id="caption"
            className="d-input"
            aria-invalid={Boolean(errors.caption)}
            aria-describedby={errors.caption ? "caption-error" : undefined}
            {...register("caption", { required: "Caption is required", validate: (v) => v.trim() !== "" || "Caption is required" })}
          />
          {errors.caption && (
            <p id="caption-error" role="alert" className="mt-1 text-xs text-red-400">
              {errors.caption.message}
            </p>
          )}
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-300">Image</span>
          {preview ? (
            <div className="relative overflow-hidden rounded-lg border border-white/10">
              <img src={preview} alt="Selected upload preview" className="max-h-56 w-full object-cover" />
              <button
                type="button"
                onClick={() => setFile(null)}
                aria-label="Remove selected image"
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="post-image"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/20 px-4 py-8 text-center text-sm text-gray-300 transition hover:border-sky-400/60 hover:bg-white/5 focus-within:ring-2 focus-within:ring-sky-400"
            >
              <ImagePlus className="h-8 w-8" aria-hidden="true" />
              <span className="font-medium">Choose an image</span>
              <span className="text-xs text-gray-500">One image, up to 50 MB</span>
            </label>
          )}
          <input id="post-image" type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
          {fileError && (
            <p role="alert" className="mt-1 text-xs text-red-400">
              {fileError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="topic" className="mb-1 block text-sm font-medium text-gray-300">
            Topic
          </label>
          <select id="topic" className="d-input" {...register("topic")}>
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
          {submitting ? "Posting..." : "Create post"}
        </button>
      </form>
    </Modal>
  );
}

export default PostForm;
