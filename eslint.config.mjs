import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default {
  // Definición de los archivos a los que aplica la configuración
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,ts}"],
      languageOptions: {
        parser: tsParser, // Configurar TypeScript parser
        sourceType: "module", // Usar el sourceType adecuado
      },
    },
    {
      files: ["**/*.ts"],
      languageOptions: {
        parser: tsParser,
        sourceType: "module", // Para TypeScript, usar módulo
      },
    },
  ],

  languageOptions: {
    // Definir los entornos y globales
    globals: { ...globals.browser, ...globals.node },
  },

  plugins: [
    "@typescript-eslint", // Plugin para TypeScript
  ],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Configuración recomendada de TypeScript
  ],

  // Reglas adicionales
  rules: {
    // Tus reglas personalizadas aquí, por ejemplo:
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
  },
};