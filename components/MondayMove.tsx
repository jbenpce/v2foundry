type MondayMoveProps = {
  children: React.ReactNode;
};

export function MondayMove({ children }: MondayMoveProps) {
  return (
    <aside className="vf-monday" aria-label="Monday move">
      <p className="vf-monday__label">Monday move</p>
      <div className="vf-monday__body">{children}</div>
    </aside>
  );
}
