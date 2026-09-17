import js from "@eslint/js"
import next from "@next/eslint-plugin-next"
import prettier from "eslint-config-prettier"
import react from "eslint-plugin-react"
import hooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
  { ignores: [".next/**", "node_modules/**", "drizzle/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "@next/next": next, "react-hooks": hooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      ...hooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  prettier,
]
