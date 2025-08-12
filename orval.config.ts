import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./api-docs.json",
    output: {
      mode: "single",
      target: "./src/api/generated-api.ts",
      client: "axios",
      httpClient: "axios",
      baseUrl: "http://localhost:3000",
      prettier: false,
      override: {
        mutator: {
          path: "./src/api/api-client.ts",
          name: "customAxiosInstance",
        },
      },
    },
  },
});
