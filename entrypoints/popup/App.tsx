import React, { useEffect, useState } from 'react';
import './App.css';

interface WeatherData {
  location: {
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>(''); // City will be determined based on user's location
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCurrentWeather(city: string) {
      try {
        const response = await fetch(`http://localhost:5173/api/weather?city=${city}`); // Replace with actual API URL
        if (!response.ok) {
          throw new Error('Failed to fetch current weather');
        }
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching current weather:', error);
      } finally {
        setLoading(false);
      }
    }
    
    async function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiUrl = import.meta.env.VITE_APP_GMAPS_API_KEY;
            console.log(apiUrl)
            const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiUrl}`);
            const geocodeData = await geocodeResponse.json();
            console.log(geocodeData)
            const cityName = geocodeData.results[0].address_components.find((component: any) => component.types.includes('locality'))?.long_name;
            if (cityName) {
              setCity(cityName);
              fetchCurrentWeather(cityName);
            }
          } catch (error) {
            console.error('Error fetching city from geolocation:', error);
            setLoading(false);
          }
        }, (error) => {
          console.error('Error getting user location:', error);
          setLoading(false);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    }

    getUserLocation();
  }, [navigator.geolocation.getCurrentPosition]); 

  return (
    <div className="App p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Current Weather</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        weatherData ? (
          <div>
            <img src={`https:${weatherData.current.condition.icon}`} alt="Weather Icon" />
            <p>
              Location: {weatherData.location.name}, {weatherData.location.region}
            </p>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Condition: {weatherData.current.condition.text}</p>
          </div>
        ) : (
          <p>Error fetching weather data.</p>
        )
      )}
    </div>
  );
}

export default App;
