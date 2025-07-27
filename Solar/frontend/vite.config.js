import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/live-sensor-data': 'http://localhost:5000',
      '/solar-data': 'http://localhost:5000',
      '/train-5day': 'http://localhost:5000',
      '/forecast-5days': 'http://localhost:5000',
      '/forecast-extremes': 'http://localhost:5000',
      '/current-extremes': 'http://localhost:5000',
      '/live-extremes': 'http://localhost:5000',
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),  // 👈 Now properly formatted as array
        autoprefixer()
      ]
    }
  }
});