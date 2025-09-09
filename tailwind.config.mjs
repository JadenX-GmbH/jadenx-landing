/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				'primary-hover': 'var(--color-primary-hover)',
				'primary-light': 'var(--color-primary-light)',
				background: 'var(--color-background)',
				grey: {
					900: 'var(--color-grey-900)',
					800: 'var(--color-grey-800)',
					700: 'var(--color-grey-700)',
					600: 'var(--color-grey-600)',
					500: 'var(--color-grey-500)',
					400: 'var(--color-grey-400)',
					300: 'var(--color-grey-300)',
					200: 'var(--color-grey-200)',
					100: 'var(--color-grey-100)',
				},
			},
		},
	},
	plugins: [],
}
