/**
 * Design tokens for Build Tracker.
 * Dark-first. Neutral palette based on iOS system dark mode, with
 * semantic accent colors for build health signals.
 */
export const theme = {
  color: {
    bg: '#0B0B0F',
    card: '#15151B',
    border: '#232330',
    text: '#F2F2F7',
    textDim: '#8E8E93',
    accent: '#30D158', // healthy build
    warn: '#FF9F0A', // expiring soon
    danger: '#FF453A', // expired
    brand: '#0A84FF',
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 6, md: 10, lg: 14 },
  font: { sm: 13, md: 15, lg: 17, xl: 22, xxl: 28 },
} as const;

export type Theme = typeof theme;
