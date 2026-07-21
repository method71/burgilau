import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  base: "/burgilau/",
  plugins: [
    ViteImageOptimizer({
      test: /\.(jpe?g|png|webp)$/i,
      png: {
        compressionLevel: 9,
        quality: 82,
      },
      jpeg: {
        mozjpeg: true,
        quality: 82,
      },
      jpg: {
        mozjpeg: true,
        quality: 82,
      },
      webp: {
        effort: 6,
        quality: 82,
      },
    }),
  ],
});
