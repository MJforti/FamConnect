
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'retro': ['Courier New', 'Monaco', 'Menlo', 'monospace'],
				'retro-display': ['Impact', 'Arial Black', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				family: {
					warm: 'hsl(var(--family-warm))',
					'warm-foreground': 'hsl(var(--family-warm-foreground))',
					love: 'hsl(var(--family-love))',
					'love-foreground': 'hsl(var(--family-love-foreground))',
					connection: 'hsl(var(--family-connection))',
					'connection-foreground': 'hsl(var(--family-connection-foreground))'
				},
				retro: {
					orange: 'hsl(35, 70%, 45%)',
					burnt: 'hsl(25, 60%, 50%)',
					gold: 'hsl(50, 75%, 35%)',
					red: 'hsl(15, 80%, 60%)',
					brown: 'hsl(30, 40%, 25%)',
					cream: 'hsl(45, 60%, 85%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'retro-gradient-shift': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'25%': {
						backgroundPosition: '100% 0%'
					},
					'50%': {
						backgroundPosition: '100% 100%'
					},
					'75%': {
						backgroundPosition: '0% 100%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				},
				'retro-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(255, 180, 100, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(255, 180, 100, 0.8)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'retro-gradient-shift': 'retro-gradient-shift 10s ease infinite',
				'retro-glow': 'retro-glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
