import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <StubPage
      label="Legal"
      title="Privacy"
      body="Privacy policy placeholder. Phase 0 will keep capture minimal and state what is collected before any email gate ships."
    />
  );
}
