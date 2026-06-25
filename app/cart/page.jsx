"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkout");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#666" }}>
      <p>Redirecting to secure checkout...</p>
    </div>
  );
}
