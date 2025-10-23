"use server";

export type ApiInstruction = {
  title: string;
  description: string;
  slug: string;
  content: string;
};

export type ApiInstructionGroup = {
  slug: string;
  title: string;
  summary: string;
  specUrl: string;
  instructions: ApiInstruction[];
};

const apiInstructions: ApiInstructionGroup[] = [
  {
    slug: "open-banking",
    title: "Open Banking API",
    summary:
      "Account information and payment initiation capabilities for third-party providers.",
    specUrl:
      "https://raw.githubusercontent.com/OpenBankingUK/read-write-api-specs/master/dist/v3.1/rls/financial-grade-open-banking-read-write-api.yaml",
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
    slug: "banking-society",
    title: "Banking Society API",
    summary:
      "Prototype access to account balances and funds confirmation endpoints.",
    specUrl:
      "https://raw.githubusercontent.com/SchemaFiles/open-banking-funds-confirmation-api/refs/heads/main/openapi.yaml",
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
    groupSlug === undefined ? null : getGroupBySlug(groupSlug);

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

export async function listApiGroups(): Promise<ApiInstructionGroup[]> {
  return apiInstructions;
}

function getGroupBySlug(slug: string) {
  return apiInstructions.find((group) => group.slug === slug) ?? null;
}
