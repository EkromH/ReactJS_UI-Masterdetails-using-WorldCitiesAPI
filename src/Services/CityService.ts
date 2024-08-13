import axios from 'axios';
import { City } from '../models/City';

const url = 'https://localhost:40443/api/Cities';

export const CityService = {
  getCities: async () => axios.get(url),
  getCity: async (id: number) => axios.get(`${url}/${id}`),
  postCity: async (city: City) => axios.post(url, city),
  updateCity: async (id: number, city: City) => axios.put(`${url}/${id}`, city),
  deleteCity: async (id: number) => axios.delete(`${url}/${id}`)
};
