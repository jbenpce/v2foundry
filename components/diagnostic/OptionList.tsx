"use client";

type Option = { value: string; label: string };

type OptionListProps = {
  name: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
};

export function OptionList({ name, options, value, onChange }: OptionListProps) {
  return (
    <div className="vf-diag-options" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`vf-diag-option${selected ? " is-selected" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="vf-diag-option__mark" aria-hidden="true" />
            <span className="vf-diag-option__label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
