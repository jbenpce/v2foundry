import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Doctrine",
};

export default function DoctrinePage() {
  return (
    <StubPage
      label="Coming soon"
      title="Doctrine"
      body="GenXAlpha writing — free, always. The first essays land in the next pass."
    />
  );
}
