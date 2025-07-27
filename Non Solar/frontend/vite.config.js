import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  server: {
    port:3001,
    proxy: {
      '/forecast-5days': 'http://localhost:8080',
      '/forecast-14day': 'http://localhost:8080',
      '/predict-today' : 'http://localhost:8080'  // ✅ Add this line
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
});
