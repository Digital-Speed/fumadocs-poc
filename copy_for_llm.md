Expose Markdown text for any docs page, including the OpenAPI page, using the Fumadocs-recommended method:

Enable includeProcessedMarkdown: true in the docs source configuration.

Create a route such as:
app/llms.mdx/[[...slug]]/route.ts

This route must:

Receive the slug for a docs page.

Look up the page via the Fumadocs source instance.

Call page.data.getText("processed").

Return plain text Markdown (Content-Type: text/markdown).

Rewrite URLs:

Configure next.config.js so that /docs/<slug>.mdx is rewritten to /llms.mdx/<slug>.

Wire the URL into the docs layout:

In the docs page layout (the one receiving page), add the View Options / AI Actions section.

Pass markdownUrl: \${page.url}.mdx`toLLMCopyButtonandViewOptions`.

Special-case the OpenAPI page:

Detect the OpenAPI page by its slug/path or by frontmatter.

For the OpenAPI page, enhance the returned Markdown by injecting additional OpenAPI-specific text:

Convert the API spec summary (list of endpoints and methods) into Markdown.

Include the API version from openapi.info.version.

Include endpoint descriptions if available.

Ensure this addition happens inside the getLLMText() helper so it only modifies the .mdx version for LLMs and NOT the rendered site.
