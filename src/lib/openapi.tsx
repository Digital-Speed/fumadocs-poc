import { resolve } from "node:path";
import {
  CopyIcon,
  DotsHorizontalIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { createOpenAPI } from "fumadocs-openapi/server";
import {
  CodeBlock,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "fumadocs-ui/components/codeblock";
import Image from "next/image";
import { Children } from "react";
import nightOwl from "shiki/themes/night-owl.mjs";
import { cn } from "@/lib/cn";

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

const methodColors: Record<string, string> = {
  get: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  post: "bg-sky-500/10 text-sky-300 border border-sky-500/30",
  put: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  delete: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
  patch: "bg-orange-500/10 text-orange-300 border border-orange-500/30",
};

export const openapi = createOpenAPI({
  input: [`${resolve(process.cwd(), "src/openapi.json")}`],
  shikiOptions: {
    theme: nightOwl,
  },
  renderer: {
    Requests: ({ items = [], children }) => {
      if (items.length === 0) return null;
      const defaultValue = items[0];

      return (
        <div className=" border border-white  bg-[#0f131a] text-white shadow-lg">
          <CodeBlockTabs
            groupId="fumadocs_openapi_requests"
            defaultValue={defaultValue}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3 bg-black">
              <CodeBlockTabsList
                color="black"
                className="flex gap-6 overflow-x-auto bg-black"
              >
                {items.map((item) => {
                  const normalized = item.trim().toLowerCase();
                  const asset = languageAssets[normalized] ??
                    languageAssets[item.toLowerCase()] ?? {
                      label: item,
                      logo: "/logos/javascript.svg",
                    };

                  return (
                    <CodeBlockTabsTrigger
                      key={item}
                      value={item}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-md px-1 py-2 text-xs font-medium text-white/60 transition bg-black",
                        "data-[state=active]:text-white",
                      )}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 shadow-inner ring-1 ring-white/10 transition group-data-[state=active]:bg-white/15">
                        <Image
                          src={asset.logo}
                          alt={`${asset.label} logo`}
                          fill
                          className="h-8 w-8"
                        />
                      </span>
                      <span className="text-sm">{asset.label}</span>
                      <span className="mt-1 hidden h-1 w-full rounded-full bg-red-500 group-data-[state=active]:block" />
                    </CodeBlockTabsTrigger>
                  );
                })}
              </CodeBlockTabsList>
              <button
                type="button"
                aria-label="More request options"
                className="inline-flex h-9 w-9 items-center justify-center bg-black rounded-md border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
              >
                <DotsHorizontalIcon className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-black">
              <span className="text-sm font-medium text-white/80">
                Request samples
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Copy sample"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  <CopyIcon className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Open sample in new window"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  <ExternalLinkIcon className="size-4" />
                </button>
              </div>
            </div>

            <div className="px-5 pb-5 pt-4 ">
              <CodeBlock>{children}</CodeBlock>
            </div>
          </CodeBlockTabs>
        </div>
      );
    },
  },
});
