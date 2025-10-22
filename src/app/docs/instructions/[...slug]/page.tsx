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

interface InstructionsPageProps {
  params: {
    slug?: string[];
  };
}

export default async function InstructionsPage({
  params,
}: InstructionsPageProps) {
  const slugSegments = params.slug ?? [];
  const { groups, activeGroup, activeInstruction } =
    await getApiInstructions(slugSegments);

  if (groups.length === 0) {
    notFound();
  }

  const firstAvailable = getFirstInstruction(groups);

  if (!slugSegments.length || activeGroup === null) {
    if (firstAvailable === null) {
      notFound();
    }

    redirect(
      `/docs/instructions/${firstAvailable.group.name}/${firstAvailable.instruction.slug}`,
    );
  }

  if (activeGroup.instructions.length === 0) {
    notFound();
  }

  if (activeInstruction === null) {
    const fallbackInstruction = activeGroup.instructions[0];
    if (fallbackInstruction) {
      redirect(
        `/docs/instructions/${activeGroup.name}/${fallbackInstruction.slug}`,
      );
    }

    notFound();
  }

  return (
    <DocsPage>
      <DocsTitle>{activeInstruction.title}</DocsTitle>
      <DocsDescription>{activeInstruction.description}</DocsDescription>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-64 md:shrink-0 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
              Products
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {groups.map((group) => (
                <Link
                  key={group.name}
                  className={[
                    "rounded-md border px-3 py-1 text-sm",
                    group.name === activeGroup.name
                      ? "border-fd-primary text-fd-primary"
                      : "border-fd-border text-fd-foreground/80 hover:border-fd-primary/60 hover:text-fd-primary/80",
                  ].join(" ")}
                  href={buildInstructionPath(
                    group.name,
                    group.instructions[0]?.slug,
                  )}
                >
                  {formatGroupName(group.name)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
              Instructions
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
                  href={`/docs/instructions/${activeGroup.name}/${instruction.slug}`}
                >
                  <span className="font-medium">{instruction.title}</span>
                  <span className="block text-xs text-fd-muted-foreground">
                    {instruction.description}
                  </span>
                </Link>
              ))}
            </nav>
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
      slug: [group.name, instruction.slug],
    })),
  );
}

export async function generateMetadata({
  params,
}: InstructionsPageProps): Promise<Metadata> {
  const { activeGroup, activeInstruction } = await getApiInstructions(
    params.slug ?? [],
  );

  if (activeGroup === null || activeInstruction === null) {
    return {
      title: "API Instructions",
    };
  }

  return {
    title: `${activeInstruction.title} – ${formatGroupName(activeGroup.name)}`,
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

function buildInstructionPath(groupName: string, instructionSlug?: string) {
  if (!instructionSlug) {
    return `/docs/instructions/${groupName}`;
  }

  return `/docs/instructions/${groupName}/${instructionSlug}`;
}

function formatGroupName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
