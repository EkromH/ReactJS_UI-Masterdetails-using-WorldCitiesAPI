import { Country } from "./Country";

export class City {

    id!: number;
  
    name!: string;
  
    lat!: number;
  
    lon!: number;
  
    countryId!: number;
  
    country?: Country;

    cities?: City[];
  
  }