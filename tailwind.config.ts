import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { brand: { orange: '#ff6b00', ink: '#101010', panel: '#191919' } }, boxShadow: { glow: '0 10px 35px rgba(255,107,0,.16)' } } },
  plugins: []
};
export default config;
