"use client";

import {
  CreditCard,
  Download,
  LayoutGrid,
  Library,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/library", label: "My Library", icon: Library },
  { href: "/dashboard/tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
  { href: "/dashboard/downloads", label: "Downloads", icon: Download },
  { href: "/dashboard/account", label: "Account", icon: UserRound },
];

/**
 * Dashboard navigation.
 *
 * Horizontally scrollable on mobile rather than collapsed into a menu: the
 * library is what people come back for, and burying it behind a tap costs more
 * than the horizontal space does.
 */
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="border-b border-border">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 px-3.5 py-3.5 text-body-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon size={16} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
