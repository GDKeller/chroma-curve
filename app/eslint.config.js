import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
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
    },
    rules: {
      "max-lines": [
        "error",
        {
          max: 1100, // goal: 300
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": [
        "error",
        {
          max: 400, // goal: 50
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      "max-statements": ["error", 50], // goal: 20
      complexity: ["error", 12],
      "import/no-duplicates": "error",
      "import/no-cycle": ["error", { maxDepth: 3 }],
      "import/max-dependencies": ["warn", { max: 20 }],
      "react/function-component-definition": [
        "warn", {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        }
      ],
      "import/no-default-export": "error",
      // "react/no-multi-comp": ["error", { ignoreStateless: false }],
      // "react/jsx-max-depth": ["error", { max: 5 }],
    },
  },
  {
    files: [
      "src/pages/**/*.{ts,tsx,astro}",
      "src/layouts/**/*.{ts,tsx,astro}",
      "**/*.config.{js,ts,mjs}",
      "astro.config.*",
      "tailwind.config.*",
      "vite.config.*",
      "next.config.*",
    ],
    rules: {
      "import/no-default-export": "off",
      "max-lines": "off",
    },
  },
]);
