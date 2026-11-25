import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-black text-white" role="status">
      <Loader2 className="h-10 w-10 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Loading;
