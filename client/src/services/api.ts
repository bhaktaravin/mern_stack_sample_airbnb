import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Listing {
  _id: string;
  name: string;
  summary: string;
  description: string;
  property_type: string;
  room_type: string;
  accommodates: number;
  bedrooms: number;
  beds: number;
  bathrooms: any;
  price: any;
  images: {
    picture_url: string;
    thumbnail_url: string;
    medium_url: string;
    xl_picture_url: string;
  };
  host: {
    host_name: string;
    host_picture_url: string;
    host_is_superhost: boolean;
  };
  address: {
    street: string;
    country: string;
    market: string;
  };
  amenities: string[];
  reviews: any[];
  number_of_reviews: number;
}

export interface ListingsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  fetched: number;
  listings: Listing[];
}

export interface FilterParams {
  page?: number;
  limit?: number;
  property_type?: string;
  room_type?: string;
  country?: string;
  min_price?: number;
  max_price?: number;
  accommodates?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const listingsAPI = {
  getListings: async (filters: FilterParams = {}): Promise<ListingsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    // Only one /listings in the path
    const response = await api.get(`listings?${params.toString()}`);
    return response.data;
  },

  getListingBySlug: async (slug: string): Promise<Listing> => {
    // Only one /listings in the path
    const response = await api.get(`listings/${slug}`);
    return response.data;
  }
};

export default api;