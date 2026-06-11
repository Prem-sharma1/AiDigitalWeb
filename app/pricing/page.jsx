import Script from "next/script";
import PricingClientPage from "./PricingClientPage";

export const metadata = {
  title: "Pricing Plans | AI Digital",
  description:
    "Explore our premium, AI-powered digital marketing pricing plans for Ads, Website Design, Creative Packs, and AI Video Solutions.",
  openGraph: {
    title: "Pricing Plans | AI Digital",
    description:
      "Explore our premium, AI-powered digital marketing pricing plans for Ads, Website Design, Creative Packs, and AI Video Solutions.",
    type: "website",
  }
};

export default function PricingPage() {
  return (
    <>
      <PricingClientPage />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </>
  );
}
