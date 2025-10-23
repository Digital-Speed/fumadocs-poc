import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ApiInstructionGroup } from "@/actions/get-api-instructions";
import { getApiInstructions } from "@/actions/get-api-instructions";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/app/docs/_components/docs-page";

interface ApiInstructionPageProps {
  params: {
    api: string;
    instruction: string;
  };
}

export default async function ApiInstructionPage({
  params,
}: ApiInstructionPageProps) {
  const { groups, activeGroup, activeInstruction } = await getApiInstructions([
    params.api,
    params.instruction,
  ]);

  if (groups.length === 0) {
    notFound();
  }

  const firstAvailable = getFirstInstruction(groups);

  if (activeGroup === null) {
    if (firstAvailable === null) {
      notFound();
    }

    redirect(
      `/apis/${firstAvailable.group.slug}/${firstAvailable.instruction.slug}`,
    );
  }

  if (activeInstruction === null) {
    const fallbackInstruction = activeGroup.instructions[0];
    if (fallbackInstruction) {
      redirect(`/apis/${activeGroup.slug}/${fallbackInstruction.slug}`);
    }

    notFound();
  }

  return (
    <DocsPage>
      <DocsTitle>{activeInstruction.title}</DocsTitle>
      <DocsDescription>{activeInstruction.description}</DocsDescription>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="space-y-4 md:w-64 md:shrink-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
              APIs
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {groups.map((group) => (
                <Link
                  key={group.slug}
                  className={[
                    "rounded-md border px-3 py-1 text-sm",
                    group.slug === activeGroup.slug
                      ? "border-fd-primary text-fd-primary"
                      : "border-fd-border text-fd-foreground/80 hover:border-fd-primary/60 hover:text-fd-primary/80",
                  ].join(" ")}
                  href={`/apis/${group.slug}`}
                >
                  {group.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
              Guides
            </p>
            <nav className="mt-2 flex flex-col gap-2">
              {activeGroup.instructions.map((instruction) => (
                <Link
                  key={instruction.slug}
                  className={[
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    instruction.slug === activeInstruction.slug
                      ? "bg-fd-primary/10 text-fd-primary"
                      : "hover:bg-fd-primary/5 text-fd-foreground/80",
                  ].join(" ")}
                  href={`/apis/${activeGroup.slug}/${instruction.slug}`}
                >
                  <span className="font-medium">{instruction.title}</span>
                  <span className="block text-xs text-fd-muted-foreground">
                    {instruction.description}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-lg border border-fd-border/60 bg-fd-background/60 p-4 text-xs text-fd-muted-foreground">
            <p className="font-medium text-fd-foreground">OpenAPI spec</p>
            <p className="mt-1 break-all">
              <a
                className="text-fd-primary hover:underline"
                href={activeGroup.specUrl}
                target="_blank"
                rel="noreferrer"
              >
                {activeGroup.specUrl}
              </a>
            </p>
          </div>
        </aside>

        <DocsBody>
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: instructions content is trusted static HTML
            dangerouslySetInnerHTML={{ __html: activeInstruction.content }}
          />
        </DocsBody>
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const { groups } = await getApiInstructions();

  return groups.flatMap((group) =>
    group.instructions.map((instruction) => ({
      api: group.slug,
      instruction: instruction.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ApiInstructionPageProps): Promise<Metadata> {
  const { activeGroup, activeInstruction } = await getApiInstructions([
    params.api,
    params.instruction,
  ]);

  if (activeGroup === null || activeInstruction === null) {
    return {
      title: "API Instructions",
    };
  }

  return {
    title: `${activeInstruction.title} – ${activeGroup.title}`,
    description: activeInstruction.description,
  };
}

function getFirstInstruction(groups: ApiInstructionGroup[]) {
  for (const group of groups) {
    const instruction = group.instructions[0];
    if (instruction) {
      return { group, instruction };
    }
  }

  return null;
}
