import { resolve } from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";
import {
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "fumadocs-ui/components/codeblock";

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  // input: ["https://petstore3.swagger.io/api/v3/openapi.json"],
  input: [`${resolve(process.cwd(), "src/openapi.json")}`],
  renderer: {
    Requests: ({ items = [], children }) => {
      const defaultValue = items[0];

      const logos: Record<
        string,
        {
          label: string;
          className: string;
        }
      > = {
        javascript: { label: "JS", className: "bg-[#F7DF1E] text-black" },
        typescript: { label: "TS", className: "bg-[#3178C6] text-white" },
        python: { label: "Py", className: "bg-[#3776AB] text-white" },
        go: { label: "Go", className: "bg-[#00ADD8] text-white" },
        ruby: { label: "Rb", className: "bg-[#CC342D] text-white" },
        java: { label: "Java", className: "bg-[#007396] text-white" },
        curl: { label: "curl", className: "bg-[#4A5568] text-white" },
      };

      return (
        <CodeBlockTabs
          groupId="fumadocs_openapi_requests"
          defaultValue={defaultValue}
        >
          <CodeBlockTabsList>
            {items.map((item) => {
              const normalized = item.trim().toLowerCase();
              const logo = logos[normalized] ?? {
                label: "API",
                className: "bg-fd-primary text-black",
              };
              return (
                <CodeBlockTabsTrigger
                  key={item}
                  value={item}
                  className="flex flex-col items-center gap-2 text-xs"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold ${logo.className}`}
                  >
                    {logo.label}
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </CodeBlockTabsTrigger>
              );
            })}
          </CodeBlockTabsList>
          {children}
        </CodeBlockTabs>
      );
    },
  },
});
