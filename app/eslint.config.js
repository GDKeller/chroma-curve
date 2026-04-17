import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
      betterTailwindcss.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
        node: true,
      },
      "better-tailwindcss": {
        entryPoint: "src/index.css",
      },
    },
    rules: {
      /* Built-in */
      "max-lines": [
        "error",
        {
          max: 1100 /* goal: 300 */,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": [
        "error",
        {
          max: 400 /* goal: 50 */,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      "max-statements": ["error", 50], // goal: 20
      complexity: ["error", 12],

      /* Import Plugin */
      "import/no-duplicates": "error",
      "import/no-cycle": ["error", { maxDepth: 3 }],
      "import/max-dependencies": ["warn", { max: 20 }],
      "import/no-default-export": "error",

      /* React Plugin */
      "react/function-component-definition": [
        "warn",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      // "react/no-multi-comp": ["error", { ignoreStateless: false }], // Will be implemented, throws errors for consolidated commit
      // "react/jsx-max-depth": ["error", { max: 5 }], // Will be implemented, throws errors for consolidated commit

      /* Better Tailwind — overrides on top of "recommended" */
      "better-tailwindcss/enforce-consistent-class-order": "off", // Prettier plugin handles class order
      "better-tailwindcss/enforce-consistent-line-wrapping": "off", // Relying on editor soft-wrapping for now
    },
  },
  {
    files: [
      "src/pages/**/*.{ts,tsx,astro}",
      "src/layouts/**/*.{ts,tsx,astro}",
      "**/*.config.{js,ts,mjs}",
      "astro.config.*",
      "vite.config.*",
      "next.config.*",
    ],
    rules: {
      "import/no-default-export": "off",
      "max-lines": "off",
    },
  },
]);
