import React from "react";
import Image from "next/image";

const allLogos = [
  "/ClientLogos/Ayurmor.png",
  "/ClientLogos/Canal Touch Resort.png",
  "/ClientLogos/Hayat frozen foods.png",
  "/ClientLogos/Kavya Beauty Parlour.png",
  "/ClientLogos/Krish Metal.png",
  "/ClientLogos/Lakme Salon.png",
  "/ClientLogos/Mauri Sarees.png",
  "/ClientLogos/RENTOFURNISHED.png",
  "/ClientLogos/Sahyadri Realty.png",
  "/ClientLogos/Sanskruti Preschool.png",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM (1).jpeg",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM (2).jpeg",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM (3).jpeg",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM (4).jpeg",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM (5).jpeg",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM (6).jpeg",
  "/ClientLogos/WhatsApp Image 2026-08-04 at 11.49.21 AM.jpeg",
  "/ClientLogos/mountains Bills.png",
  "/ClientLogos/whitepureplus.jpeg"
];

const topRowLogos = allLogos.slice(0, 10);
const bottomRowLogos = allLogos.slice(10);

export default function ClientCarousel() {
  return (
    <section className="client-carousel-section">
      <h2 className="reveal">Trusted by Industry-Leading Brands for Digital Growth</h2>
      
      <div className="marquee-container reveal reveal-delay-1">
        
        {/* Top Row: Scrolls Normal (Left) */}
        <div className="marquee-row marquee-row-normal">
          {/* Group 1 */}
          <div className="marquee-content">
            {topRowLogos.map((src, index) => (
              <div className="client-logo-card" key={`top-1-${index}`}>
                <img src={src} alt={`Client logo ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          {/* Group 2 (Duplicate for infinite scroll) */}
          <div className="marquee-content" aria-hidden="true">
            {topRowLogos.map((src, index) => (
              <div className="client-logo-card" key={`top-2-${index}`}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Scrolls Reverse (Right) */}
        <div className="marquee-row marquee-row-reverse">
          {/* Group 1 */}
          <div className="marquee-content">
            {bottomRowLogos.map((src, index) => (
              <div className="client-logo-card" key={`bottom-1-${index}`}>
                <img src={src} alt={`Client logo ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          {/* Group 2 (Duplicate for infinite scroll) */}
          <div className="marquee-content" aria-hidden="true">
            {bottomRowLogos.map((src, index) => (
              <div className="client-logo-card" key={`bottom-2-${index}`}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
