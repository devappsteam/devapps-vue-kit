import { defineConfig } from "tsup";
import vuePlugin from "esbuild-plugin-vue3";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ui: "src/ui.ts",
    "cli/index": "src/cli/index.ts",
  },

  format: ["esm", "cjs"],

  // Disable tsup dts generation because it fails with .vue files
  dts: false,

  sourcemap: true,

  clean: true,

  splitting: false,

  external: ["vue", "pinia", "vue-router"],

  esbuildPlugins: [vuePlugin()],
});
