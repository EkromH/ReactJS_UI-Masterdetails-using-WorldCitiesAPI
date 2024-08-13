import axios from 'axios';
import { Country } from '../models/Country';

const url = 'https://localhost:40443/api/Countries';

export const CountryService = {
  getCountries: async () => axios.get(url),
  getCountry: async (id: number) => axios.get(`${url}/${id}`),
  postCountry: async (country: Country) => axios.post(url, country),
  updateCountry: async (id: number, country: Country) => axios.put(`${url}/${id}`, country),
  deleteCountry: async (id: number) => axios.delete(`${url}/${id}`)
};
