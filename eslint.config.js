import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "playwright-report",
      "test-results",
      "test-screenshots",
      "supabase/.temp",
    ],
  },
  js.configs.recommended,
  // TS/TSX: браузерное окружение
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: false,
      },
      globals: {
        ...globals.browser,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TS
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Отключаем core-правило в пользу TS-версии
      "no-unused-vars": "off",

      // Imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
  // Node окружение для конфигов/скриптов
  {
    files: [
      "*.config.*",
      "**/*.config.*",
      "vite.config.*",
      "playwright.config.*",
      "postcss.config.*",
      "tailwind.config.*",
      "scripts/**/*.*",
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Разрешаем console в конфигурациях
      "no-console": "off",
    },
  },
  // Тесты (Playwright): Node-глобалы, отключаем no-unused-vars
  {
    files: [
      "tests/**/*.*",
      "**/*.spec.*",
      "**/*.test.*",
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
  // Supabase Edge/Deno функции
  {
    files: [
      "supabase/functions/**/*.*",
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.deno,
        Deno: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
  // Disable stylistic conflicts
  prettier,
];