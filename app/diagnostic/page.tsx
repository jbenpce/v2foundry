import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Diagnostic",
};

export default function DiagnosticPage() {
  return (
    <StubPage
      label="Coming soon"
      title="Diagnostic"
      body="Five minutes across work, capital, body and mind. No account to see your position."
    />
  );
}
