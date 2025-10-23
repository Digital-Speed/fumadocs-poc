import Link from "next/link";
import { listApiGroups } from "@/actions/get-api-instructions";

export default async function ApisCataloguePage() {
  const groups = await listApiGroups();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 md:px-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-fd-muted-foreground">
          API Catalogue
        </p>
        <h1 className="text-4xl font-semibold text-fd-foreground">
          Explore our public APIs
        </h1>
        <p className="text-base text-fd-muted-foreground md:text-lg">
          Pick an API to read documentation generated from its OpenAPI spec.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => {
          const firstInstruction = group.instructions[0];
          return (
            <Link
              key={group.slug}
              href={
                firstInstruction
                  ? `/apis/${group.slug}/${firstInstruction.slug}`
                  : `/apis/${group.slug}`
              }
              className="group flex h-full flex-col justify-between rounded-xl border border-fd-border bg-fd-background/50 p-6 transition hover:border-fd-primary/60 hover:bg-fd-primary/5"
            >
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
                  {group.slug}
                </p>
                <h2 className="text-2xl font-semibold text-fd-foreground">
                  {group.title}
                </h2>
                <p className="text-sm text-fd-muted-foreground">
                  {group.summary}
                </p>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fd-primary">
                View documentation <span aria-hidden="true">→</span>
              </div>

              <p className="mt-4 text-xs text-fd-muted-foreground">
                Spec: {group.specUrl}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
