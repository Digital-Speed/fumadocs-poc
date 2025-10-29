import type { Metadata } from "next";
import { APIPage } from "fumadocs-openapi/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/app/docs/_components/docs-page";
import { cn } from "@/lib/cn";
import {
  getLocalOperation,
  getMethodBadgeClassName,
  type LocalOpenAPISpecId,
  listLocalOperations,
  localOpenAPISpecs,
  openapi,
} from "@/lib/openapi";

interface ApiOperationPageProps {
  params: {
    schema: string;
    operation: string;
  };
}

export default async function ApiOperationPage({
  params,
}: ApiOperationPageProps) {
  const schemaId = params.schema as LocalOpenAPISpecId;
  const schema = localOpenAPISpecs[schemaId];
  if (!schema) notFound();

  const operation = getLocalOperation(schemaId, params.operation);
  if (!operation) {
    notFound();
  }

  const info = schema.info ?? {};
  const title =
    operation.summary ??
    operation.operationId ??
    `${operation.method.toUpperCase()} ${operation.path}`;
  const description =
    operation.description ??
    (typeof info.description === "string" ? info.description : undefined);

  const apiPageProps = openapi.getAPIPageProps({
    document: schemaId,
    hasHead: false,
    operations: [
      {
        path: operation.path,
        method: operation.method,
      },
    ],
  });

  return (
    <DocsPage>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-dashboard-zinc-400">
          <span
            className={cn(
              "rounded-full border bg-dashboard-zinc-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              getMethodBadgeClassName(operation.method),
            )}
          >
            {operation.method.toUpperCase()}
          </span>
          <code className="rounded-full border border-dashboard-zinc-800/60 bg-dashboard-zinc-900/60 px-3 py-1 text-dashboard-zinc-200">
            {operation.path}
          </code>
          <Link
            href={`/apis/${schemaId}`}
            className="ml-auto text-xs font-semibold uppercase tracking-wide text-dashboard-red-500 transition hover:text-dashboard-red-400"
          >
            ← Back to operations
          </Link>
        </div>
        <APIPage {...apiPageProps} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return Object.entries(localOpenAPISpecs).flatMap(([schemaId]) =>
    listLocalOperations(schemaId as LocalOpenAPISpecId).map((operation) => ({
      schema: schemaId,
      operation: operation.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ApiOperationPageProps): Promise<Metadata> {
  const schemaId = params.schema as LocalOpenAPISpecId;
  const schema = localOpenAPISpecs[schemaId];
  if (!schema) return {};

  const operation = getLocalOperation(schemaId, params.operation);
  if (!operation) {
    return {
      title: schema.info?.title ?? schemaId,
    };
  }

  const info = schema.info ?? {};

  return {
    title: `${
      operation.summary ??
      operation.operationId ??
      `${operation.method.toUpperCase()} ${operation.path}`
    } – ${info.title ?? schemaId}`,
    description:
      operation.description ??
      (typeof info.description === "string"
        ? info.description.split("\n").filter(Boolean)[0]
        : undefined),
  };
}
