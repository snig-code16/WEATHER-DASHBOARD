import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Create directories if they don't exist
// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update paths to match the src folder structure
const assetsDir = path.join(__dirname, 'src', 'assets');
const weatherIconsDir = path.join(assetsDir, 'weather-icons');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

if (!fs.existsSync(weatherIconsDir)) {
    fs.mkdirSync(weatherIconsDir);
}

// Define the icon URLs
const icons = [
    {
        name: 'clear-day.png',
        url: 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png' // Sunny icon from Flaticon
    },
    {
        name: 'clear-night.png',
        url: 'https://openweathermap.org/img/wn/01n@2x.png'
    },
    {
        name: 'cloudy.png',
        url: 'https://openweathermap.org/img/wn/03d@2x.png'
    },
    {
        name: 'rain.png',
        url: 'https://openweathermap.org/img/wn/10d@2x.png'
    },
    {
        name: 'snow.png',
        url: 'https://openweathermap.org/img/wn/13d@2x.png'
    },
    {
        name: 'mist.png',
        url: 'https://openweathermap.org/img/wn/50d@2x.png'
    },
    {
        name: 'thunderstorm.png',
        url: 'https://openweathermap.org/img/wn/11d@2x.png'
    },
    // Adding search icon
    {
        name: '../search.png',
        url: 'https://cdn-icons-png.flaticon.com/512/3917/3917132.png'
    }
];

// Function to download a file
const downloadFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filePath}`);
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(filePath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
        });
    });
};

// Download all icons
const downloadIcons = async () => {
    for (const icon of icons) {
        const filePath = path.join(weatherIconsDir, icon.name);
        try {
            await downloadFile(icon.url, filePath);
        } catch (error) {
            console.error(`Failed to download ${icon.name}:`, error);
        }
    }
    console.log('All downloads completed!');
};

downloadIcons();