import { ReactNode } from "react";
import clsx from "clsx";

interface SectionCardProps {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  eyebrow,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        "rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm shadow-stone-200/40",
        className,
      )}
    >
      <div className="mb-5">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-xl font-semibold text-stone-900">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
