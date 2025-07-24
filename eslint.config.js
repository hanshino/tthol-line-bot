const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  // 忽略的文件和目錄
  {
    ignores: ["node_modules/**", "dist/**"],
  },

  // 基本配置 - 適用於所有 JavaScript 文件
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        // Node.js 全域變數
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        exports: "readonly",
        global: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": [
        "error",
        {
          trailingComma: "es5",
          singleQuote: false,
        },
      ],
    },
  },

  // 測試文件特殊配置
  {
    files: ["**/*.test.js", "test/**/*.js"],
    languageOptions: {
      globals: {
        // Jest 全域變數
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        jest: "readonly",
        test: "readonly",
      },
    },
  },
];
