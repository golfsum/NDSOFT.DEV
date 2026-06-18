/**
 * Registry of ND Software apps. Each app gets its own pages at
 * /apps/<slug>, /apps/<slug>/privacy, and /apps/<slug>/terms.
 * Add a new app here and create those routes to list it everywhere
 * (home, privacy hub, terms hub).
 */
export interface AppInfo {
  slug: string;
  name: string;
  tagline: string;
}

export const APPS: AppInfo[] = [
  {
    slug: 'uncrop-it',
    name: 'Uncrop It',
    tagline:
      'Extend any photo beyond its edges with AI, then reframe it to fit anywhere.',
  },
];
