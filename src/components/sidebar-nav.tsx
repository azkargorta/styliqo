"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  CalendarDays,
  CreditCard,
  Heart,
  Layers3,
  Shirt,
  Sparkles,
} from "lucide-react";
import { profile } from "@/lib/mock-data";
import { StyliqoLogoMark } from "@/components/brand/logo";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Layers3 },
  { href: "/wardrobe", label: "Armario", icon: Shirt },
  { href: "/outfits", label: "Outfits", icon: Sparkles },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/premium", label: "Premium", icon: CreditCard },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm shadow-stone-200/40">
      <Link href="/" className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white">
          <StyliqoLogoMark className="h-7 w-7 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-950">Styliqo</p>
          <p className="truncate text-xs text-stone-500">
            Tu armario, outfits y planner
          </p>
        </div>
      </Link>

      <div className="mt-6 rounded-3xl bg-stone-950 p-4 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
          Cuenta
        </p>
        <p className="mt-2 text-base font-semibold">{profile.fullName}</p>
        <p className="mt-3 text-sm text-stone-300">
          {profile.tier === "premium" ? "Premium" : "Free"} ·{" "}
          <span className="font-semibold text-white">
            {profile.monthlyAiCredits - profile.usedAiCredits}
          </span>{" "}
          creditos IA
        </p>
      </div>

      <nav className="mt-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                active
                  ? "bg-brand/10 text-stone-950 ring-1 ring-brand/25"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
              )}
            >
              <Icon
                className={clsx(
                  "h-4 w-4",
                  active ? "text-brand" : "text-stone-500",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-3xl bg-surfaceMuted p-4 text-sm text-stone-700">
        <p className="font-semibold text-stone-900">Tip rápido</p>
        <p className="mt-2 leading-6 text-stone-600">
          Empieza por <span className="font-semibold">Armario</span> y luego
          genera en <span className="font-semibold">Premium</span>.
        </p>
      </div>
    </aside>
  );
}

