import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(),react()],
  appType: 'spa',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
 server: {
    host: true, // Permite que o servidor seja acessado pela rede
    
    //SEÇÃO PARA PERMITIR O NGROK
    allowedHosts: [
      // Adiciona o domínio principal do ngrok à lista de permissões
      '.ngrok-free.app' 
    ]
  },
})
