import { resolve } from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  // input: ["https://petstore3.swagger.io/api/v3/openapi.json"],
  input: [`${resolve(process.cwd(), "src/openapi.json")}`],
});
