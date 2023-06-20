import { defineConfig } from 'vite'
import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
   sourcemap: true,
   outDir: "build"
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  plugins: [reactRefresh()],
  resolve: {
   alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  publicDir: 'src/assets',
  define: {
    "process.env": {},
  },
  server: {
    port: 3069,
    proxy: {
      '/api': {
        target: 'http://localhost:8080'
      }
    }
  }
})
