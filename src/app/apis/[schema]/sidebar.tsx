"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  getMethodBadgeClassName,
  type LocalOpenAPIOperation,
  type LocalOpenAPISpecId,
} from "@/lib/openapi";

interface SpecSidebarProps {
  schemaId: LocalOpenAPISpecId;
  schemaTitle: string;
  operations: LocalOpenAPIOperation[];
}

export function SpecSidebar({
  schemaId,
  schemaTitle,
  operations,
}: SpecSidebarProps) {
  const segments = useSelectedLayoutSegments();
  const activeOperation = segments[1] ?? null;

  return (
    <aside
      className={cn(
        "rounded-3xl border border-dashboard-zinc-800/60 bg-dashboard-zinc-950/70 p-6 text-sm shadow-[0_24px_70px_-45px_rgba(0,0,0,0.85)] backdrop-blur",
        "md:sticky md:top-[calc(var(--fd-nav-height)+1.5rem)] md:h-[calc(100dvh-var(--fd-nav-height)-3rem)] md:w-[292px] md:overflow-y-auto",
      )}
    >
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-dashboard-zinc-500">
          API Spec
        </p>
        <p className="mt-2 text-base font-semibold text-dashboard-zinc-200">
          {schemaTitle}
        </p>
      </div>

      <nav className="flex flex-col gap-1.5">
        {operations.map((operation) => {
          const isActive = activeOperation === operation.slug;

          return (
            <Link
              key={operation.slug}
              href={`/apis/${schemaId}/${operation.slug}`}
              className={cn(
                "group flex flex-col gap-2 rounded-2xl border px-3.5 py-3 transition",
                isActive
                  ? "border-dashboard-zinc-700 bg-dashboard-zinc-900/70 text-dashboard-zinc-100"
                  : "border-transparent text-dashboard-zinc-400 hover:border-dashboard-zinc-700 hover:bg-dashboard-zinc-900/40 hover:text-dashboard-zinc-200",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium leading-tight">
                  {operation.summary ??
                    operation.operationId ??
                    `${operation.method.toUpperCase()} ${operation.path}`}
                </span>
                <span
                  className={cn(
                    "rounded-full border bg-dashboard-zinc-900/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                    getMethodBadgeClassName(operation.method),
                  )}
                >
                  {operation.method.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-dashboard-zinc-500">
                {operation.path}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
