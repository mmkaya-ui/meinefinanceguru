import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyFinanceGuru',
    short_name: 'MFG',
    description: 'Personal finance and cashflow tracker',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617', // tailwind slate-950
    theme_color: '#020617',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      }
    ],
  };
}
