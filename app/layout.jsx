import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";
import WhatsAppFloating from "./components/WhatsAppFloating";
import BackToTop from "./components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["600", "700"],
  display: "swap",
});

export const metadata = {
  title: "AI Digital | Neural Growth Marketing",
  description:
    "AI-powered digital marketing for SEO, performance campaigns, social growth, design, and analytics."
};

export default function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <ChatWidget />
        <WhatsAppFloating />
        <BackToTop />
      </body>
    </html>
  );
}

