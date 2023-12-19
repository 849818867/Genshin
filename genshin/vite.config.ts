import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from "vite-plugin-glsl"

export default defineConfig({
  plugins: [vue(), glsl()]
})