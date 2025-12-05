import axios from 'axios';
import type { Spot, SpotListResponse, SearchParams, Content, Tour } from '../types';

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
  getContents: async (): Promise<Content[]> => {
    const { data } = await api.get('/contents');
    return data;
  },

  getFeaturedContents: async (): Promise<Content[]> => {
    const { data } = await api.get('/contents/featured');
    return data;
  },

  getContentById: async (id: number): Promise<Content> => {
    const { data } = await api.get(`/contents/${id}`);
    return data;
  },

  getContentSpots: async (contentId: number): Promise<Spot[]> => {
    const { data } = await api.get(`/contents/${contentId}/spots`);
    return data;
  },

  getContentTours: async (contentId: number): Promise<Tour[]> => {
    const { data } = await api.get(`/contents/${contentId}/tours`);
    return data;
  },
};

export const tourApi = {
  getTours: async (): Promise<Tour[]> => {
    const { data } = await api.get('/tours');
    return data;
  },

  getTourById: async (id: number): Promise<Tour> => {
    const { data } = await api.get(`/tours/${id}`);
    return data;
  },

  getFeaturedTours: async (): Promise<Tour[]> => {
    const { data } = await api.get('/tours/featured');
    return data;
  },
};

export default api;
