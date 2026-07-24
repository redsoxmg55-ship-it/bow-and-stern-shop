import { MetadataRoute } from 'next';
import { BS_PRODUCTS } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://shopbowandsternsoap.com';

  const products = BS_PRODUCTS.map(p => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/private-clients`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/customize`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...products,
  ];
}
