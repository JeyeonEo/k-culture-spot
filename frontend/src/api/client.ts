import axios from 'axios';
import type {
  Spot,
  SpotListResponse,
  SearchParams,
  Content,
  ContentListResponse,
  ContentCreateData,
  ContentType,
  Tour,
  TourListResponse,
  TourCreateData,
  TourSpotCreateData,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const spotApi = {
  getSpots: async (params: SearchParams = {}): Promise<SpotListResponse> => {
    const { data } = await api.get('/spots', { params });
    return data;
  },

  getSpotById: async (id: number): Promise<Spot> => {
    const { data } = await api.get(`/spots/${id}`);
    return data;
  },

  getFeaturedSpots: async (): Promise<Spot[]> => {
    const { data } = await api.get('/spots/featured');
    return data;
  },

  getPopularSpots: async (): Promise<Spot[]> => {
    const { data } = await api.get('/spots/popular');
    return data;
  },

  getSpotsByCategory: async (category: string, page = 1): Promise<SpotListResponse> => {
    const { data } = await api.get(`/spots/category/${category}`, {
      params: { page },
    });
    return data;
  },

  searchSpots: async (query: string): Promise<Spot[]> => {
    const { data } = await api.get('/spots/search', {
      params: { q: query },
    });
    return data;
  },
};

export const contentApi = {
  getContents: async (params?: {
    page?: number;
    pageSize?: number;
    contentType?: ContentType;
    year?: number;
    genre?: string;
    query?: string;
  }): Promise<ContentListResponse> => {
    const { data } = await api.get('/contents', { params });
    return data;
  },

  getFeaturedContents: async (contentType?: ContentType, limit = 8): Promise<Content[]> => {
    const { data} = await api.get('/contents/featured', {
      params: { content_type: contentType, limit },
    });
    return data;
  },

  getPopularContents: async (contentType?: ContentType, limit = 8): Promise<Content[]> => {
    const { data } = await api.get('/contents/popular', {
      params: { content_type: contentType, limit },
    });
    return data;
  },

  getRecentContents: async (contentType?: ContentType, limit = 8): Promise<Content[]> => {
    const { data } = await api.get('/contents/recent', {
      params: { content_type: contentType, limit },
    });
    return data;
  },

  getContentById: async (id: number): Promise<Content> => {
    const { data } = await api.get(`/contents/${id}`);
    return data;
  },

  searchContents: async (query: string, contentType?: ContentType, limit = 20): Promise<Content[]> => {
    const { data } = await api.get('/contents/search', {
      params: { q: query, content_type: contentType, limit },
    });
    return data;
  },

  createContent: async (contentData: ContentCreateData): Promise<Content> => {
    const { data } = await api.post('/contents', contentData);
    return data;
  },

  updateContent: async (id: number, contentData: Partial<ContentCreateData>): Promise<Content> => {
    const { data } = await api.patch(`/contents/${id}`, contentData);
    return data;
  },

  deleteContent: async (id: number): Promise<void> => {
    await api.delete(`/contents/${id}`);
  },

  linkSpotToContent: async (
    contentId: number,
    spotId: number,
    sceneDescription?: string,
    sceneDescriptionEn?: string,
    episodeNumber?: number
  ): Promise<void> => {
    await api.post(`/contents/${contentId}/spots/${spotId}`, {
      scene_description: sceneDescription,
      scene_description_en: sceneDescriptionEn,
      episode_number: episodeNumber,
    });
  },

  unlinkSpotFromContent: async (contentId: number, spotId: number): Promise<void> => {
    await api.delete(`/contents/${contentId}/spots/${spotId}`);
  },
};

export const tourApi = {
  getTours: async (params?: {
    page?: number;
    pageSize?: number;
    difficulty?: string;
    contentId?: number;
    isFeatured?: boolean;
    query?: string;
  }): Promise<TourListResponse> => {
    const { data } = await api.get('/tours', { params });
    return data;
  },

  getFeaturedTours: async (limit = 8): Promise<Tour[]> => {
    const { data } = await api.get('/tours/featured', {
      params: { limit },
    });
    return data;
  },

  getPopularTours: async (limit = 8): Promise<Tour[]> => {
    const { data } = await api.get('/tours/popular', {
      params: { limit },
    });
    return data;
  },

  getTourById: async (id: number): Promise<Tour> => {
    const { data } = await api.get(`/tours/${id}`);
    return data;
  },

  searchTours: async (query: string, limit = 20): Promise<Tour[]> => {
    const { data } = await api.get('/tours/search', {
      params: { q: query, limit },
    });
    return data;
  },

  createTour: async (tourData: TourCreateData): Promise<Tour> => {
    const { data } = await api.post('/tours', tourData);
    return data;
  },

  updateTour: async (id: number, tourData: Partial<TourCreateData>): Promise<Tour> => {
    const { data } = await api.patch(`/tours/${id}`, tourData);
    return data;
  },

  deleteTour: async (id: number): Promise<void> => {
    await api.delete(`/tours/${id}`);
  },

  addSpotToTour: async (tourId: number, spotData: TourSpotCreateData): Promise<void> => {
    await api.post(`/tours/${tourId}/spots`, spotData);
  },

  removeSpotFromTour: async (tourId: number, spotId: number): Promise<void> => {
    await api.delete(`/tours/${tourId}/spots/${spotId}`);
  },

  reorderTourSpots: async (tourId: number, spotOrders: { spotId: number; order: number }[]): Promise<void> => {
    await api.put(`/tours/${tourId}/spots/reorder`, spotOrders);
  },

  getTourSpots: async (tourId: number) => {
    const { data } = await api.get(`/tours/${tourId}/spots`);
    return data;
  },
};

export default api;
