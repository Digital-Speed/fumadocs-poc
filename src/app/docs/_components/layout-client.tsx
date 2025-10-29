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
        <header className="sticky top-0 z-20 h-14 border-b border-dashboard-zinc-800/70 bg-dashboard-zinc-950/70 backdrop-blur">
          <nav className="flex size-full flex-row items-center gap-3 px-6">
            <Link
              href="/"
              className="mr-auto text-sm font-semibold uppercase tracking-[0.2em] text-dashboard-zinc-300 transition-colors hover:text-dashboard-red-600"
            >
              My Docs
            </Link>
            <SearchToggle />
            <NavbarSidebarTrigger className="md:hidden" />
          </nav>
        </header>
        <main
          id="nd-docs-layout"
          className="flex flex-1 flex-row bg-[radial-gradient(circle_at_top,_rgba(219,0,17,0.08),_transparent_45%),_rgba(11,11,12,0.96)] [--fd-nav-height:56px]"
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
      className={cn(
        "rounded-full border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/60 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-dashboard-zinc-300 transition-colors hover:border-dashboard-red-600/60 hover:text-dashboard-red-600",
        props.className,
      )}
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
      className={cn(
        "rounded-full border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/60 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-dashboard-zinc-300 transition-colors hover:border-dashboard-red-600/60 hover:text-dashboard-red-600",
        props.className,
      )}
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
        "fixed top-16 z-20 flex shrink-0 flex-col gap-5 overflow-auto rounded-3xl border border-dashboard-zinc-800/60 bg-dashboard-zinc-950/70 p-6 text-sm shadow-[0_24px_70px_-45px_rgba(0,0,0,0.85)] backdrop-blur md:sticky md:h-[calc(100dvh-56px)] md:w-[310px]",
        "max-md:inset-x-6 max-md:bottom-6 max-md:px-5 max-md:py-6",
        !open && "max-md:pointer-events-none max-md:opacity-0",
      )}
    >
      <Link
        href="/apis"
        className={linkVariants({
          active: pathname === "/apis",
        })}
      >
        API catalogue
      </Link>
      <div className="flex flex-col gap-1.5">{children}</div>
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
  "flex w-full items-center gap-2 rounded-2xl border border-transparent px-3.5 py-2 text-dashboard-zinc-400 transition-all duration-150 [&_svg]:size-4",
  {
    variants: {
      active: {
        true: "border-dashboard-zinc-800 bg-dashboard-zinc-900/70 text-dashboard-zinc-100 shadow-[0_16px_40px_-35px_rgba(0,0,0,0.9)]",
        false:
          "hover:border-dashboard-zinc-800/60 hover:bg-dashboard-zinc-900/50 hover:text-dashboard-zinc-200",
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
        <span className="truncate">{item.name}</span>
      </Link>
    );
  }

  if (item.type === "separator") {
    return (
      <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-dashboard-zinc-500">
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {item.index ? (
        <Link
          className={linkVariants({
            active: pathname === item.index.url,
          })}
          href={item.index.url}
        >
          {item.index.icon}
          <span className="truncate">{item.index.name}</span>
        </Link>
      ) : (
        <p className={cn(linkVariants(), "text-start text-dashboard-zinc-400")}>
          {item.icon}
          <span className="truncate">{item.name}</span>
        </p>
      )}
      <div className="ml-4 border-l border-dashboard-zinc-800/60 pl-4">
        {children}
      </div>
    </div>
  );
}
