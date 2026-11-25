import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../config";
import MediaView, { apodMedia } from "../ui/MediaView";
import { EmptyState, ErrorState, PostSkeletonGrid } from "./PostFeedStates";
import { Telescope } from "lucide-react";

function AodCard({ apod }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="d-card flex flex-col overflow-hidden">
      <div className="p-4">
        <h3 className="font-poppins text-lg font-bold leading-snug">{apod.title}</h3>
      </div>
      <MediaView
        media={apodMedia(apod)}
        alt={apod.title}
        className={apod.media_type === "video" ? "aspect-video w-full" : "aspect-[4/3] w-full object-cover"}
      />
      <div className="flex flex-wrap justify-between gap-x-4 px-4 pt-3 text-xs text-gray-500">
        <p>Credits: {apod.copyright || "NASA"}</p>
        <p>Date: {apod.date}</p>
      </div>
      <div className="p-4 text-sm text-gray-300">
        <p className={expanded ? "" : "line-clamp-4"}>
          <strong>Explanation:</strong> {apod.explanation}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 font-medium text-sky-300 hover:text-sky-200"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      </div>
    </article>
  );
}

function AllAOD() {
  const [AODS, setAODS] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`${API_URL}/news/apods`);
      setAODS(response.data);
    } catch (err) {
      console.log("Error while fetching AOD's", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PostSkeletonGrid count={4} />;
  if (error) return <ErrorState message="We couldn't load the astronomy pictures." onRetry={load} />;
  if (AODS.length === 0)
    return <EmptyState icon={Telescope} title="No pictures available" />;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {AODS.map((apod) => (
        <AodCard key={apod.date} apod={apod} />
      ))}
    </div>
  );
}

export default AllAOD;
