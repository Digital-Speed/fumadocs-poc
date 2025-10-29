import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DocsLayoutClient } from "@/app/docs/_components/layout-client";
import { source } from "@/lib/source";
import {
  type LocalOpenAPISpecId,
  listLocalOperations,
  localOpenAPISpecs,
} from "@/lib/openapi";
import { SpecSidebar } from "./sidebar";

interface SchemaLayoutProps {
  children: ReactNode;
  params: {
    schema: string;
  };
}

export default function SchemaLayout({ children, params }: SchemaLayoutProps) {
  const tree = source.getPageTree();
  const schemaId = params.schema as LocalOpenAPISpecId;
  const schema = localOpenAPISpecs[schemaId];
  if (!schema) notFound();

  const operations = listLocalOperations(schemaId);
  if (operations.length === 0) {
    notFound();
  }

  return (
    <DocsLayoutClient tree={tree} showSidebar={false}>
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <SpecSidebar
          schemaId={schemaId}
          schemaTitle={schema.info?.title ?? schemaId}
          operations={operations}
        />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </DocsLayoutClient>
  );
}
