import FeaturedWork from "../components/FeaturedWork";
import PortfolioShowcase from "../components/PortfolioShowcase";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata = {
  title: "Portfolio | AI Digital",
  description:
    "Featured AI Digital projects across websites, SEO, campaigns, AI videos, creative content, and reels.",
  alternates: {
    canonical: "/portfolio",
  }
};

export default function PortfolioPage() {
  return (
    <main id="top">
      <SiteHeader active="portfolio" />
      <PortfolioShowcase />
      <FeaturedWork />
      <SiteFooter />
    </main>
  );
}
