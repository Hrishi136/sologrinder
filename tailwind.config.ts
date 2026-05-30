
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '320px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			fontFamily: {
				orbitron: ['Orbitron', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				system: {
					bg: '#0a0a0a',
					blue: '#00d4ff',
					blue2: '#0080ff',
					panel: 'rgba(10,10,22,0.94)', // add: alias for panel
					panelBg: 'rgba(10,10,22,0.92)', // keep original for backwards compatibility
					glow: '#00e0ff',
				},
				'system-panel': 'rgba(10,10,22,0.94)', // <--- this key enables bg-system-panel
				border: 'hsl(var(--border))',
				foreground: 'hsl(var(--foreground))',
			},
			boxShadow: {
				'blue-glow': '0 0 24px 2px #00d4ff, 0 0 48px 8px #0080ff90',
			},
			backgroundImage: {
				'particles': "radial-gradient(circle at 20% 20%, #00d4ff33 1%, transparent 60%), radial-gradient(circle at 80% 80%, #0080ff22 1%, transparent 60%)"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

