import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { DocsLayoutClient } from "./_components/layout-client";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = source.getPageTree();

  return <DocsLayoutClient tree={tree}>{children}</DocsLayoutClient>;
}
