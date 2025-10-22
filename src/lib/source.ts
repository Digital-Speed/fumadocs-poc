import { loader } from "fumadocs-core/source";
import { openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { openapi } from "@/lib/openapi";

const apiSource = await openapiSource(openapi, {
  baseDir: "docs",
});

export const source = loader(apiSource, {
  baseUrl: "/docs",
  plugins: [openapiPlugin()],
});
