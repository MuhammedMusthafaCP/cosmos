import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import POSTER from "../Assets/LOGINBG4.jpg";

function Landingpage() {
  const navigate = useNavigate();

  return (
    <motion.div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4">
      {/* Background video lives in public/videos (see public/videos/README.md).
          If the file is missing or still loading, the poster image is shown instead. */}
      <video
        src="/videos/cosmos-bg.mp4"
        poster={POSTER}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="font-poppins text-5xl font-bold tracking-wide text-gray-100 sm:text-7xl md:text-8xl lg:text-9xl">
          THE COSMOS
        </h1>
        <p className="mt-4 max-w-md text-base font-light text-gray-200 sm:text-lg">
          News, discoveries and a community of people who love the universe.
        </p>
        <button
          type="button"
          onClick={() => navigate("/HomePage")}
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/10 px-8 py-3 font-poppins text-lg tracking-wider text-white backdrop-blur-sm transition hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-xl"
        >
          Let&apos;s Explore
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default Landingpage;
