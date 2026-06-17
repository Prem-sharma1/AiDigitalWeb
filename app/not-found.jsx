import React from "react";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";

export default function NotFound() {
  return (
    <main>
      <SiteHeader active="" />
      <section className="section" style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: "72px", color: "var(--orange)", fontFamily: "var(--font-headline)" }}>404</h1>
          <h2 style={{ fontSize: "24px", marginTop: "10px" }}>Page Not Found</h2>
          <p style={{ color: "var(--muted)", marginTop: "10px", marginBottom: "24px" }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <a href="/" className="button button-primary">Go back home</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
