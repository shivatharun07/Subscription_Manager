// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isProduction = mode === 'production';
  
  // In production, use the VITE_API_URL from environment variables
  // In development, use the proxy to avoid CORS issues
  const apiUrl = isProduction ? env.VITE_API_URL : 'http://localhost:5000';
  
  return {
    plugins: [react()],
    base: '/',
    define: {
      'process.env': { ...env, VITE_API_URL: apiUrl }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      }
    }
  };
});