import type { ReactNode } from "react";
import type { LocalOpenAPISpecId } from "@/lib/openapi";

export interface ApiGuide {
  slug: string;
  title: string;
  description?: string;
  render: () => ReactNode;
}

const guideMap: Partial<Record<LocalOpenAPISpecId, ApiGuide[]>> = {
  petstore: [
    {
      slug: "overview",
      title: "Overview",
      description: "Learn what the Petstore API offers and how to get started.",
      render: () => (
        <>
          <h1>Petstore API Overview</h1>
          <p>
            The sample Petstore API demonstrates a REST interface for managing pets,
            orders, and users. Use it to explore CRUD endpoints, authentication flows,
            and multipart uploads in a sandboxed environment.
          </p>
          <h2 id="getting-access">Getting access</h2>
          <p>
            Requests do not require authentication by default, but you can supply an
            <code>api_key</code> header to mimic production-style security. OAuth scopes are also
            available; check the <em>Authorizations</em> tab on each endpoint for details.
          </p>
          <h2 id="environments">Environments</h2>
          <ul>
            <li>
              <strong>Sandbox:</strong> <code>https://petstore3.swagger.io</code>
            </li>
            <li>
              <strong>Mock server:</strong> <code>https://petstore.example.mock</code>
            </li>
          </ul>
          <h2 id="whats-next">What's next?</h2>
          <p>
            Browse the endpoint list to understand request/response schemas, or jump to the
            authentication guide for more realistic flows.
          </p>
        </>
      ),
    },
    {
      slug: "authentication",
      title: "Authentication",
      description: "Understand API keys and OAuth flows used by the Petstore API.",
      render: () => (
        <>
          <h1>Authentication</h1>
          <p>
            The Petstore API supports two authentication mechanisms so you can experiment with
            client credentials:
          </p>
          <ol>
            <li>
              <strong>API key header</strong> — send <code>api_key</code> with your requests. Any
              non-empty value is accepted in the sandbox.
            </li>
            <li>
              <strong>OAuth (implicit)</strong> — initiate a browser-based flow and exchange the
              resulting token for protected operations. Scopes include <code>read:pets</code> and
              <code>write:pets</code>.
            </li>
          </ol>
          <h2 id="testing-api-keys">Testing API keys</h2>
          <p>
            Use the following command to hit a protected endpoint:
          </p>
          <pre>
            <code className="language-bash">
              {`curl -H "api_key: test-key" https://petstore3.swagger.io/api/v3/pet/1`}
            </code>
          </pre>
          <h2 id="oauth-scopes">OAuth scopes</h2>
          <p>
            When using OAuth, request the scope set that aligns with the endpoints you plan to call.
            The sandbox honors tokens but does not validate issuer metadata, making it ideal for demos.
          </p>
        </>
      ),
    },
  ],
  "petstore-duplicate": [
    {
      slug: "overview",
      title: "Overview",
      description: "Duplicate spec used for testing multiple API documents.",
      render: () => (
        <>
          <h1>Petstore Duplicate Overview</h1>
          <p>
            This copy mirrors the primary Petstore schema. Use it to validate multi-spec routing,
            navigation, and rendering behavior within the docs experience.
          </p>
          <p>All endpoint semantics are identical to the original Petstore reference.</p>
        </>
      ),
    },
  ],
};

export function getGuidesForSpec(specId: LocalOpenAPISpecId): ApiGuide[] {
  return guideMap[specId] ?? [];
}

export function getGuideForSpec(
  specId: LocalOpenAPISpecId,
  slug: string,
): ApiGuide | undefined {
  return getGuidesForSpec(specId).find((guide) => guide.slug === slug);
}
