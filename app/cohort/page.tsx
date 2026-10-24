import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Cohort",
};

export default function CohortPage() {
  return (
    <StubPage
      label="Coming soon"
      title="Cohort interest"
      body="A small paid cohort for people building their next version. Interest capture ships after the diagnostic."
    />
  );
}
