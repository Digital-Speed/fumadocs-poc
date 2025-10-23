import { notFound, redirect } from "next/navigation";
import { getApiInstructions } from "@/actions/get-api-instructions";

interface ApiLandingPageProps {
  params: {
    api: string;
  };
}

export default async function ApiLandingPage({ params }: ApiLandingPageProps) {
  const { activeGroup } = await getApiInstructions([params.api]);
  if (activeGroup === null) {
    notFound();
  }

  const firstInstruction = activeGroup.instructions[0];
  if (!firstInstruction) {
    notFound();
  }

  redirect(`/apis/${activeGroup.slug}/${firstInstruction.slug}`);
}

export async function generateStaticParams() {
  const { groups } = await getApiInstructions();
  return groups.map((group) => ({
    api: group.slug,
  }));
}
