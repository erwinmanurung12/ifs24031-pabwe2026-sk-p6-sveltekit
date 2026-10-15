import { sveltekit } from "@sveltejs/kit/vite";
import bunAdapter from "@sveltejs/adapter-bun";
import vercelAdapter from "@sveltejs/adapter-vercel";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig, loadEnv } from "vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(process.env.APP_PORT || env.APP_PORT) || 3005;

  // URL API Delcom. Saat build produksi, nilai yang menunjuk ke localhost (mis. salin dari
  // .env.example) diabaikan, dan http:// dinaikkan ke https:// agar tidak diblokir browser
  // (mixed content) -> penyebab "Failed to fetch" saat login di situs yang sudah dideploy.
  const DEFAULT_BASEURL = "https://open-api.delcom.org/api/v1";
  const configuredBaseUrl = (process.env.VITE_DELCOM_BASEURL || env.VITE_DELCOM_BASEURL || "").trim();
  const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(configuredBaseUrl);
  let baseUrl = configuredBaseUrl || DEFAULT_BASEURL;
  if (mode === "production") {
    baseUrl = isLocalUrl ? DEFAULT_BASEURL : baseUrl.replace(/^http:\/\//i, "https://");
  }
  baseUrl = baseUrl.replace(/\/+$/, "");

  // Vercel mengisi variabel VERCEL saat build, Jenkins tidak.
  const isVercel = Boolean(process.env.VERCEL);

  return {
    plugins: [
      sveltekit({
        adapter: isVercel
          ? vercelAdapter()
          : bunAdapter({
              envPrefix: "APP_",
              serverOptions: {
                port: port,
              },
            }),
        inlineStyleThreshold: 20000,
      }),
      tailwindcss(),
      svelteTesting(),
    ],
    server: {
      port: port,
    },
    preview: {
      port: port,
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(baseUrl),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.{test,spec}.{js,ts}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,svelte}"],
        exclude: [
          "node_modules/",
          "src/setupTests.ts",
          "src/test-utils.ts",
          "src/routes/**/+error.svelte",
          "**/*.d.ts",
        ],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  };
});