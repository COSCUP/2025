import { converter } from 'culori'

const toOklch = converter('oklch')

/**
 * Converts a hex color string to an OKLCH color object.
 *
 * @param hex - The hex color string (e.g., '#RRGGBB').
 * @returns The OKLCH color object or undefined if parsing fails.
 */
function hexToOklch(hex: string) {
  return toOklch(hex)
}

export interface ColorPalette {
  // Base colors
  '--c-bg': string
  '--c-border': string
  '--c-text': string

  // Active state colors
  '--c-active-border': string

  // Bookmarked state colors
  '--c-bm-bg': string
  '--c-bm-border': string
  '--c-bm-text': string
  '--c-bm-active-border': string

  // Tag colors
  '--c-tag-bg': string
  '--c-tag-text': string

  // Bookmarked tag colors
  '--c-bm-tag-bg': string
  '--c-bm-tag-text': string

  // Bookmark icon colors
  '--c-icon-bg': string
  '--c-icon-text': string
  '--c-icon-hover-bg': string
  '--c-icon-hover-text': string

  // Bookmarked bookmark icon colors
  '--c-bm-icon-bg': string
  '--c-bm-icon-text': string
  '--c-bm-icon-hover-bg': string
  '--c-bm-icon-hover-text': string
}

/**
 * Generates a color palette from a base hex color using OKLCH color space.
 *
 * @param baseHex - The base hex color (e.g., '#RRGGBB').
 * @returns A CSS variable-based color palette.
 */
export function generateColorPalette(baseHex: string): ColorPalette {
  const baseOklch = hexToOklch(baseHex)
  if (!baseOklch) {
    // Return a default palette if conversion fails
    return {
      '--c-bg': 'oklch(0.92 0.05 280)',
      '--c-border': 'oklch(0.85 0.08 280)',
      '--c-text': 'oklch(0.45 0.12 280)',
      '--c-active-border': 'oklch(0.65 0.15 280)',
      '--c-bm-bg': 'oklch(0.95 0.05 330)',
      '--c-bm-border': 'oklch(0.9 0.08 330)',
      '--c-bm-text': 'oklch(0.6 0.15 330)',
      '--c-bm-active-border': 'oklch(0.75 0.2 330)',
      '--c-tag-bg': 'oklch(0.65 0.15 280)',
      '--c-tag-text': 'oklch(0.95 0.02 280)',
      '--c-bm-tag-bg': 'oklch(0.85 0.15 320)',
      '--c-bm-tag-text': 'oklch(0.45 0.15 320)',
      '--c-icon-bg': 'transparent',
      '--c-icon-text': `oklch(0.65 0.15 280)`,
      '--c-icon-hover-bg': `oklch(0.85 0.08 280)`,
      '--c-icon-hover-text': `oklch(0.55 0.15 280)`,
      '--c-bm-icon-bg': 'oklch(0.75 0.2 320)',
      '--c-bm-icon-text': 'oklch(0.75 0.2 320)',
      '--c-bm-icon-hover-bg': 'oklch(0.65 0.2 320)',
      '--c-bm-icon-hover-text': 'oklch(0.65 0.2 320)',
    }
  }

  const { c, h } = baseOklch
  const hue = h || 280 // Default hue if undefined

  const bookmarkedIconHue = 315

  // Chroma can be low for grayscale colors, so we set a minimum.
  const chroma = Math.max(c, 0.05)

  return {
    // Base colors
    '--c-bg': `oklch(0.95 ${chroma * 0.5} ${hue})`,
    '--c-border': `oklch(0.90 ${chroma * 0.6} ${hue})`,
    '--c-text': `oklch(0.40 ${chroma * 0.9} ${hue})`,

    // Active state colors
    '--c-active-border': `oklch(0.70 ${chroma} ${hue})`,

    // Bookmarked state colors - vivid tint of the base color
    '--c-bm-bg': `oklch(0.94 ${Math.min(chroma * 0.9, 0.22)} ${hue})`,
    '--c-bm-border': `oklch(0.88 ${Math.min(chroma * 1.1, 0.28)} ${hue})`,
    '--c-bm-text': `oklch(0.30 ${Math.min(chroma * 1.4, 0.32)} ${hue})`,
    '--c-bm-active-border': `oklch(0.72 ${Math.min(chroma * 1.5, 0.35)} ${hue})`,

    // Tag colors
    '--c-tag-bg': `oklch(0.68 ${chroma} ${hue})`,
    '--c-tag-text': `oklch(0.99 0.015 ${hue})`,

    // Bookmarked tag colors - vivid tint
    '--c-bm-tag-bg': `oklch(0.86 ${Math.min(chroma * 1.0, 0.30)} ${hue})`,
    '--c-bm-tag-text': `oklch(0.30 ${Math.min(chroma * 1.3, 0.34)} ${hue})`,

    // Bookmark icon colors
    '--c-icon-bg': 'transparent',
    '--c-icon-text': `oklch(0.65 ${chroma} ${hue})`,
    '--c-icon-hover-bg': `oklch(0.92 ${chroma * 0.4} ${hue})`,
    '--c-icon-hover-text': `oklch(0.55 ${chroma * 1.1} ${hue})`,

    // Bookmarked bookmark icon colors
    '--c-bm-icon-bg': `oklch(0.78 0.20 ${bookmarkedIconHue})`,
    '--c-bm-icon-text': `oklch(0.78 0.20 ${bookmarkedIconHue})`,
    '--c-bm-icon-hover-bg': `oklch(0.72 0.24 ${bookmarkedIconHue})`,
    '--c-bm-icon-hover-text': `oklch(0.72 0.24 ${bookmarkedIconHue})`,
  }
}
