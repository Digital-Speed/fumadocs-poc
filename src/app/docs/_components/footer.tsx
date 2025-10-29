"use client";

import { Link, usePathname } from "fumadocs-core/framework";
import type * as PageTree from "fumadocs-core/page-tree";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import { useMemo } from "react";

export default function Footer() {
  const { root } = useTreeContext();
  const pathname = usePathname();
  const flatten = useMemo(() => {
    const result: PageTree.Item[] = [];

    function scan(items: PageTree.Node[]) {
      for (const item of items) {
        if (item.type === "page") result.push(item);
        else if (item.type === "folder") {
          if (item.index) result.push(item.index);
          scan(item.children);
        }
      }
    }

    scan(root.children);
    return result;
  }, [root]);

  const { previous, next } = useMemo(() => {
    const idx = flatten.findIndex((item) => item.url === pathname);

    if (idx === -1) return {};
    return {
      previous: flatten[idx - 1],
      next: flatten[idx + 1],
    };
  }, [flatten, pathname]);

  return (
    <div className="flex flex-row items-center justify-between gap-2 text-sm font-medium text-dashboard-zinc-300">
      {previous ? (
        <Link
          href={previous.url}
          className="rounded-full border border-dashboard-zinc-800/60 px-4 py-2 text-dashboard-zinc-300 transition-colors hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
        >
          ← {previous.name}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.url}
          className="rounded-full border border-dashboard-zinc-800/60 px-4 py-2 text-dashboard-zinc-300 transition-colors hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
        >
          {next.name} →
        </Link>
      ) : null}
    </div>
  );
}
