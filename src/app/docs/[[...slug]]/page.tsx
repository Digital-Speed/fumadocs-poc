import { APIPage } from "fumadocs-openapi/ui";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "../_components/docs-page";

interface DocPageProps {
  params: {
    slug?: string[];
  };
}

export default function DocPage({ params }: DocPageProps) {
  const slug = params.slug ?? [];

  if (slug.length === 0) {
    redirect("/docs/getting-started");
  }

  const page = source.getPage(slug);
  if (!page) notFound();

  const apiPageProps =
    "getAPIPageProps" in page.data ? page.data.getAPIPageProps() : undefined;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>{apiPageProps ? <APIPage {...apiPageProps} /> : null}</DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export function generateMetadata({ params }: DocPageProps): Metadata {
  const page = source.getPage(params.slug ?? []);
  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
