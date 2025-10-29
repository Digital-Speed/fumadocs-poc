import { createOpenAPI } from "fumadocs-openapi/server";
import { API as DefaultAPI } from "fumadocs-openapi/ui";
import type { MethodInformation } from "fumadocs-openapi";
import type { OpenAPIV3 } from "openapi-types";
import nightOwl from "shiki/themes/night-owl.mjs";
import type { ComponentProps, ReactElement } from "react";
import { Children, isValidElement } from "react";
import { OpenAPIRequestProvider } from "@/lib/openapi-request-context";
import { Requests } from "@/components/openapi/requests";
import openapiJson from "./openapi.json";
import openapiCopyJson from "./openapi-copy.json";

export const localOpenAPISpecs = {
  petstore: openapiJson as unknown as OpenAPIV3.Document,
  "petstore-duplicate": openapiCopyJson as unknown as OpenAPIV3.Document,
};

export type LocalOpenAPISpecId = keyof typeof localOpenAPISpecs;

const APIWithRequestContext = ({
  children,
  ...props
}: ComponentProps<typeof DefaultAPI>) => {
  const slots = Children.toArray(children);
  const info = slots.find(
    (child): child is ReactElement<{ route?: string; method?: string }> =>
      isValidElement(child) && "route" in child.props && "method" in child.props,
  );
  const example = slots.find(
    (
      child,
    ): child is ReactElement<{
      method?: MethodInformation;
    }> =>
      isValidElement(child) &&
      "method" in child.props &&
      typeof child.props.method === "object",
  );

  return (
    <OpenAPIRequestProvider
      value={{
        path: info?.props.route,
        method: info?.props.method,
        operation: example?.props.method,
      }}
    >
      <DefaultAPI {...props}>{children}</DefaultAPI>
    </OpenAPIRequestProvider>
  );
};

export const openapi = createOpenAPI({
  input: async () => localOpenAPISpecs,
  shikiOptions: {
    theme: nightOwl,
  },
  renderer: {
    API: APIWithRequestContext,
    Requests,
  },
});
