import { resolve } from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";
import { Tabs } from "fumadocs-ui/components/tabs.unstyled";

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  // input: ["https://petstore3.swagger.io/api/v3/openapi.json"],
  input: [`${resolve(process.cwd(), "src/openapi.json")}`],
  renderer: {
    Requests: (props) => {
      return <Tabs>{props.children}</Tabs>;
    },
  },
  generateCodeSamples(endpoint) {
    return [
      {
        lang: "javascript",
        code: "console.log('Hello, world!')",
        source:
          "https://github.com/fumadocs/fumadocs/tree/main/examples/javascript",
        label: "JavaScript SDK",
        icon: "javascript",
      },
    ];
  },
});
