// Detect whether @tailwindcss/postcss (v4) is installed; fall back to tailwindcss (v3).
function tailwindPluginName() {
  try {
    require.resolve("@tailwindcss/postcss");
    return "@tailwindcss/postcss";
  } catch (_) {
    return "tailwindcss";
  }
}

const plugins = {};
plugins[tailwindPluginName()] = {};
plugins["autoprefixer"] = {};

module.exports = { plugins };
