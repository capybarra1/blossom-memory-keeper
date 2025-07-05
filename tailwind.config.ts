
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
				quicksand: ['Quicksand', 'sans-serif'],
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
				// Plant Diary Custom Colors - Enhanced with more vibrant options
				plantDiary: {
					green: '#F2FCE2',
					lightGreen: '#E0FFD1',
					darkGreen: '#4B7F52',  // Added deeper green
					vividGreen: '#75B798', // Added medium green
					yellow: '#FEF7CD',
					brightYellow: '#FDEF96',
					vibrantYellow: '#FFC11E', // Added vibrant yellow
					orange: '#FEC6A1',
					brightOrange: '#FFA66B',
					purple: '#E5DEFF',
					brightPurple: '#C5B4FF',
					pink: '#FFDEE2',
					brightPink: '#FFB6C1',
					peach: '#FDE1D3',
					brightPeach: '#FFCBA4',
					blue: '#D3E4FD',
					brightBlue: '#A6D1FF',
					gray: '#F1F0FB',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow': {
					'0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(254, 215, 102, 0.3))' },
					'50%': { filter: 'drop-shadow(0 0 15px rgba(254, 215, 102, 0.8))' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 4s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'pulse-light': 'pulse-light 3s ease-in-out infinite'
			},
			boxShadow: {
				'inner-light': 'inset 0 1px 3px 0 rgba(255,255,255,0.3)',
				'glow-sm': '0 0 10px rgba(254, 215, 102, 0.3)',
				'glow-md': '0 0 15px rgba(254, 215, 102, 0.5)',
				'soft': '0 5px 15px -3px rgba(0, 0, 0, 0.05)',
				'floating': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

