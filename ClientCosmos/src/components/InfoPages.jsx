import { Mail } from "lucide-react";
import SiteLayout from "./layout/SiteLayout";
import SectionHeading from "./ui/SectionHeading";
import useUserData from "./utils/UserData";

function InfoPage({ title, updated, children }) {
  const { valid, userData } = useUserData();
  return (
    <SiteLayout valid={valid} userData={userData}>
      <article className="mx-auto max-w-3xl">
        <SectionHeading as="h1">{title}</SectionHeading>
        {updated && <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>}
        <div className="mt-8 space-y-6 leading-relaxed text-gray-300 [&_h2]:mb-2 [&_h2]:font-poppins [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_a]:text-sky-300 [&_a]:underline">
          {children}
        </div>
      </article>
    </SiteLayout>
  );
}

export function Contact() {
  return (
    <InfoPage title="Contact us">
      <p>Questions, feedback or a bug to report? We read every message.</p>
      <a
        href="mailto:musthafacp0007@gmail.com"
        className="!no-underline inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 !text-white transition hover:border-white/30"
      >
        <Mail className="h-5 w-5 text-sky-400" />
        <span>
          <span className="block text-sm text-gray-400">Email</span>
          musthafacp0007@gmail.com
        </span>
      </a>
      <p>We usually reply within two working days.</p>
    </InfoPage>
  );
}

export function Privacy() {
  return (
    <InfoPage title="Privacy policy" updated="November 2026">
      <p>This page explains what COSMOS collects and why. It is a general template, so have it reviewed before launching publicly.</p>
      <section>
        <h2>What we collect</h2>
        <p>Your name, email address and profile picture when you sign up (including through Google), plus the posts, comments and messages you create.</p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>To run your account, show your content to other members, and keep the service secure. We do not sell your personal data.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>We use cookies to keep you signed in. Without them, login will not work.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>You can edit or delete your posts at any time. To delete your account and data, <a href="/contact">contact us</a>.</p>
      </section>
    </InfoPage>
  );
}

export function Terms() {
  return (
    <InfoPage title="Terms of service" updated="November 2026">
      <p>By using COSMOS you agree to these terms. This is a general template, so have it reviewed before launching publicly.</p>
      <section>
        <h2>Your account</h2>
        <p>Keep your login details safe. You are responsible for activity under your account.</p>
      </section>
      <section>
        <h2>Your content</h2>
        <p>You keep ownership of what you post, and you give COSMOS permission to display it on the service. Only post images and text you have the right to share.</p>
      </section>
      <section>
        <h2>Community conduct</h2>
        <p>Be respectful. Harassment, spam and unlawful content may be removed and accounts suspended.</p>
      </section>
      <section>
        <h2>NASA content</h2>
        <p>News and imagery come from NASA and other public sources, and remain the property of their owners.</p>
      </section>
    </InfoPage>
  );
}
