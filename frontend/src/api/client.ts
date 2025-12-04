import axios from 'axios';
import type { Spot, SpotListResponse, SearchParams } from '../types';

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

export default api;
