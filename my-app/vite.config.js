import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//https://vite.dev/config/
//         #cert: '/www/www_pydagoras_com.crt',
//         #key: '/www/www_pydagoras_com.key'
export default defineConfig({

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },



  plugins: [react()],

     server: {
       port: 443,
//       https: {
//         cert: 'certs/www_pydagoras_com.crt',
//         key: 'certs/www_pydagoras_com.key'
//       }
     }

})
