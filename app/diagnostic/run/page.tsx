import type { Metadata } from "next";
import { DiagnosticFlow } from "@/components/diagnostic/DiagnosticFlow";

export const metadata: Metadata = {
  title: "Diagnostic",
  description: "Work, Capital, Body, Mind — nineteen questions.",
};

export default function DiagnosticRunPage() {
  return <DiagnosticFlow />;
}
