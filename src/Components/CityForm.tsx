import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, Button, Container, MenuItem, Select, InputLabel, FormControl, Typography, Divider, Box } from '@material-ui/core';
import { City } from '../models/City';
import { CountryService } from '../Services/CountryService';
import { CityService } from '../Services/CityService';
import { Country } from '../models/Country';
import { useNavigate } from 'react-router-dom';

type FormData = {
  countryId: number;
  name?: string;
  iso2?: string;
  iso3?: string;
  cities: Array<{ name: string; lat: number; lon: number }>;
};

const CityForm: React.FC<{ city?: City; onCancel?: () => void }> = ({ city, onCancel }) => {
  const { control, handleSubmit, watch, reset, setValue } = useForm<FormData>({
    defaultValues: {
      countryId: 0,
      cities: [{ name: '', lat: 0, lon: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'cities' });
  const [countries, setCountries] = useState<Country[]>([]);
  const navigate = useNavigate();

  const countryId = watch('countryId');

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await CountryService.getCountries();
      setCountries(response.data.data);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (city) {
      setValue('countryId', city.countryId);
      setValue('cities', [{ name: city.name, lat: city.lat, lon: city.lon }]);
    }
  }, [city, setValue]);

  const onSubmit = async (data: FormData) => {
    if (data.countryId === 0) {
      const newCountry: Country = {
        id: 0,
        name: data.name!,
        iso2: data.iso2!,
        iso3: data.iso3!,
        totCities: 0,
      };
      const countryResponse = await CountryService.postCountry(newCountry);
      data.countryId = countryResponse.data.id;
    }

    for (const cityData of data.cities) {
      const newCity: City = {
        id: city?.id || 0,
        name: cityData.name,
        lat: cityData.lat,
        lon: cityData.lon,
        countryId: data.countryId,
      };
      if (city) {
        await CityService.updateCity(newCity.id, newCity);
      } else {
        await CityService.postCity(newCity);
      }
    }

    reset();
    navigate('/');
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5">Select Country Or Create New Country</Typography>
        <FormControl >
          <InputLabel id="country-select-label">Country</InputLabel>
          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <Select {...field} labelId="country-select-label" required>
                <MenuItem value={0}>Select country</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {countryId === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Creating Country
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Country Name"  />
              )}
            />
            <Controller
              name="iso2"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Country ISO2"  />
              )}
            />
            <Controller
              name="iso3"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Country ISO3" />
              )}
            />
          </>
        )}

        <Divider />
        <Typography variant="h5">Cities</Typography>
        {fields.map((field, index) => (
          <Box key={field.id}>
            <Controller
              name={`cities.${index}.name`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="City Name"  />
              )}
            />
            <Controller
              name={`cities.${index}.lat`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Latitude" type="number"  />
              )}
            />
            <Controller
              name={`cities.${index}.lon`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Longitude" type="number"  />
              )}
            />
            <Button  onClick={() => remove(index)}>
              Remove
            </Button>
          </Box>
        ))}
        <Button  onClick={() => append({ name: '', lat: 0, lon: 0 })}>
          Add City
        </Button>
        <Button  type="submit">
          Save
        </Button>
        <Button  onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Container>
  );
};

export default CityForm;