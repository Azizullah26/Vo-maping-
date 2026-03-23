let tailwindPlugin;

try {
  // Try Tailwind v4 first
  tailwindPlugin = require("@tailwindcss/postcss");
} catch (e) {
  // Fall back to Tailwind v3
  tailwindPlugin = require("tailwindcss");
}

module.exports = {
  plugins: {
    [tailwindPlugin]: {},
    autoprefixer: {},
  },
};
