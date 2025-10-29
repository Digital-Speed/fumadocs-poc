import {
  CopyIcon,
  DotsHorizontalIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { createOpenAPI } from "fumadocs-openapi/server";
import {
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "fumadocs-ui/components/codeblock";
import type { OpenAPIV3 } from "openapi-types";
import nightOwl from "shiki/themes/night-owl.mjs";
import { cn } from "@/lib/cn";
import openapiJson from "./openapi.json";
import openapiCopyJson from "./openapi-copy.json";

export const localOpenAPISpecs = {
  petstore: openapiJson as OpenAPIV3.Document,
  "petstore-duplicate": openapiCopyJson as OpenAPIV3.Document,
};

export type LocalOpenAPISpecId = keyof typeof localOpenAPISpecs;

const HTTP_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as const satisfies ReadonlyArray<OpenAPIV3.HttpMethods>;

export interface LocalOpenAPIOperation {
  slug: string;
  method: OpenAPIV3.HttpMethods;
  path: string;
  summary?: string;
  description?: string;
  tags?: string[];
  operationId?: string;
}

export function listLocalOperations(
  specId: LocalOpenAPISpecId,
): LocalOpenAPIOperation[] {
  const spec = localOpenAPISpecs[specId];
  if (spec === undefined) return [];

  const operations: LocalOpenAPIOperation[] = [];
  const slugCounts = new Map<string, number>();

  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    if (!item) continue;
    for (const method of HTTP_METHODS) {
      const operation = item[method];
      if (!operation) continue;

      const baseSlug = createOperationSlug(operation.operationId, method, path);
      const slug = ensureUniqueSlug(baseSlug, slugCounts);

      operations.push({
        slug,
        method,
        path,
        summary: operation.summary ?? item.summary ?? undefined,
        description: operation.description ?? item.description ?? undefined,
        tags: operation.tags ?? item.tags ?? undefined,
        operationId: operation.operationId ?? undefined,
      });
    }
  }

  return operations.sort((a, b) => {
    const left =
      a.summary ?? a.operationId ?? `${a.method.toUpperCase()} ${a.path}`;
    const right =
      b.summary ?? b.operationId ?? `${b.method.toUpperCase()} ${b.path}`;
    return left.localeCompare(right);
  });
}

export function getLocalOperation(
  specId: LocalOpenAPISpecId,
  slug: string,
): LocalOpenAPIOperation | undefined {
  return listLocalOperations(specId).find(
    (operation) => operation.slug === slug,
  );
}

const METHOD_BADGE_CLASS_MAP: Record<string, string> = {
  get: "border-emerald-500/40 text-emerald-300",
  post: "border-sky-500/40 text-sky-300",
  put: "border-amber-500/40 text-amber-300",
  delete: "border-rose-500/40 text-rose-300",
  patch: "border-orange-500/40 text-orange-300",
};

const DEFAULT_METHOD_BADGE_CLASS =
  "border-dashboard-zinc-700 text-dashboard-zinc-400";

export function getMethodBadgeClassName(method: string) {
  return (
    METHOD_BADGE_CLASS_MAP[method.toLowerCase()] ?? DEFAULT_METHOD_BADGE_CLASS
  );
}

function createOperationSlug(
  operationId: string | undefined,
  method: OpenAPIV3.HttpMethods,
  path: string,
) {
  if (operationId) {
    const sanitizedOperationId = sanitizeSlug(operationId, {
      preserveCase: true,
    });
    if (sanitizedOperationId.length > 0) return sanitizedOperationId;
  }

  const fallback = `${method}-${path}`;
  return sanitizeSlug(fallback, { preserveCase: false });
}

function ensureUniqueSlug(base: string, counts: Map<string, number>) {
  const normalized = base.length > 0 ? base : "operation";
  const current = counts.get(normalized) ?? 0;
  counts.set(normalized, current + 1);
  if (current === 0) return normalized;
  return `${normalized}-${current + 1}`;
}

function sanitizeSlug(value: string, options: { preserveCase: boolean }) {
  const cleaned = value
    .trim()
    .replace(/[{}[\]]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return options.preserveCase ? cleaned : cleaned.toLowerCase();
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

export const openapi = createOpenAPI({
  input: async () => localOpenAPISpecs,
  shikiOptions: {
    theme: nightOwl,
  },
  renderer: {
    Requests: ({ items = [], children }) => {
      if (items.length === 0) return null;
      const defaultValue = items[0];

      return (
        <div className="border border-dashboard-zinc-800/70 bg-dashboard-zinc-950/70 text-dashboard-zinc-200 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.85)] backdrop-blur">
          <CodeBlockTabs
            groupId="fumadocs_openapi_requests"
            defaultValue={defaultValue}
            className="bg-dashboard-zinc-950/70"
          >
            <div className="rounded-none px-5 pt-4">
              <CodeBlockTabsList className="flex items-end justify-between gap-2 border-b border-dashboard-zinc-800/70 bg-transparent">
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
                        "group flex flex-1 flex-col items-center gap-1 border-b-2 border-transparent py-3 text-xs font-semibold uppercase tracking-[0.18em] text-dashboard-zinc-500 transition",
                        "hover:text-dashboard-zinc-200",
                        "data-[state=active]:border-dashboard-red-600 data-[state=active]:text-dashboard-zinc-100",
                      )}
                    >
                      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden  border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-[10px] text-dashboard-zinc-400 transition group-data-[state=active]:border-dashboard-red-600/70 group-data-[state=active]:text-dashboard-zinc-100"></span>
                      <span className="text-[11px] font-medium tracking-normal">
                        {asset.label}
                      </span>
                    </CodeBlockTabsTrigger>
                  );
                })}
              </CodeBlockTabsList>
            </div>

            <div className="flex items-center justify-between border-b border-dashboard-zinc-800/70 px-5 py-3">
              <span className="text-sm font-medium text-dashboard-zinc-300">
                Request samples
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Copy sample"
                  className="inline-flex h-8 w-8 items-center justify-center  border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-dashboard-zinc-400 transition hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
                >
                  <CopyIcon className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Open sample in new window"
                  className="inline-flex h-8 w-8 items-center justify-center  border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-dashboard-zinc-400 transition hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
                >
                  <ExternalLinkIcon className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="More request options"
                  className="inline-flex h-8 w-8 items-center justify-center  border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/70 text-dashboard-zinc-400 transition hover:border-dashboard-red-600/60 hover:text-dashboard-red-600"
                >
                  <DotsHorizontalIcon className="size-4" />
                </button>
              </div>
            </div>

            <div className="px-5 pb-5">{children}</div>
          </CodeBlockTabs>
        </div>
      );
    },
  },
});
