"use client";

import {
  AnchorProvider,
  type TOCItemType,
  useActiveAnchors,
} from "fumadocs-core/toc";
import type { ComponentProps, ReactNode } from "react";
import Footer from "@/app/docs/_components/footer";
import { cn } from "@/lib/cn";

export interface DocsPageProps {
  toc?: TOCItemType[];
  children: ReactNode;
}

export function DocsPage({ toc = [], ...props }: DocsPageProps) {
  return (
    <AnchorProvider toc={toc}>
      <main className="flex w-full min-w-0 flex-col items-stretch gap-6 px-4 py-8 md:flex-row md:px-10">
        <article className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col gap-6">
          <div className="rounded-3xl border border-dashboard-zinc-800/80 bg-dashboard-zinc-950/80 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
            <div className="flex flex-col gap-6 p-8">{props.children}</div>
          </div>
          <div className="rounded-2xl border border-dashboard-zinc-800/70 bg-dashboard-zinc-950/80 px-6 py-4">
            <Footer />
          </div>
        </article>
        {toc.length > 0 && (
          <div className="sticky top-(--fd-nav-height) h-[calc(100dvh-var(--fd-nav-height))] w-[286px] shrink-0 overflow-auto rounded-3xl border border-dashboard-zinc-800/70 bg-dashboard-zinc-950/60 p-6 pb-10 max-xl:hidden">
            <p className="mb-4 text-sm font-medium text-dashboard-zinc-300/80">
              On this page
            </p>
            <div className="flex flex-col gap-2">
              {toc.map((item) => (
                <TocItem key={item.url} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </AnchorProvider>
  );
}

export function DocsBody(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "prose prose-invert max-w-none",
        "prose-headings:text-dashboard-zinc-300 prose-strong:text-dashboard-zinc-300",
        "prose-p:text-dashboard-zinc-400 prose-li:text-dashboard-zinc-400",
        "prose-code:rounded prose-code:border prose-code:border-dashboard-zinc-800/80 prose-code:bg-dashboard-zinc-900/70 prose-code:px-1 prose-code:py-0.5 prose-code:text-dashboard-red-600",
        "prose-pre:bg-dashboard-zinc-900/70 prose-pre:border prose-pre:border-dashboard-zinc-800/80 prose-pre:text-dashboard-zinc-300",
        "prose-a:text-dashboard-red-600 prose-a:no-underline hover:prose-a:text-dashboard-red-700",
        "prose-hr:border-dashboard-zinc-800/70",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

export function DocsDescription(props: ComponentProps<"p">) {
  if (props.children === undefined) return null;

  return (
    <p
      {...props}
      className={cn("mb-6 text-base text-dashboard-zinc-400", props.className)}
    >
      {props.children}
    </p>
  );
}

export function DocsTitle(props: ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "text-4xl font-semibold tracking-tight text-dashboard-zinc-300",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
}

function TocItem({ item }: { item: TOCItemType }) {
  const isActive = useActiveAnchors().includes(item.url.slice(1));

  return (
    <a
      href={item.url}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium text-dashboard-zinc-400 transition-colors",
        isActive
          ? "bg-dashboard-zinc-900/80 text-dashboard-red-600"
          : "hover:bg-dashboard-zinc-900/40 hover:text-dashboard-zinc-300",
      )}
      style={{
        paddingLeft: Math.max(0, item.depth - 2) * 16,
      }}
    >
      {item.title}
    </a>
  );
}
