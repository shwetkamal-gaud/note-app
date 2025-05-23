import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest:{
      name:'Notes App',
      short_name:'Note App',
      description:'Create Notes Online/Offline',
      theme_color:'#1e90ff',
      background_color:'#ffffff',
      display:'standalone',
      start_url:'/',
    }
  }),
  ],
})
