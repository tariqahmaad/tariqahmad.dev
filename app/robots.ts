import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Never disallow /_next/: Googlebot needs the JS/CSS chunks to render
      // this fully client-animated site. Blocking them degrades indexing.
      disallow: ['/api/'],
    },
    sitemap: 'https://tariqahmad.dev/sitemap.xml',
  }
}
