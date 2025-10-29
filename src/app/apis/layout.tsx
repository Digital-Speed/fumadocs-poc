import type { ReactNode } from "react";
import { DocsLayoutClient } from "@/app/docs/_components/layout-client";
import { source } from "@/lib/source";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = source.getPageTree();

  return (
    <DocsLayoutClient tree={tree} showSidebar={false}>
      {children}
    </DocsLayoutClient>
  );
}
