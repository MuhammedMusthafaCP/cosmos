/** Loading skeletons, empty and error states shared by post lists. */
export function PostSkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="d-card animate-pulse overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="h-8 w-8 rounded-full bg-white/10" />
            <div className="h-4 w-1/3 rounded bg-white/10" />
          </div>
          <div className="aspect-[4/3] bg-white/10" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-white/10" />
            <div className="h-4 w-1/2 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-gray-300">
      {Icon && <Icon className="mb-4 h-10 w-10 text-gray-500" aria-hidden="true" />}
      <h3 className="font-poppins text-xl font-semibold text-white">{title}</h3>
      {children && <div className="mt-2 max-w-md text-sm text-gray-400">{children}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-xl border border-red-900 bg-red-950/40 px-6 py-10 text-center">
      <p className="text-red-200">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="d-btn mt-4">
          Try again
        </button>
      )}
    </div>
  );
}
