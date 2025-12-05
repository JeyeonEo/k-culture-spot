export type Category = 'drama' | 'kpop' | 'movie' | 'variety';

export interface SpotTip {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

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
  mediaImage?: string;
  relatedContent: RelatedContent[];
  phone?: string;
  website?: string;
  hours?: string;
  tags: string[];
  tips?: SpotTip[];
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

export interface Content {
  id: number;
  title: string;
  titleEn: string;
  titleJa: string;
  titleZh: string;
  type: 'drama' | 'movie' | 'music' | 'variety';
  year?: number;
  imageUrl?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionZh?: string;
}

export interface TourSpot {
  order: number;
  spot: Spot;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionZh?: string;
  travelTimeToNext?: string;
  travelDistanceToNext?: string;
}

export interface Tour {
  id: number;
  title: string;
  titleEn: string;
  titleJa: string;
  titleZh: string;
  subtitle?: string;
  subtitleEn?: string;
  subtitleJa?: string;
  subtitleZh?: string;
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionZh: string;
  imageUrl: string;
  author: string;
  isOfficial: boolean;
  spotCount: number;
  duration: string;
  contentId: number;
  totalDistance?: string;
  spots?: TourSpot[];
}
