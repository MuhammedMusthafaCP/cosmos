/** Uppercase section title used across pages. Use `as="h1"` for the page's main heading. */
export default function SectionHeading({ as: Tag = "h2", children, className = "" }) {
  return (
    <Tag className={`font-poppins text-2xl font-bold uppercase tracking-wide sm:text-3xl ${className}`}>
      {children}
    </Tag>
  );
}
