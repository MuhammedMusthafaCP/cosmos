/** Placeholder shown on desktop when no conversation is selected. */
export default function EmptyPane({ icon: Icon, title, children }) {
  return (
    <div className="m-auto flex max-w-sm flex-col items-center gap-3 p-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5 text-sky-300">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="font-poppins text-xl font-semibold text-white">{title}</h2>
      {children && <p className="text-sm text-gray-400">{children}</p>}
    </div>
  );
}
