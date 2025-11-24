import globals from "globals";
import js from "@eslint/js";

export default [
  // Global configuration for all JS files
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
    },
  },

  // Configuration specifically for Jest test files
  {
    files: ["tests/integration/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Global ignores
  {
    ignores: ["tests/k6/"],
  },

  // Apply recommended rules
  js.configs.recommended,
];
