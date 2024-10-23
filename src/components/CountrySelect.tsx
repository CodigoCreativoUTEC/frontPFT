import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Country {
  id: number;
  nombre: string;
  estado: string;
}

interface CountrySelectProps {
  selectedCountry: Country | null;
  onCountryChange: (country: Country) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ selectedCountry, onCountryChange }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCountries = async () => {
      if (!session || !session.accessToken) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paises/listar`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + (session.accessToken ?? ''),
        },
      });
      const result = await res.json();
      setCountries(result);
      setLoading(false);
    };

    fetchCountries();
  }, [session]);

  if (loading) return <div>Cargando países...</div>;

  return (
      <select
          value={selectedCountry ? selectedCountry.id : ''}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value, 10);
            const selected = countries.find(country => country.id === selectedId);
            if (selected) onCountryChange(selected);
          }}
          className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      >
        <option value=''>Seleccione un país</option>
        {countries.map(country => (
            <option key={country.id} value={country.id}>
              {country.nombre}
            </option>
        ))}
      </select>
  );
};

export default CountrySelect;