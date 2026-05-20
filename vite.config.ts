/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

/**
 * Rollup v4 encodes '#' as a URL fragment when constructing internal module
 * IDs, which breaks resolution when the project lives in a directory whose
 * path contains '#' (e.g. "# kvadrat/kvadrat-pris").
 * This plugin resolves relative imports via Node's native fs APIs, which
 * handle '#' in filesystem paths correctly.
 */
function hashPathFix() {
  return {
    name: "hash-path-fix",
    resolveId: {
      order: "pre" as const,
      handler(source: string, importer: string | undefined) {
        if (
          !importer ||
          !source.startsWith(".") ||
          importer.includes("node_modules") ||
          importer.startsWith("\0")
        ) {
          return null
        }

        const importerDir = path.isAbsolute(importer)
          ? path.dirname(importer)
          : path.resolve(path.dirname(importer))

        const base = path.resolve(importerDir, source)

        for (const ext of [
          "",
          ".tsx",
          ".ts",
          ".jsx",
          ".js",
          "/index.tsx",
          "/index.ts",
          "/index.js",
        ]) {
          const fullPath = base + ext
          try {
            if (fs.statSync(fullPath).isFile()) return fullPath
          } catch {
            /* not found, try next extension */
          }
        }
        return null
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), hashPathFix()],
  base: "/kvadrat-pris/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
})

