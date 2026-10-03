import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Generates the PNG/ICO app icons from public/icon.svg (run `npm run generate-pwa-assets`).
// The padded variants (maskable, Apple) get the app's dark background instead of white.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, padding: 0.15, resizeOptions: { background: '#0a0a0a' } },
    apple: { ...minimal2023Preset.apple, padding: 0.05, resizeOptions: { background: '#0a0a0a' } },
  },
  images: ['public/icon.svg'],
});
