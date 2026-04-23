/**
 * Regenerate BuildPad's app icon, adaptive icon, and splash from a
 * shared SVG template. Run with:
 *   npx tsx scripts/generate-icons.ts
 *
 * Output files are PNGs written to ./assets:
 *   - icon.png           1024x1024  iOS/web app icon
 *   - adaptive-icon.png  1024x1024  Android adaptive foreground
 *   - splash.png         1284x2778  iOS splash
 *
 * The horizontal rules above and below the "BP" use the exact same
 * width as the text — we set `textLength` on the text element and
 * reuse that value for the rule rectangles, so the text is forced to
 * that width regardless of which font renders.
 */
import sharp from 'sharp';
import path from 'node:path';

const BRAND = '#0A84FF';
const BG_DARK = '#0B0B0F';
const INK = '#F2F2F7';

interface BadgeOpts {
  /** Overall canvas size (assumes square unless splash). */
  size: number;
  /** Fill for the badge; if `null`, no rect is drawn (caller provides one). */
  fill: string | null;
  /** Corner radius of the badge rect, or 0 for a square. */
  radius?: number;
  /** Inset from canvas edge (icon assets are bleed-to-edge; set 0). */
  inset?: number;
  /** Fraction of canvas-size the text+rule width should take. */
  widthFraction?: number;
  /** Fraction of canvas-size the "BP" font-size should take. */
  fontFraction?: number;
  /** Offset (fraction of size) between the text center and each rule's center. */
  ruleOffsetFraction?: number;
}

/**
 * Produce the BP-with-rules markup. Returns only the foreground
 * elements — caller composes the background.
 */
function badgeFg({
  size,
  widthFraction = 0.44,
  fontFraction = 0.42,
  ruleOffsetFraction = 0.215,
}: Required<Pick<BadgeOpts, 'size'>> & Partial<BadgeOpts>): string {
  const cx = size / 2;
  const cy = size / 2;
  const width = size * widthFraction;
  const fontSize = size * fontFraction;
  const ruleHeight = Math.max(4, size * 0.025);
  const x = (size - width) / 2;
  const ruleOffset = size * ruleOffsetFraction;

  return `
  <rect x="${x}" y="${cy - ruleOffset - ruleHeight / 2}" width="${width}" height="${ruleHeight}" rx="${ruleHeight / 2}" fill="${INK}"/>
  <text x="${cx}" y="${cy}" fill="${INK}"
        font-family="-apple-system, SF Pro Display, Helvetica Neue, Arial, sans-serif"
        font-weight="800" font-size="${fontSize}"
        text-anchor="middle" dominant-baseline="central"
        textLength="${width}" lengthAdjust="spacingAndGlyphs"
        letter-spacing="-0.02em">BP</text>
  <rect x="${x}" y="${cy + ruleOffset - ruleHeight / 2}" width="${width}" height="${ruleHeight}" rx="${ruleHeight / 2}" fill="${INK}"/>
  `;
}

function iconSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BRAND}"/>
  ${badgeFg({ size, widthFraction: 0.44, fontFraction: 0.42 })}
</svg>`;
}

function adaptiveSvg(size: number): string {
  const cx = size / 2;
  const cy = size / 2;
  // Disc fits inside the Android adaptive-icon safe zone.
  const r = size * 0.34;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG_DARK}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${BRAND}"/>
  ${badgeFg({ size, widthFraction: 0.3, fontFraction: 0.28, ruleOffsetFraction: 0.14 })}
</svg>`;
}

function splashSvg(width: number, height: number): string {
  const badge = Math.min(width, height) * 0.22;
  const bx = (width - badge) / 2;
  const by = (height - badge) / 2;
  const radius = badge * 0.22;
  const cx = width / 2;
  const cy = height / 2;
  const textWidth = badge * 0.44;
  const fontSize = badge * 0.42;
  const ruleHeight = Math.max(3, badge * 0.025);
  const ruleX = (width - textWidth) / 2;
  const ruleOffset = badge * 0.215;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${BG_DARK}"/>
  <rect x="${bx}" y="${by}" width="${badge}" height="${badge}" rx="${radius}" ry="${radius}" fill="${BRAND}"/>
  <rect x="${ruleX}" y="${cy - ruleOffset - ruleHeight / 2}" width="${textWidth}" height="${ruleHeight}" rx="${ruleHeight / 2}" fill="${INK}"/>
  <text x="${cx}" y="${cy}" fill="${INK}"
        font-family="-apple-system, SF Pro Display, Helvetica Neue, Arial, sans-serif"
        font-weight="800" font-size="${fontSize}"
        text-anchor="middle" dominant-baseline="central"
        textLength="${textWidth}" lengthAdjust="spacingAndGlyphs"
        letter-spacing="-0.02em">BP</text>
  <rect x="${ruleX}" y="${cy + ruleOffset - ruleHeight / 2}" width="${textWidth}" height="${ruleHeight}" rx="${ruleHeight / 2}" fill="${INK}"/>
</svg>`;
}

async function renderToPng(svg: string, outPath: string): Promise<void> {
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log('wrote', outPath);
}

async function main() {
  const assets = path.resolve(process.cwd(), 'assets');
  await renderToPng(iconSvg(1024), path.join(assets, 'icon.png'));
  await renderToPng(adaptiveSvg(1024), path.join(assets, 'adaptive-icon.png'));
  await renderToPng(splashSvg(1284, 2778), path.join(assets, 'splash.png'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
