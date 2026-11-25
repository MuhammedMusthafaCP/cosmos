import SiteHeader from "./SiteHeader";
import Footer from "./Footer";

/**
 * Standard page frame: sticky header, constrained content column, footer.
 * Pass `valid`/`userData` from useUserData() so the header can show the account menu.
 * `tone` sets the page surface ("dark" or "light"); `footer={false}` hides the footer.
 */
export default function SiteLayout({
  children,
  valid,
  userData,
  tone = "dark",
  footer = true,
  className = "",
}) {
  const surface = tone === "light" ? "bg-gray-50 text-gray-900" : "bg-black text-white";
  return (
    <div className={`flex min-h-screen flex-col ${surface}`}>
      <SiteHeader valid={valid} userData={userData} />
      <main className={`mx-auto w-full max-w-[90rem] flex-1 px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </main>
      {footer && <Footer />}
    </div>
  );
}
