import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://faxas.net';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = [];
  
  try {
    const projectsQuery = query(
      collection(db, 'projects'),
      where('status', '==', 'completed')
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    
    projectPages = projectsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        url: `${baseUrl}/projects/${data.slug}`,
        lastModified: data.updatedAt?.toDate() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: data.featured ? 0.8 : 0.7,
      };
    });
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
    // Fallback to sample project URLs if Firebase fails
    projectPages = [
      {
        url: `${baseUrl}/projects/ecommerce-dashboard`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/projects/booking-platform`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/projects/analytics-dashboard`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ];
  }

  return [...staticPages, ...projectPages];
}