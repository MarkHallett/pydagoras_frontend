import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

     server: {
       port: 443,
       https: {
         cert: '../../../certs/www_pydagoras_com.crt',
         key: '../../../certs/www_pydagoras_com.key'
       }
     }

})
