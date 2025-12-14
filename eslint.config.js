import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import framerMotion from "eslint-plugin-framer-motion"; // ← Added
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist"] }, // modern syntax (replaces globalIgnores)

  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "framer-motion": framerMotion, // ← Register plugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,

      // Optional: Use Framer Motion's recommended rules (highly advised)
      ...framerMotion.configs.recommended.rules,

      // Your custom rule (kept as-is)
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);
