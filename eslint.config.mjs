import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Аналог .eslintignore
    ignores: ["dist/", "node_modules/", "swagger.json"],
  },
  {
    rules: {
      // Запрет console.log (ошибки)
      "no-console": "error",

      // Настройка для неиспользуемых переменных
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // Другие правила по желанию
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
  eslintConfigPrettier
);
