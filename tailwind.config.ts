import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{html,ts}', // include all Angular HTML + TS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
