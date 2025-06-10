import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // أو vue لو بتستخدم Vue

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ✅ ده اللي بيخلي Vite يشتغل على http://localhost:3000
  },
});
