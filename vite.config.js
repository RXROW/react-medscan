import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; 

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "UNRESOLVED_IMPORT") return;  
        warn(warning);
      },
    },
  },
});
