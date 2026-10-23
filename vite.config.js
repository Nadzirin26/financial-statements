import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],build:{rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules')){if(/recharts|d3-|victory|react-smooth|decimal/.test(id))return 'charts';if(/core-js/.test(id))return 'polyfills';if(/html2canvas/.test(id))return 'canvas';if(/canvg|rgbcolor|stackblur/.test(id))return 'svg';if(/jspdf|fflate|fast-png|iobuffer|pako|raf|core-js|dompurify/.test(id))return 'pdf';return 'vendor';}}}}}});
