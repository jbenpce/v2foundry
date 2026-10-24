import type { Metadata } from "next";
import { ResultView } from "@/components/diagnostic/ResultView";

export const metadata: Metadata = {
  title: "Your reading",
  description: "Position, Energy Index, and three moves.",
};

export default function DiagnosticResultPage() {
  return <ResultView />;
}
