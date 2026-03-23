// Force lightningcss to use JavaScript implementation (not native bindings)
process.env.LIGHTNINGCSS_WASM = "true";

module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      // Configure @tailwindcss/postcss to be more resilient
      lightningcss: false, // Disable lightningcss if possible
    },
  },
};
