import { defineConfig, presetIcons, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  presets: [
    presetUno({
      prefix: "un:",
    }),
    presetIcons({
      collections: {
        mdi: () =>
          import("@iconify-json/mdi/icons.json").then((res) => res.default),
      },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        inter: ["Inter", "Inter:100..900"],
      },
    }),
  ],
});
