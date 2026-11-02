// Builds the whole app into ONE self-contained index.html (no separate JS/CSS files).
// Used for hosts that take a single page. Run: npm run build:single
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { outDir: 'dist-single', emptyOutDir: true },
})
