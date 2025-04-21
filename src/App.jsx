import React, { useState } from 'react'
import Weather from './components/Weather'
import defaultBackground from "./assets/weatherpic2.jpg";
import clearDayBackground from "./assets/weatherpic.jpg"; // Using weatherpic.jpg for clear day
// Import more background images as needed

const App = () => {
  const [weatherCondition, setWeatherCondition] = useState(null);
  
  // Function to get appropriate background based on weather condition
  const getBackground = (condition) => {
    if (!condition) return defaultBackground;
    
    switch (condition.toLowerCase()) {
      case 'clear':
        return clearDayBackground;
      case 'clouds':
        return defaultBackground; // Using default for cloudy for now
      case 'rain':
      case 'drizzle':
        return defaultBackground; // Using default for rain for now
      case 'snow':
        return defaultBackground; // Using default for snow for now
      case 'thunderstorm':
        return defaultBackground; // Using default for thunderstorm for now
      case 'mist':
      case 'fog':
      case 'haze':
        return defaultBackground; // Using default for misty conditions for now
      default:
        return defaultBackground;
    }
  };

  // Function to handle weather updates from the Weather component
  const handleWeatherUpdate = (weatherData) => {
    if (weatherData && weatherData.main) {
      setWeatherCondition(weatherData.main);
    }
  };

  const currentBackground = getBackground(weatherCondition);

  return (
    <div className='app' style={{ 
      backgroundImage: `url(${currentBackground})`,
      backgroundRepeat: 'no-repeat',
      width: '100%', 
      height: '100vh', 
      backgroundSize: 'cover',
      transition: 'background-image 1s ease-in-out' // Smooth transition between backgrounds
    }}>
      <Weather onWeatherUpdate={handleWeatherUpdate} />
    </div>
  )
}

export default App
