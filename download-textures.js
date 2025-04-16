// Script to download planet textures
const fs = require('fs');
const https = require('https');
const path = require('path');

// URLs for planet textures from NASA and other free sources
const textureUrls = {
    'sun.jpg': 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
    'mercury.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    'venus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg',
    'earth.jpg': 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    'mars.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    'jupiter.jpg': 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    'saturn.jpg': 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    'uranus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    'neptune.jpg': 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
    'saturn-rings.png': 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png',
    'glow.png': 'https://svs.gsfc.nasa.gov/vis/a010000/a013600/a013641/lroc_color_poles_1k.png'
};

// Create textures directory if it doesn't exist
const texturesDir = path.join(__dirname, 'textures');
if (!fs.existsSync(texturesDir)) {
    fs.mkdirSync(texturesDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(texturesDir, filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
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
}

// Download all textures
async function downloadAllTextures() {
    console.log('Starting texture downloads...');
    
    const downloadPromises = Object.entries(textureUrls).map(([filename, url]) => {
        return downloadFile(url, filename);
    });
    
    try {
        await Promise.all(downloadPromises);
        console.log('All textures downloaded successfully!');
    } catch (error) {
        console.error('Error downloading textures:', error);
    }
}

// Start downloading
downloadAllTextures();
