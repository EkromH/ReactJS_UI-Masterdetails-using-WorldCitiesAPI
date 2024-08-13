import { City } from "./City";

export class Country {

    id!: number;
  
    name!: string;
  
    iso2!: string;
  
    iso3!: string;
  
    totCities!: number;
  
    cities?: City[];
  
  }