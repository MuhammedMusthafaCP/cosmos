import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { PulseLoader } from "react-spinners";
import { MessageSquarePlus, X } from "lucide-react";
import useUserData from "./utils/UserData";
import { API_URL } from "../config";
import SiteLayout from "./layout/SiteLayout";
import SectionHeading from "./ui/SectionHeading";
import PageHeader from "./ui/PageHeader";
import Avatar from "./ui/Avatar";

const MAX_REVIEWS = 4;

const SECTIONS = [
  {
    title: "Our aim",
    paragraphs: [
      "We are committed to providing high-quality, scientifically accurate, and engaging content. Our articles are meticulously researched and written to ensure that you receive the most up-to-date and reliable information. In addition to written content, we also offer multimedia resources, including stunning images, educational videos, and interactive features that bring the cosmos to life.",
    ],
  },
  {
    title: "What we offer",
    paragraphs: [
      "Our community is at the core of what we do. We encourage our visitors to join in the conversation, share their own astronomical experiences, and learn from one another. Whether you're looking to deepen your knowledge, find answers to your burning questions, or simply enjoy the beauty of the universe, you'll find a welcoming and supportive environment here.",
      "Explore our comprehensive database of astronomical phenomena, stay updated with the latest space missions and discoveries, and immerse yourself in the wonder of the cosmos. Together, let's embark on a journey through the stars, uncovering the secrets of the universe one discovery at a time.",
    ],
  },
];

function About() {
  const [reviews, setReviews] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [reviewUpdation, setReviewUpdation] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { valid, userData } = useUserData();
  const dialogRef = useRef(null);

  const openReviewModal = () => {
    setSubmitError("");
    dialogRef.current?.showModal();
  };
  const closeReviewModal = () => dialogRef.current?.close();

  const onSubmit = async (data) => {
    const comment = (data.review || "").trim();
    if (!comment) {
      setSubmitError("Please write a review first.");
      return;
    }
    setReviewUpdation(true);
    setSubmitError("");
    const review = {
      profilePic: userData?.profilePic,
      name: userData?.name,
      comment,
    };

    try {
      const response = await axios.post(`${API_URL}/review/newreview`, { review });
      if (response.data && response.data._id) {
        closeReviewModal();
        reset();
        setReviews((prev) => {
          const kept = prev.length >= MAX_REVIEWS ? prev.slice(1) : prev;
          return [...kept, response.data];
        });
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error adding review", error);
      setSubmitError("Could not add your review. Please try again.");
    } finally {
      setReviewUpdation(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/review/randomreviews`);
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          console.error("Error: Expected an array from the API");
        }
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchReviews();
    window.scrollTo(0, 0);
  }, []);

  return (
    <SiteLayout valid={valid} userData={userData}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          eyebrow="About COSMOS"
          title="Making the universe accessible to everyone"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-lg leading-8 text-gray-300">
            <p>
              Welcome to our celestial haven, where the wonders of the cosmos converge! Founded by
              Muhammed Musthafa, a passionate enthusiast of the universe&apos;s mysteries, this
              website is a labor of love dedicated to all things astronomical. Whether you&apos;re an
              avid stargazer, a seasoned astronomer, or someone who simply marvels at the night sky,
              our platform offers a wealth of information and resources to fuel your cosmic curiosity.
            </p>
            <p>
              At the heart of our mission is the desire to make the vast and often complex field of
              astronomy accessible to everyone. We believe that the beauty and grandeur of the
              universe should be shared and celebrated, inspiring awe and wonder in people of all ages
              and backgrounds. Our content spans a wide range of topics, from the latest discoveries
              in space science to detailed explorations of celestial objects like black holes,
              galaxies, and star systems.
            </p>
          </div>
          <div className="grid content-start gap-5">
            {SECTIONS.map((section) => (
              <section key={section.title} className="d-card p-6">
                <h2 className="font-poppins text-lg font-semibold text-sky-300">{section.title}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-gray-300">
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </motion.div>

      <section className="mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading>Reviews</SectionHeading>
          <button type="button" onClick={openReviewModal} className="d-btn">
            <MessageSquarePlus className="h-4 w-4" />
            Add review
          </button>
        </div>

        <dialog ref={dialogRef} className="modal" aria-labelledby="review-title">
          <div className="modal-box w-full max-w-md border border-white/10 bg-neutral-950 text-white">
            <div className="mb-4 flex items-center justify-between">
              <h3 id="review-title" className="text-xl font-bold">
                Add your review
              </h3>
              <button
                type="button"
                onClick={closeReviewModal}
                aria-label="Close"
                className="rounded p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="review-input" className="sr-only">
                  Your review
                </label>
                <input
                  id="review-input"
                  {...register("review")}
                  className="d-input"
                  type="text"
                  autoComplete="off"
                  placeholder="Type here..."
                />
                {submitError && (
                  <p role="alert" className="mt-1 text-xs text-red-400">
                    {submitError}
                  </p>
                )}
              </div>
              <button type="submit" disabled={reviewUpdation} className="d-btn-primary w-full">
                {reviewUpdation ? <PulseLoader color="#000000" size={8} /> : "Add review"}
              </button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button aria-label="Close">close</button>
          </form>
        </dialog>

        {reviews.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="d-card flex flex-col p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Avatar src={review.profilePic} name={review.name} size="md" />
                  <p className="min-w-0 truncate font-semibold">{review.name}</p>
                </div>
                <p className="mb-4 break-words text-sm leading-relaxed text-gray-300">{review.comment}</p>
                {review.createdAt && (
                  <p className="mt-auto text-xs text-gray-400">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="d-card mt-8 p-8 text-center text-gray-400">
            No reviews yet. Be the first to add a review!
          </p>
        )}
      </section>
    </SiteLayout>
  );
}

export default About;
