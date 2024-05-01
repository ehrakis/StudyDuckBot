import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    "env": {
        "node": true,
        "commonjs": true
    }
  },
  {
    "rules" : {
      "no-console": "error",
      "quotes": [
          "error",
          "double",
      ],
      "no-unused-vars": "off",
      }
  }
];