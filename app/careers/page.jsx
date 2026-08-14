import CareersClientPage from "./CareersClientPage";

export const metadata = {
  title: "Careers | Join AI Digital",
  description:
    "Explore open roles and career opportunities at AI Digital. We are looking for creative and passionate individuals to join our digital marketing team.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers | Join AI Digital",
    description:
      "Explore open roles and career opportunities at AI Digital. We are looking for creative and passionate individuals to join our digital marketing team.",
    type: "website",
  }
};

export default function CareersPage() {
  return (
    <>
      <CareersClientPage />
    </>
  );
}
