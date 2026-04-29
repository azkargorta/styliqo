"use client";

import { ReactNode, useId, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export function Collapsible({
  title,
  description,
  defaultOpen = false,
  actionLabelOpen = "Cerrar",
  actionLabelClosed = "Abrir",
  children,
  className,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  actionLabelOpen?: string;
  actionLabelClosed?: string;
  children: ReactNode;
  className?: string;
}) {
  const contentId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={clsx("rounded-[1.75rem] bg-surface", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 rounded-[1.75rem] border border-border bg-surface p-5 text-left shadow-sm shadow-stone-200/40 transition hover:bg-surfaceMuted"
      >
        <div className="min-w-0">
          <p className="text-base font-semibold text-stone-950">{title}</p>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-border">
            {open ? actionLabelOpen : actionLabelClosed}
          </span>
          <ChevronDown
            className={clsx(
              "mt-0.5 h-4 w-4 text-stone-500 transition",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </div>
      </button>

      <div
        id={contentId}
        className={clsx(
          "overflow-hidden transition-[max-height,opacity] duration-300",
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-5 pb-5 pt-4">{children}</div>
      </div>
    </div>
  );
}

