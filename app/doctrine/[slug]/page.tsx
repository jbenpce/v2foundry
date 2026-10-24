import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { DoctrineByline } from "@/components/DoctrineByline";
import { MondayMove } from "@/components/MondayMove";
import { doctrineMdxComponents } from "@/components/mdx";
import {
  formatDoctrineDate,
  getDoctrineEssay,
  getDoctrineSlugs,
} from "@/lib/doctrine";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDoctrineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getDoctrineEssay(slug);
  if (!essay) {
    return { title: "Doctrine" };
  }
  return {
    title: essay.title,
    description: essay.description,
  };
}

export default async function DoctrineEssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getDoctrineEssay(slug);
  if (!essay) {
    notFound();
  }

  return (
    <article className="vf-essay">
      <header className="vf-essay__header">
        <p className="vf-essay__eyebrow">
          <Link href="/doctrine">Doctrine</Link>
          {essay.argument != null ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>Argument {essay.argument}</span>
            </>
          ) : null}
        </p>
        <h1 className="vf-essay__title">{essay.title}</h1>
        <DoctrineByline
          byline={essay.byline}
          date={essay.date}
          dateLabel={formatDoctrineDate(essay.date)}
          readingMinutes={essay.readingMinutes}
        />
        <p className="vf-essay__dek">{essay.description}</p>
      </header>

      <div className="vf-prose">
        <MDXRemote
          source={essay.content}
          components={doctrineMdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      <MondayMove>
        <p>{essay.mondayMove}</p>
      </MondayMove>

      <footer className="vf-essay__footer">
        <Link href="/diagnostic" className="vf-btn vf-btn--primary">
          Take the diagnostic
        </Link>
        <Link href="/doctrine" className="vf-btn vf-btn--secondary">
          All doctrine
        </Link>
      </footer>
    </article>
  );
}
