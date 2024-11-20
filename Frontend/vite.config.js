import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       'js-cookie': path.resolve(__dirname, 'node_modules/js-cookie')
//     }
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom', 'js-cookie'],
//   },
// });
