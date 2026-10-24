import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <StubPage
      label="V2 Foundry"
      title="About"
      body="Operator thesis for the first generation whose entry-level work was automated before they finished doing it. Full founder story soon."
    />
  );
}
