import React, { useState, useEffect } from 'react';
import { CountryService } from '../Services/CountryService';
import { Country } from '../models/Country';

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [newCountry, setNewCountry] = useState<Country | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const response = await CountryService.getCountries();
    setCountries(response.data.data);
  };

  const addCountry = () => {
    setNewCountry({ id: 0, name: '', iso2: '', iso3: '', totCities: 0 });
  };

  const saveCountry = async () => {
    if (newCountry) {
      await CountryService.postCountry(newCountry);
      loadCountries();
      setNewCountry(null);
    }
  };

  const editCountry = (country: Country) => {
    setEditingCountry(country);
  };

  const saveEditCountry = async () => {
    if (editingCountry) {
      await CountryService.updateCountry(editingCountry.id, editingCountry);
      loadCountries();
      setEditingCountry(null);
    }
  };

  const deleteCountry = async (country: Country) => {
    await CountryService.deleteCountry(country.id);
    loadCountries();
  };

  return (
    <div className="container">
      <h2>Country List</h2>
      <button className="btn btn-primary mb-3" onClick={addCountry}>Add Country</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>ISO2</th>
            <th>ISO3</th>
            <th>Total Cities</th>
            <th>Actions</th>
          </tr>
        </thead>
<tbody>
  {countries.map((country) => (
    <tr key={country.id}>
      <td>{country.id}</td>
      <td>{country && country.name}</td>
      <td>{country && country.iso2}</td>
      <td>{country && country.iso3}</td>
      <td>{country && country.totCities}</td>
      <td>
        <button className="btn btn-info mr-2" onClick={() => editCountry(country)}>Edit</button>
        <button className="btn btn-danger" onClick={() => deleteCountry(country)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {newCountry && (
        <div>
          <h3>Create New Country</h3>
          <form onSubmit={saveCountry}>
            <input type="text" placeholder="Name" onChange={e => setNewCountry({ ...newCountry, name: e.target.value })} />
            <input type="text" placeholder="ISO2" onChange={e => setNewCountry({ ...newCountry, iso2: e.target.value })} />
            <input type="text" placeholder="ISO3" onChange={e => setNewCountry({ ...newCountry, iso3: e.target.value })} />
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      {editingCountry && (
        <div>
          <h3>Edit Country</h3>
          <form onSubmit={saveEditCountry}>
            <input type="text" value={editingCountry.name} onChange={e => setEditingCountry({ ...editingCountry, name: e.target.value })} />
            <input type="text" value={editingCountry.iso2} onChange={e => setEditingCountry({ ...editingCountry, iso2: e.target.value })} />
            <input type="text" value={editingCountry.iso3} onChange={e => setEditingCountry({ ...editingCountry, iso3: e.target.value })} />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingCountry(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CountryList;
