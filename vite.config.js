import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [glsl()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  server: { open: true, port: 3000 },
  build: { outDir: 'dist', sourcemap: true },
})

