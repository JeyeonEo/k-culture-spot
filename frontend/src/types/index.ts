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

export type ContentType = 'drama' | 'movie' | 'music' | 'variety';

export interface Content {
  id: number;
  contentType: ContentType;
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleZh?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionZh?: string;
  year?: number;
  imageUrl?: string;
  images?: string[];
  director?: string;
  directorEn?: string;
  cast?: string[];
  castEn?: string[];
  genre?: string[];
  network?: string;
  episodes?: number;
  rating?: number;
  viewCount?: number;
  tags?: string[];
  tmdbId?: string;
  imdbId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentListResponse {
  contents: Content[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ContentCreateData {
  contentType: ContentType;
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleZh?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionZh?: string;
  year?: number;
  imageUrl?: string;
  images?: string[];
  director?: string;
  directorEn?: string;
  cast?: string[];
  castEn?: string[];
  genre?: string[];
  network?: string;
  episodes?: number;
  tags?: string[];
  tmdbId?: string;
  imdbId?: string;
}

export interface TourSpot {
  id: number;
  spotId: number;
  tourId: number;
  order: number;
  note?: string;
  noteEn?: string;
  durationMinutes?: number;
  createdAt?: string;
  spot?: Spot;
}

export interface Tour {
  id: number;
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleZh?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionZh?: string;
  durationHours?: number;
  distanceKm?: number;
  imageUrl?: string;
  images?: string[];
  difficulty?: string;
  tags?: string[];
  contentId?: number;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  tourSpots?: TourSpot[];
}

export interface TourListResponse {
  tours: Tour[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TourCreateData {
  title: string;
  titleEn?: string;
  titleJa?: string;
  titleZh?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionZh?: string;
  durationHours?: number;
  distanceKm?: number;
  imageUrl?: string;
  images?: string[];
  difficulty?: string;
  tags?: string[];
  contentId?: number;
  isFeatured?: boolean;
  tourSpots?: TourSpotCreateData[];
}

export interface TourSpotCreateData {
  spotId: number;
  order: number;
  note?: string;
  noteEn?: string;
  durationMinutes?: number;
}
