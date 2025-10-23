"use client";

import { cva } from "class-variance-authority";
import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { SidebarProvider, useSidebar } from "fumadocs-ui/contexts/sidebar";
import { TreeContextProvider, useTreeContext } from "fumadocs-ui/contexts/tree";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DocsLayoutClientProps {
  tree: PageTree.Root;
  children: ReactNode;
}

export function DocsLayoutClient({ tree, children }: DocsLayoutClientProps) {
  return (
    <TreeContextProvider tree={tree}>
      <SidebarProvider>
        <header className="sticky top-0 bg-fd-background h-14 z-20">
          <nav className="flex flex-row items-center gap-2 size-full px-4">
            <Link href="/" className="font-medium mr-auto">
              My Docs
            </Link>

            <SearchToggle />
            <NavbarSidebarTrigger className="md:hidden" />
          </nav>
        </header>
        <main
          id="nd-docs-layout"
          className="flex flex-1 flex-row [--fd-nav-height:56px]"
        >
          <Sidebar />
          {children}
        </main>
      </SidebarProvider>
    </TreeContextProvider>
  );
}

function SearchToggle(props: ComponentProps<"button">) {
  const { enabled, setOpenSearch } = useSearchContext();
  if (!enabled) return null;

  return (
    <button
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpenSearch(true)}
    >
      Search
    </button>
  );
}

function NavbarSidebarTrigger(props: ComponentProps<"button">) {
  const { open, setOpen } = useSidebar();

  return (
    <button
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpen(!open)}
    >
      Sidebar
    </button>
  );
}

function Sidebar() {
  const { root } = useTreeContext();
  const { open } = useSidebar();
  const pathname = usePathname();

  const children = renderSidebarChildren(root.children);

  return (
    <aside
      className={cn(
        "fixed flex flex-col shrink-0 p-4 top-14 z-20 text-sm overflow-auto md:sticky md:h-[calc(100dvh-56px)] md:w-[300px]",
        "max-md:inset-x-0 max-md:bottom-0 max-md:bg-fd-background",
        !open && "max-md:invisible",
      )}
    >
      <Link
        href="/apis/open-banking/get-started"
        className={linkVariants({
          active: false,
        })}
      >
        Getting started
      </Link>
      <div className="flex flex-col">{children}</div>
    </aside>
  );
}

function renderSidebarChildren(items: PageTree.Node[]) {
  return (
    <>
      {items.map((item) => (
        <SidebarItem key={item.$id} item={item}>
          {item.type === "folder" ? renderSidebarChildren(item.children) : null}
        </SidebarItem>
      ))}
    </>
  );
}

const linkVariants = cva(
  "flex items-center gap-2 w-full py-1.5 rounded-lg text-fd-foreground/80 [&_svg]:size-4",
  {
    variants: {
      active: {
        true: "text-fd-primary font-medium",
        false: "hover:text-fd-accent-foreground",
      },
    },
  },
);

function SidebarItem({
  item,
  children,
}: {
  item: PageTree.Node;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (item.type === "page") {
    return (
      <Link
        href={item.url}
        className={linkVariants({
          active: pathname === item.url,
        })}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  }

  if (item.type === "separator") {
    return (
      <p className="text-fd-muted-foreground mt-6 mb-2 first:mt-0">
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <div>
      {item.index ? (
        <Link
          className={linkVariants({
            active: pathname === item.index.url,
          })}
          href={item.index.url}
        >
          {item.index.icon}
          {item.index.name}
        </Link>
      ) : (
        <p className={cn(linkVariants(), "text-start")}>
          {item.icon}
          {item.name}
        </p>
      )}
      <div className="pl-4 border-l flex flex-col">{children}</div>
    </div>
  );
}
