import type { MDXComponents } from "mdx/types";
import { MondayMove } from "@/components/MondayMove";

export const doctrineMdxComponents: MDXComponents = {
  MondayMove,
  h2: (props) => <h2 className="vf-prose__h2" {...props} />,
  h3: (props) => <h3 className="vf-prose__h3" {...props} />,
  p: (props) => <p className="vf-prose__p" {...props} />,
  ul: (props) => <ul className="vf-prose__ul" {...props} />,
  ol: (props) => <ol className="vf-prose__ol" {...props} />,
  li: (props) => <li className="vf-prose__li" {...props} />,
  blockquote: (props) => <blockquote className="vf-prose__quote" {...props} />,
  strong: (props) => <strong className="vf-prose__strong" {...props} />,
  em: (props) => <em className="vf-prose__em" {...props} />,
  a: (props) => <a className="vf-prose__a" {...props} />,
  hr: () => <hr className="vf-prose__hr" />,
  table: (props) => (
    <div className="vf-prose__table-wrap">
      <table className="vf-prose__table" {...props} />
    </div>
  ),
  thead: (props) => <thead {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => <tr {...props} />,
  th: (props) => <th {...props} />,
  td: (props) => <td {...props} />,
  del: (props) => <del className="vf-prose__del" {...props} />,
};
