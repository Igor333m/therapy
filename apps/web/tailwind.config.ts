import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dae9ff',
          500: '#2b6cb0',
          600: '#1f4f86',
          700: '#183d68'
        }
      }
    }
  },
  plugins: []
};

export default config;
