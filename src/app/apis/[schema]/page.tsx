import { APIPage } from "fumadocs-openapi/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/app/docs/_components/docs-page";
import {
  type LocalOpenAPISpecId,
  localOpenAPISpecs,
  openapi,
} from "@/lib/openapi";

interface ApiSpecPageProps {
  params: {
    schema: string;
  };
}

export default async function ApiSpecPage({ params }: ApiSpecPageProps) {
  const schemaId = params.schema as LocalOpenAPISpecId;
  const schema = localOpenAPISpecs[schemaId];

  if (!schema) {
    notFound();
  }

  const info = schema.info ?? {};
  const apiPageProps = openapi.getAPIPageProps({
    document: schemaId,
    hasHead: false,
  });

  const description =
    typeof info.description === "string" ? info.description : undefined;

  return (
    <DocsPage>
      <DocsTitle>{info.title ?? schemaId}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <APIPage {...apiPageProps} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return Object.keys(localOpenAPISpecs).map((schema) => ({ schema }));
}

export async function generateMetadata({
  params,
}: ApiSpecPageProps): Promise<Metadata> {
  const schemaId = params.schema as LocalOpenAPISpecId;
  const schema = localOpenAPISpecs[schemaId];
  if (!schema) return {};

  const info = schema.info ?? {};

  return {
    title: info.title ?? schemaId,
    description:
      typeof info.description === "string"
        ? info.description.split("\n").filter(Boolean)[0]
        : undefined,
  };
}
