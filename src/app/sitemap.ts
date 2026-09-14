import { MetadataRoute } from 'next'
import { storeData } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const products = storeData.products.map((product) => ({
    url: `https://groundculture.com.br/produto/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://groundculture.com.br',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://groundculture.com.br/produtos',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://groundculture.com.br/sobre',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://groundculture.com.br/contato',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...products,
  ]
}
