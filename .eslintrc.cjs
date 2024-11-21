module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  plugins: [],
  rules: {
    "import/first": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
    camelcase: "off",
  },
};
