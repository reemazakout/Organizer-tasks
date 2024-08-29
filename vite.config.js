import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@Componants": path.resolve(__dirname, "./src/Componants"),
      "@Pages": path.resolve(__dirname, "./src/Pages"),
    },
  } ,
  plugins: [react()],
})
