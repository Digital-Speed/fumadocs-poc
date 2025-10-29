import type { MethodInformation } from "fumadocs-openapi";
import { createContext, useContext } from "react";

export interface OpenAPIRequestContextValue {
  path?: string;
  method?: string;
  operation?: MethodInformation;
}

export const OpenAPIRequestContext = createContext<
  OpenAPIRequestContextValue | undefined
>(undefined);

interface OpenAPIRequestProviderProps {
  readonly value: OpenAPIRequestContextValue;
  readonly children: React.ReactNode;
}

export function OpenAPIRequestProvider({
  value,
  children,
}: OpenAPIRequestProviderProps) {
  return (
    <OpenAPIRequestContext.Provider value={value}>
      {children}
    </OpenAPIRequestContext.Provider>
  );
}

export function useOpenAPIRequestContext() {
  return useContext(OpenAPIRequestContext);
}
