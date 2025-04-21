import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import searchIcon from '../assets/search.png'
// Import weather icons - you'll need to download these
import clearDayIcon from '../assets/weather-icons/clear-day.png'
import clearNightIcon from '../assets/weather-icons/clear-night.png'
import cloudyIcon from '../assets/weather-icons/cloudy.png'
import rainIcon from '../assets/weather-icons/rain.png'
import snowIcon from '../assets/weather-icons/snow.png'
import mistIcon from '../assets/weather-icons/mist.png'
import thunderstormIcon from '../assets/weather-icons/thunderstorm.png'

const Weather = ({ onWeatherUpdate }) => {
    const inputRef = useRef()
    const [weatherdata, setWeatherdata] = useState(false)
    const iconurl = "https://openweathermap.org/img/wn/"
    
    // Helper function to get appropriate weather icon based on condition
    const getWeatherIcon = (iconCode, main, description) => {
        // Log details to help debug icon selection
        console.log(`Getting icon for: ${main}, icon code: ${iconCode}, description: ${description}`);
        
        // Map weather conditions to local icons
        if (main === "Clear") {
            // Check if it's day or night based on icon code (should contain 'd' for day)
            const isDay = iconCode && iconCode.includes('d');
            console.log(`Clear sky condition detected, isDay: ${isDay}`);
            return isDay ? clearDayIcon : clearNightIcon;
        } else if (main === "Clouds") {
            return cloudyIcon;
        } else if (main === "Rain" || main === "Drizzle") {
            return rainIcon;
        } else if (main === "Snow") {
            return snowIcon;
        } else if (main === "Thunderstorm") {
            return thunderstormIcon;
        } else if (main === "Mist" || main === "Fog" || main === "Haze") {
            return mistIcon;
        }
        
        // Fallback to OpenWeatherMap API icon if we don't have a match
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
    
    const search = async (city) => {
        try {
             const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
             const res = await fetch(url)
             const data = await res.json()
             if(!res.ok){
                 alert(data.message)
                 return;
             }

             const icon = data.weather[0].icon;
             console.log("Weather data:", data);
             console.log("Icon code:", icon);             
             const weatherDescription = data.weather[0].description;
             console.log("Full icon URL:", getWeatherIcon(icon, weatherDescription));
             
             const weatherInfo = {
                 humidity: data.main.humidity,
                 windspeed: data.wind.speed,
                 temperature: Math.floor(data.main.temp),
                 location: data.name,
                 icon: icon,
                 description: weatherDescription,
                 main: data.weather[0].main
             };
             
             setWeatherdata(weatherInfo);
             
             // Send the weather data to the parent component
             if (onWeatherUpdate) {
                 onWeatherUpdate(weatherInfo);
             }
        }
        catch (error) {
           console.error("Error fetching weather data:", error);
        }
    }
    
    // Handle form submission
    const handleSubmit = (e) => {
        // Prevent the default form submission behavior
        if (e) e.preventDefault();
        
        // Get the input value and search if not empty
        const inputValue = inputRef.current.value.trim();
        if (inputValue) {
            search(inputValue);
        }
    };
    
    // Handle search icon click
    const handleSearchClick = () => {
        handleSubmit();
    };
    
    // Handle pressing enter in the search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };
    
    useEffect(() => {
        search("London");
    }, [onWeatherUpdate]); // Add onWeatherUpdate to dependencies

    return (
        <div>
            <div className='weather'>
                <form className='searchbar' onSubmit={handleSubmit}>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        placeholder='Search for a city...' 
                        onKeyPress={handleKeyPress}
                    />
                    <img 
                        className='image' 
                        src={searchIcon} 
                        alt="search" 
                        onClick={handleSearchClick} 
                    />
                </form>

                {weatherdata && (
                    <>                        <img 
                            src={getWeatherIcon(weatherdata.icon, weatherdata.main, weatherdata.description)}
                            className='weatherimg' 
                            alt={weatherdata.description || "Weather condition"}
                            onError={(e) => {
                                console.error("Failed to load weather icon", e);
                                e.target.onerror = null;
                                // Try fallback icon if original fails
                                e.target.src = "https://openweathermap.org/img/wn/01d@2x.png";
                                e.target.style.display = 'inline';
                            }}
                        />
                        <p className='temp'>{weatherdata.temperature}°C</p>
                        <p className='location'>{weatherdata.location}</p>
                        <p className='description'>{weatherdata.description}</p>
                    </>
                )}
            </div>
          
            <div className='col'>
                <img src="" alt="" />
                <div>
                    <span>wind speed</span>
                    <p className='wind'>{weatherdata && weatherdata.windspeed}</p>
                </div>
            </div>
        
            <div className='col1'>
                <img src="" alt="" />
                <div>
                    <span>humidity</span>
                    <p className='wind'>{weatherdata && weatherdata.humidity}</p>
                </div>
            </div>
        </div>
    )
}

export default Weather