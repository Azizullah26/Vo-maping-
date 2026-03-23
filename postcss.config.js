// Force lightningcss to skip native binary and use fallback
process.env.LIGHTNINGCSS_SKIP_NATIVE = "1";

module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
