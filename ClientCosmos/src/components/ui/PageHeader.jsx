/** Page title block: eyebrow, title, optional description, and an actions slot on the right. */
export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-widest text-sky-300">{eyebrow}</p>
        )}
        <h1 className="mt-1 font-poppins text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-gray-400">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </header>
  );
}
