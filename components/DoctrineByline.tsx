type DoctrineBylineProps = {
  byline?: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
};

export function DoctrineByline({
  byline = "GenXAlpha",
  date,
  dateLabel,
  readingMinutes,
}: DoctrineBylineProps) {
  return (
    <p className="vf-byline">
      <span className="vf-byline__name">{byline}</span>
      <span className="vf-byline__sep" aria-hidden="true">
        ·
      </span>
      <time dateTime={date}>{dateLabel}</time>
      <span className="vf-byline__sep" aria-hidden="true">
        ·
      </span>
      <span>{readingMinutes} min read</span>
    </p>
  );
}
