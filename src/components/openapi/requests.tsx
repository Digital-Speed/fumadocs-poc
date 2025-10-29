'use client';

import { useContext, useMemo } from "react";
import {
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "fumadocs-ui/components/codeblock";
import { CopyIcon, DotsHorizontalIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/cn";
import {
  OpenAPIRequestContext,
  type OpenAPIRequestContextValue,
} from "@/lib/openapi-request-context";

interface RequestsProps {
  readonly items?: string[];
  readonly children: React.ReactNode;
}

const languageAssets: Record<
  string,
  {
    label: string;
    logo: string;
  }
> = {
  javascript: { label: "JavaScript", logo: "/logos/javascript.svg" },
  python: { label: "Python", logo: "/logos/python.svg" },
  curl: { label: "cURL", logo: "/logos/curl.svg" },
  go: { label: "Go", logo: "/logos/go.svg" },
  java: { label: "Java", logo: "/logos/java.svg" },
  "c#": { label: "C#", logo: "/logos/csharp.svg" },
};

function formatSummary(meta?: OpenAPIRequestContextValue) {
  if (!meta) return undefined;
  if (meta.method && meta.path) return `${meta.method} ${meta.path}`;
  if (meta.path) return meta.path;
  return meta.method;
}

export function Requests({ items = [], children }: RequestsProps) {
  const meta = useContext(OpenAPIRequestContext);
  const defaultValue = items.at(0);
  const requestSummary = useMemo(() => formatSummary(meta), [meta]);

  if (!defaultValue) return null;

  return (
    <div
      className="border border-dashboard-zinc-800/70 bg-dashboard-zinc-950/70 text-dashboard-zinc-200 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.85)] backdrop-blur"
      data-openapi-method={meta?.method}
      data-openapi-path={meta?.path}
      data-openapi-operation-id={meta?.operation?.operationId}
    >
      <CodeBlockTabs
        groupId="fumadocs_openapi_requests"
        defaultValue={defaultValue}
        className="bg-dashboard-zinc-950/70"
      >
        <div className="rounded-none px-5 pt-4">
          <CodeBlockTabsList className="flex items-end justify-between gap-2 border-b border-dashboard-zinc-800/70 bg-transparent">
            {items.map((item) => {
              const normalized = item.trim().toLowerCase();
              const asset =
                languageAssets[normalized] ??
                languageAssets[item.toLowerCase()] ?? {
                  label: item,
                  logo: "/logos/javascript.svg",
                };

              return (
                <CodeBlockTabsTrigger
                  key={item}
                  value={item}
                  className={cn(
                    "group flex flex-1 flex-col items-center gap-1 border-b-2 border-transparent py-3 text-xs font-semibold uppercase tracking-[0.18em] text-dashboard-zinc-500 transition",
                    "hover:text-dashboard-zinc-200",
                    "data-[state=active]:border-dashboard-red-600 data-[state=active]:text-dashboard-zinc-100",
                  )}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-[10px] text-dashboard-zinc-400 transition group-data-[state=active]:border-dashboard-red-600/70 group-data-[state=active]:text-dashboard-zinc-100"></span>
                  <span className="text-[11px] font-medium tracking-normal">
                    {asset.label}
                  </span>
                </CodeBlockTabsTrigger>
              );
            })}
          </CodeBlockTabsList>
        </div>

        <div className="flex items-center justify-between border-b border-dashboard-zinc-800/70 px-5 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-dashboard-zinc-300">
              Request samples
            </span>
            {requestSummary ? (
              <span className="text-xs uppercase tracking-[0.16em] text-dashboard-zinc-500">
                {requestSummary}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Copy sample"
              className="inline-flex h-8 w-8 items-center justify-center border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-dashboard-zinc-400 transition hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
            >
              <CopyIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Open sample in new window"
              className="inline-flex h-8 w-8 items-center justify-center border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-dashboard-zinc-400 transition hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
            >
              <ExternalLinkIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="More request options"
              className="inline-flex h-8 w-8 items-center justify-center border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-dashboard-zinc-400 transition hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
            >
              <DotsHorizontalIcon className="size-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">{children}</div>
      </CodeBlockTabs>
    </div>
  );
}
