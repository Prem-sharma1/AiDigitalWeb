import { useEffect } from "react";

export default function useScrollReveal(dependencies = []) {
  useEffect(() => {
    // Check if window and IntersectionObserver are supported (safeguard for SSR)
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px -20px 0px -20px", // Trigger slightly inside viewport
      threshold: 0.05, // Trigger when 5% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target); // Unobserve to play animation once
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => {
        try {
          observer.unobserve(el);
        } catch (e) {
          // Silent catch
        }
      });
    };
  }, dependencies); // Re-run hook when these values change (e.g. data loading finishes)
}
