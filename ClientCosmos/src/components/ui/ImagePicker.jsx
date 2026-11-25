import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Click-or-drop image chooser with a live preview. Validates type and size before calling
 * `onChange(file | null)`.
 */
export default function ImagePicker({ file, onChange, label = "Picture" }) {
  const id = useId();
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = (picked) => {
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return setError("Please choose an image file.");
    if (picked.size > MAX_BYTES) return setError("The image must be smaller than 5 MB.");
    setError("");
    onChange(picked);
  };

  const clear = () => {
    setError("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-gray-300">{label}</span>
      {file && preview ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
          <img src={preview} alt="Selected" className="h-16 w-16 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button type="button" onClick={clear} aria-label="Remove picture" className="d-btn h-9 w-9 shrink-0 !p-0">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition focus-within:ring-2 focus-within:ring-sky-400 ${
            dragging ? "border-sky-400 bg-sky-400/10" : "border-white/20 bg-white/5 hover:bg-white/10"
          }`}
        >
          <ImagePlus className="h-6 w-6 text-gray-400" aria-hidden="true" />
          <span className="text-sm text-gray-300">
            <span className="font-medium text-sky-300">Choose an image</span> or drop it here
          </span>
          <span className="text-xs text-gray-500">PNG, JPG or WebP, up to 5 MB</span>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </label>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
