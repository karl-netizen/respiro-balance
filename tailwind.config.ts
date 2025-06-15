
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
			padding: {
				DEFAULT: '1rem',
				sm: '1rem',
				md: '1.5rem',
				lg: '2rem',
				xl: '2rem',
				'2xl': '2rem',
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px'
			}
		},
		extend: {
			screens: {
				'xs': '475px',
				'3xl': '1600px',
				// Touch device specific breakpoints
				'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
				'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
			},
			spacing: {
				// Brand-consistent spacing scale
				'brand-xs': 'var(--spacing-xs)',
				'brand-sm': 'var(--spacing-sm)',
				'brand-md': 'var(--spacing-md)',
				'brand-lg': 'var(--spacing-lg)',
				'brand-xl': 'var(--spacing-xl)',
				'brand-2xl': 'var(--spacing-2xl)',
				'brand-3xl': 'var(--spacing-3xl)',
				// Touch-friendly sizes
				'touch-target': 'var(--touch-target-min)',
				'touch-gap': 'var(--touch-spacing-min)',
				// Device-specific spacing
				'mobile-xs': 'var(--mobile-spacing-xs)',
				'mobile-sm': 'var(--mobile-spacing-sm)',
				'mobile-md': 'var(--mobile-spacing-md)',
				'mobile-lg': 'var(--mobile-spacing-lg)',
				'mobile-xl': 'var(--mobile-spacing-xl)',
				'tablet-xs': 'var(--tablet-spacing-xs)',
				'tablet-sm': 'var(--tablet-spacing-sm)',
				'tablet-md': 'var(--tablet-spacing-md)',
				'tablet-lg': 'var(--tablet-spacing-lg)',
				'tablet-xl': 'var(--tablet-spacing-xl)',
				'desktop-xs': 'var(--desktop-spacing-xs)',
				'desktop-sm': 'var(--desktop-spacing-sm)',
				'desktop-md': 'var(--desktop-spacing-md)',
				'desktop-lg': 'var(--desktop-spacing-lg)',
				'desktop-xl': 'var(--desktop-spacing-xl)',
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				respiro: {
					light: '#E0F2F1',
					DEFAULT: '#4DB6AC',
					dark: '#00897B',
					darker: '#00695C',
					text: '#263238'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontSize: {
				// Responsive typography scale
				'brand-xs': ['var(--font-size-xs)', { lineHeight: '1.4' }],
				'brand-sm': ['var(--font-size-sm)', { lineHeight: '1.5' }],
				'brand-base': ['var(--font-size-base)', { lineHeight: '1.6' }],
				'brand-lg': ['var(--font-size-lg)', { lineHeight: '1.6' }],
				'brand-xl': ['var(--font-size-xl)', { lineHeight: '1.4' }],
				'brand-2xl': ['var(--font-size-2xl)', { lineHeight: '1.3' }],
				'brand-3xl': ['var(--font-size-3xl)', { lineHeight: '1.2' }],
				'brand-4xl': ['var(--font-size-4xl)', { lineHeight: '1.1' }],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				pulse: {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				breathe: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.2)' }
				},
				'float-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-right': {
					'0%': { transform: 'translateX(-10px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				// Touch interaction animations
				'touch-feedback': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'mobile-slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'mobile-slide-down': {
					'0%': { transform: 'translateY(0)', opacity: '1' },
					'100%': { transform: 'translateY(100%)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'pulse-slow': 'pulse 4s infinite ease-in-out',
				breathe: 'breathe 4s infinite ease-in-out',
				'float-up': 'float-up 0.8s ease-out',
				'slide-in': 'slide-in 0.5s ease-out',
				'slide-right': 'slide-right 0.5s ease-out',
				'touch-feedback': 'touch-feedback 0.2s ease-out',
				'mobile-slide-up': 'mobile-slide-up 0.3s ease-out',
				'mobile-slide-down': 'mobile-slide-down 0.3s ease-out'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			gridTemplateColumns: {
				// Custom grid patterns for different devices
				'mobile-safe': '1fr',
				'tablet-safe': 'repeat(auto-fit, minmax(300px, 1fr))',
				'desktop-safe': 'repeat(auto-fit, minmax(350px, 1fr))',
			},
			minHeight: {
				'touch-target': 'var(--touch-target-min)',
				'mobile-section': '50vh',
				'tablet-section': '40vh',
				'desktop-section': '30vh',
			},
			maxWidth: {
				'mobile-content': '100%',
				'tablet-content': '768px',
				'desktop-content': '1200px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
