/** @type {import("eslint").Linter.Config} */
const config = {
  plugins: ["@typescript-eslint"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};

module.exports = config;
