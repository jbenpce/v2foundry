import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const DOCTRINE_DIR = path.join(process.cwd(), "content/doctrine");

export type DoctrineFrontmatter = {
  title: string;
  description: string;
  date: string;
  byline?: string;
  argument?: number;
  mondayMove: string;
  draft?: boolean;
};

export type DoctrineMeta = DoctrineFrontmatter & {
  slug: string;
  readingMinutes: number;
};

export type DoctrineEssay = DoctrineMeta & {
  content: string;
};

function isMdxFile(name: string): boolean {
  return name.endsWith(".mdx") || name.endsWith(".md");
}

function readEssayFile(filename: string): DoctrineEssay {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(DOCTRINE_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const fm = data as DoctrineFrontmatter;

  if (!fm.title || !fm.description || !fm.date || !fm.mondayMove) {
    throw new Error(
      `Doctrine essay "${filename}" is missing required frontmatter (title, description, date, mondayMove).`,
    );
  }

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    byline: fm.byline ?? "GenXAlpha",
    argument: fm.argument,
    mondayMove: fm.mondayMove,
    draft: fm.draft ?? false,
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  };
}

export function getAllDoctrineEssays(): DoctrineMeta[] {
  if (!fs.existsSync(DOCTRINE_DIR)) {
    return [];
  }

  return fs
    .readdirSync(DOCTRINE_DIR)
    .filter(isMdxFile)
    .map(readEssayFile)
    .filter((essay) => !essay.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ slug, title, description, date, byline, argument, mondayMove, draft, readingMinutes }) => ({
      slug,
      title,
      description,
      date,
      byline,
      argument,
      mondayMove,
      draft,
      readingMinutes,
    }));
}

export function getDoctrineEssay(slug: string): DoctrineEssay | null {
  const mdxPath = path.join(DOCTRINE_DIR, `${slug}.mdx`);
  const mdPath = path.join(DOCTRINE_DIR, `${slug}.md`);

  if (fs.existsSync(mdxPath)) {
    const essay = readEssayFile(`${slug}.mdx`);
    return essay.draft ? null : essay;
  }
  if (fs.existsSync(mdPath)) {
    const essay = readEssayFile(`${slug}.md`);
    return essay.draft ? null : essay;
  }
  return null;
}

export function getDoctrineSlugs(): string[] {
  return getAllDoctrineEssays().map((essay) => essay.slug);
}

export function formatDoctrineDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
