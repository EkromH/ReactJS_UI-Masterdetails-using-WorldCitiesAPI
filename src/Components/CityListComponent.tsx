import React, { useState, useEffect, useCallback } from 'react';
import { CityService } from '../Services/CityService';
import { CountryService } from '../Services/CountryService';
import { City } from '../models/City';
import { Country } from '../models/Country';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import CityForm from './CityForm';
import { useNavigate } from 'react-router-dom';

const CityList: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const navigate = useNavigate();

  const fetchCities = useCallback(async () => {
    try {
      const response = await CityService.getCities();
      console.log('Cities:', response.data.data); // Log cities data
      if (Array.isArray(response.data.data)) {
        setCities(response.data.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await CountryService.getCountries();
      console.log('Countries:', response.data.data); // Log countries data
      if (Array.isArray(response.data.data)) {
        setCountries(response.data.data);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    }
  }, []);

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, [fetchCities, fetchCountries]);

  const getCountryName = (countryId: number) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : 'Unknown';
  };

  const editCity = (city: City) => {
    console.log('Editing city:', city); // Debug log
    setEditingCity(city);
  };

  const deleteCity = async (city: City) => {
    await CityService.deleteCity(city.id);
    fetchCities();
  };

  const cancelEdit = () => {
    setEditingCity(null);
  };

  const navigateToAddCountry = () => {
    navigate("/add-country");
  };

  return (
    <div>
      <h2>City List</h2>
      <Button onClick={navigateToAddCountry}>Add New City</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities.length > 0 ? cities.map(city => (
            <TableRow key={city.id}>
              <TableCell>{city.id}</TableCell>
              <TableCell>{city.name}</TableCell>
              <TableCell>{city.lat}</TableCell>
              <TableCell>{city.lon}</TableCell>
              <TableCell>{getCountryName(city.countryId)}</TableCell>
              <TableCell>
                <Button  onClick={() => editCity(city)}>Edit</Button>
                <Button  onClick={() => deleteCity(city)}>Delete</Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} align="center">No cities available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {editingCity && <CityForm city={editingCity} onCancel={cancelEdit} />}
    </div>
  );
};

export default CityList;