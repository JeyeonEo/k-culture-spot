export type Category = 'drama' | 'kpop' | 'movie' | 'variety';

export interface Spot {
  id: number;
  name: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionZh: string;
  address: string;
  addressEn: string;
  latitude: number;
  longitude: number;
  category: Category;
  imageUrl: string;
  images: string[];
  relatedContent: RelatedContent[];
  phone?: string;
  website?: string;
  hours?: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedContent {
  id: number;
  title: string;
  titleEn: string;
  titleJa: string;
  titleZh: string;
  type: 'drama' | 'movie' | 'music' | 'variety';
  year?: number;
  imageUrl?: string;
}

export interface SpotListResponse {
  spots: Spot[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  category?: Category;
  page?: number;
  pageSize?: number;
}
