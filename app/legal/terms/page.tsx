import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <StubPage
      label="Legal"
      title="Terms"
      body="Terms placeholder. Capital content is education, not advice — formal language lands with the first public diagnostic."
    />
  );
}
