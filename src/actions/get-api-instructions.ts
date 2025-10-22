"use server";

export type ApiInstruction = {
  title: string;
  description: string;
  slug: string;
  content: string;
};

export type ApiInstructionGroup = {
  name: string;
  instructions: ApiInstruction[];
};

const apiInstructions: ApiInstructionGroup[] = [
  {
    name: "open-banking",
    instructions: [
      {
        title: "Get started",
        description: "Get started with the API",
        slug: "get-started",
        content:
          "<h1>Get started with the API</h1><p>This is the first step</p>",
      },
      {
        title: "Authentication",
        description: "Get authentitcated with the API",
        slug: "get-authenticated",
        content:
          "<h1>Get authenticated with the API</h1><p>This is the first step</p>",
      },
    ],
  },
  {
    name: "banking-society",
    instructions: [
      {
        title: "Get started",
        description: "Get started with the API",
        slug: "get-started",
        content:
          "<h1>Get started with the API</h1><p>This is the first step</p>",
      },
    ],
  },
];

export interface GetApiInstructionsResult {
  groups: ApiInstructionGroup[];
  activeGroup: ApiInstructionGroup | null;
  activeInstruction: ApiInstruction | null;
}

export async function getApiInstructions(
  slug: string[] = [],
): Promise<GetApiInstructionsResult> {
  const [groupSlug, instructionSlug] = slug;

  const activeGroup =
    groupSlug === undefined
      ? null
      : (apiInstructions.find(
          (instruction) => instruction.name === groupSlug,
        ) ?? null);

  const activeInstruction =
    activeGroup === null
      ? null
      : (activeGroup.instructions.find(
          (instruction) => instruction.slug === instructionSlug,
        ) ?? null);

  return {
    groups: apiInstructions,
    activeGroup,
    activeInstruction,
  };
}
