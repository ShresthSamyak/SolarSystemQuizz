// 3D Solar System Simulation using Three.js
let scene, camera, renderer, controls;
let planets = {};
let orbits = {};
let planetInfo = {};
let currentZoom = null;
let isTransitioning = false;

// Planet data with real-world inspired values (scaled for visualization)
const planetData = {
    sun: {
        name: "The Sun",
        radius: 30,
        rotationSpeed: 0.002,
        distanceFromSun: 0,
        orbitSpeed: 0,
        tilt: 0,
        facts: [
            "Diameter: 1,392,684 km (109 Earths)",
            "Surface Temperature: 5,500°C",
            "Type: G-type main-sequence star",
            "Age: About 4.6 billion years"
        ]
    },
    mercury: {
        name: "Mercury",
        radius: 3.8,
        rotationSpeed: 0.004,
        distanceFromSun: 58,
        orbitSpeed: 0.04,
        tilt: 0.03,
        facts: [
            "Diameter: 4,879 km",
            "Orbit Period: 88 Earth days",
            "Notable Feature: Extreme temperature variations",
            "Surface: Heavily cratered terrain"
        ]
    },
    venus: {
        name: "Venus",
        radius: 9.5,
        rotationSpeed: 0.002,
        distanceFromSun: 108,
        orbitSpeed: 0.015,
        tilt: 177.3,
        facts: [
            "Diameter: 12,104 km",
            "Orbit Period: 225 Earth days",
            "Notable Feature: Thick toxic atmosphere",
            "Surface: Volcanic activity and highland regions"
        ]
    },
    earth: {
        name: "Earth",
        radius: 10,
        rotationSpeed: 0.01,
        distanceFromSun: 150,
        orbitSpeed: 0.01,
        tilt: 23.5,
        facts: [
            "Diameter: 12,756 km",
            "Orbit Period: 365.25 days",
            "Notable Feature: Only known planet with life",
            "Surface: 71% covered by water"
        ]
    },
    mars: {
        name: "Mars",
        radius: 5.3,
        rotationSpeed: 0.008,
        distanceFromSun: 228,
        orbitSpeed: 0.008,
        tilt: 25.2,
        facts: [
            "Diameter: 6,792 km",
            "Orbit Period: 687 Earth days",
            "Notable Feature: Olympus Mons (largest volcano)",
            "Surface: Red, dusty with polar ice caps"
        ]
    },
    jupiter: {
        name: "Jupiter",
        radius: 22,
        rotationSpeed: 0.04,
        distanceFromSun: 778,
        orbitSpeed: 0.002,
        tilt: 3.1,
        facts: [
            "Diameter: 139,820 km",
            "Orbit Period: 11.86 Earth years",
            "Notable Feature: Great Red Spot",
            "Type: Gas giant with rings"
        ]
    },
    saturn: {
        name: "Saturn",
        radius: 18,
        rotationSpeed: 0.038,
        distanceFromSun: 1429,
        orbitSpeed: 0.0009,
        tilt: 26.7,
        hasRings: true,
        facts: [
            "Diameter: 116,460 km",
            "Orbit Period: 29.5 Earth years",
            "Notable Feature: Prominent ring system",
            "Type: Gas giant with 82 known moons"
        ]
    },
    uranus: {
        name: "Uranus",
        radius: 15.7,
        rotationSpeed: 0.03,
        distanceFromSun: 2871,
        orbitSpeed: 0.0004,
        tilt: 97.8,
        facts: [
            "Diameter: 50,724 km",
            "Orbit Period: 84 Earth years",
            "Notable Feature: Rotates on its side",
            "Type: Ice giant with thin rings"
        ]
    },
    neptune: {
        name: "Neptune",
        radius: 15.2,
        rotationSpeed: 0.032,
        distanceFromSun: 4495,
        orbitSpeed: 0.0001,
        tilt: 28.3,
        facts: [
            "Diameter: 49,244 km",
            "Orbit Period: 165 Earth years",
            "Notable Feature: Great Dark Spot",
            "Type: Ice giant with 14 known moons"
        ]
    }
};

// Scale down the distances for better visualization
const distanceScale = 1.5;

// Initialize the 3D scene
function init() {
    // Create the scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        60, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        10000 // Far clipping plane
    );
    camera.position.set(0, 100, 300);
    
    // Create renderer with transparency for better integration with the original UI
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Create separate renderer for landing page container
    const landingContainer = document.getElementById('landing-3d-container');
    const mainContainer = document.getElementById('solar-system-container');
    
    // Create custom landing page renderer and scene
    if (landingContainer) {
        // Create a secondary scene and camera specifically for the landing container
        const landingScene = new THREE.Scene();
        const landingCamera = new THREE.PerspectiveCamera(
            60,
            landingContainer.clientWidth / landingContainer.clientHeight,
            0.1,
            10000
        );
        landingCamera.position.set(0, 50, 150); // Closer view for the smaller container
        
        // Create dedicated renderer
        const landingRenderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            precision: 'highp'
        });
        landingRenderer.setSize(landingContainer.clientWidth, landingContainer.clientHeight);
        landingRenderer.setClearColor(0x000000, 0);
        landingContainer.appendChild(landingRenderer.domElement);
        
        // Create duplicate celestial bodies for the landing scene
        const landingPlanets = {};
        const landingOrbits = {};
        
        // Add ambient light
        const landingAmbientLight = new THREE.AmbientLight(0x333333);
        landingScene.add(landingAmbientLight);
        
        // Add point light
        const landingSunLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
        landingScene.add(landingSunLight);
        
        // Create starry background
        const landingStarsGeometry = new THREE.BufferGeometry();
        const landingStarsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            transparent: true
        });
        
        const landingStarsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = THREE.MathUtils.randFloatSpread(2000);
            const y = THREE.MathUtils.randFloatSpread(2000);
            const z = THREE.MathUtils.randFloatSpread(2000);
            landingStarsVertices.push(x, y, z);
        }
        
        landingStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(landingStarsVertices, 3));
        const landingStars = new THREE.Points(landingStarsGeometry, landingStarsMaterial);
        landingScene.add(landingStars);
        
        // Create the mini planets for landing scene - simplified versions
        const planetColors = {
            sun: 0xffcc00,
            mercury: 0x8c8c8c,
            venus: 0xe6c35c,
            earth: 0x2277ff,
            mars: 0xc1440e,
            jupiter: 0xe0ae6f,
            saturn: 0xead6b8,
            uranus: 0x9db4ff,
            neptune: 0x3e66f9
        };
        
        // Add the mini-sun
        const landingSunGeometry = new THREE.SphereGeometry(10, 16, 16);
        const landingSunMaterial = new THREE.MeshBasicMaterial({
            color: planetColors.sun,
            emissive: 0xffff00
        });
        
        landingPlanets.sun = new THREE.Mesh(landingSunGeometry, landingSunMaterial);
        landingScene.add(landingPlanets.sun);
        
        // Add a smaller sun glow effect
        const landingSunGlowGeometry = new THREE.SphereGeometry(12, 16, 16);
        const landingSunGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.5 },
                p: { type: "f", value: 6.0 },
                glowColor: { type: "c", value: new THREE.Color(0xffdd66) },
                viewVector: { type: "v3", value: landingCamera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const landingSunGlow = new THREE.Mesh(landingSunGlowGeometry, landingSunGlowMaterial);
        landingScene.add(landingSunGlow);
        
        // Add the mini-planets
        const miniPlanetData = {
            mercury: { radius: 2, distance: 20, speed: 0.04 },
            venus: { radius: 3, distance: 30, speed: 0.015 },
            earth: { radius: 3, distance: 40, speed: 0.01 },
            mars: { radius: 2.5, distance: 50, speed: 0.008 },
            jupiter: { radius: 7, distance: 65, speed: 0.002 },
            saturn: { radius: 6, distance: 80, speed: 0.0009, hasRings: true },
            uranus: { radius: 5, distance: 95, speed: 0.0004 },
            neptune: { radius: 5, distance: 110, speed: 0.0001 }
        };
        
        // Create each mini-planet
        for (const planet in miniPlanetData) {
            // Create orbit
            const orbitGeometry = new THREE.RingGeometry(
                miniPlanetData[planet].distance,
                miniPlanetData[planet].distance + 0.2,
                64
            );
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            
            landingOrbits[planet] = new THREE.Mesh(orbitGeometry, orbitMaterial);
            landingOrbits[planet].rotation.x = Math.PI / 2;
            landingScene.add(landingOrbits[planet]);
            
            // Create planet
            const planetGeometry = new THREE.SphereGeometry(miniPlanetData[planet].radius, 16, 16);
            const planetMaterial = new THREE.MeshPhongMaterial({
                color: planetColors[planet],
                shininess: 5
            });
            
            landingPlanets[planet] = new THREE.Mesh(planetGeometry, planetMaterial);
            
            // Position planet
            const angle = Math.random() * Math.PI * 2;
            const distance = miniPlanetData[planet].distance;
            landingPlanets[planet].position.x = Math.cos(angle) * distance;
            landingPlanets[planet].position.z = Math.sin(angle) * distance;
            
            // Add rings to Saturn
            if (planet === 'saturn') {
                const ringGeometry = new THREE.RingGeometry(
                    miniPlanetData[planet].radius * 1.4,
                    miniPlanetData[planet].radius * 2.2,
                    32
                );
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf0e2b6,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                landingPlanets[planet].add(ring);
            }
            
            landingScene.add(landingPlanets[planet]);
        }
        
        // Create controls for the landing container
        const landingControls = new THREE.OrbitControls(landingCamera, landingRenderer.domElement);
        landingControls.enableDamping = true;
        landingControls.dampingFactor = 0.05;
        landingControls.rotateSpeed = 0.5;
        landingControls.minDistance = 20;
        landingControls.maxDistance = 200;
        
        // Auto-rotate the system
        landingControls.autoRotate = true;
        landingControls.autoRotateSpeed = 0.5;
        
        // Landing page animation function
        function animateLanding() {
            requestAnimationFrame(animateLanding);
            
            // Update controls
            landingControls.update();
            
            // Rotate sun
            landingPlanets.sun.rotation.y += 0.005;
            
            // Update mini-planets
            for (const planet in miniPlanetData) {
                // Update planet rotation
                landingPlanets[planet].rotation.y += 0.01;
                
                // Update orbit position
                const orbit = miniPlanetData[planet].speed;
                const distance = miniPlanetData[planet].distance;
                
                const currentAngle = Math.atan2(
                    landingPlanets[planet].position.z,
                    landingPlanets[planet].position.x
                );
                const newAngle = currentAngle + orbit;
                
                landingPlanets[planet].position.x = Math.cos(newAngle) * distance;
                landingPlanets[planet].position.z = Math.sin(newAngle) * distance;
            }
            
            // Render with landing renderer
            landingRenderer.render(landingScene, landingCamera);
        }
        
        // Start the landing animation
        animateLanding();
    }
    
    // Set up the main container for fullscreen background
    mainContainer.appendChild(renderer.domElement);
    
    // Position the 3D container behind other elements but still visible
    mainContainer.style.position = 'fixed';
    mainContainer.style.top = '0';
    mainContainer.style.left = '0';
    mainContainer.style.width = '100%';
    mainContainer.style.height = '100%';
    mainContainer.style.zIndex = '0';
    
    // Add orbit controls for free rotation (but disable zoom)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add smoothing
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false; // Disable zooming completely
    
    // Add ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add point light at the position of the sun
    const sunLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
    scene.add(sunLight);
    
    // Add a starry background
    createStarryBackground();
    
    // Create the sun and planets
    createCelestialBodies();
    
    // Add event listener for window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add event listener for clicking on planets
    window.addEventListener('click', onPlanetClick);
    
    // Add event listener for back button
    document.getElementById('info-back-btn').addEventListener('click', resetView);
    
    // Start animation loop
    animate();
}

// Create a starry background
function createStarryBackground() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Create the sun and planets
function createCelestialBodies() {
    // Planet colors based on their actual appearance
    const planetColors = {
        sun: 0xffcc00,
        mercury: 0x8c8c8c,
        venus: 0xe6c35c,
        earth: 0x2277ff,
        mars: 0xc1440e,
        jupiter: 0xe0ae6f,
        saturn: 0xead6b8,
        uranus: 0x9db4ff,
        neptune: 0x3e66f9
    };
    
    // Add the sun with a glowing effect
    const sunGeometry = new THREE.SphereGeometry(planetData.sun.radius, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: planetColors.sun,
        emissive: 0xffff00,
        emissiveIntensity: 0.5
    });
    
    planets.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(planets.sun);
    
    // Create a sun glow effect using a simple custom shader
    const sunGlowGeometry = new THREE.SphereGeometry(planetData.sun.radius * 1.2, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { type: "f", value: 0.5 },
            p: { type: "f", value: 6.0 },
            glowColor: { type: "c", value: new THREE.Color(0xffdd66) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(c - dot(vNormal, vNormel), p);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, 1.0);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);
    
    // Create each planet
    for (const planet in planetData) {
        if (planet === 'sun') continue; // Skip the sun as we've already created it
        
        // Create the orbit path
        const orbitGeometry = new THREE.RingGeometry(
            planetData[planet].distanceFromSun * distanceScale,
            planetData[planet].distanceFromSun * distanceScale + 0.5,
            128
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        
        orbits[planet] = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbits[planet].rotation.x = Math.PI / 2;
        scene.add(orbits[planet]);
        
        // Create the planet
        const planetGeometry = new THREE.SphereGeometry(planetData[planet].radius, 32, 32);
        
        // For Earth, create a custom material with simple continents
        let planetMaterial;
        if (planet === 'earth') {
            // Create a canvas for procedural texture
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Fill with blue for oceans
            ctx.fillStyle = '#1a66cc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add green continents (simplified shapes)
            ctx.fillStyle = '#33aa33';
            
            // Africa
            ctx.beginPath();
            ctx.moveTo(256, 80);
            ctx.lineTo(300, 100);
            ctx.lineTo(300, 180);
            ctx.lineTo(260, 200);
            ctx.lineTo(240, 160);
            ctx.fill();
            
            // North America
            ctx.beginPath();
            ctx.moveTo(100, 50);
            ctx.lineTo(180, 60);
            ctx.lineTo(180, 120);
            ctx.lineTo(80, 140);
            ctx.fill();
            
            // South America
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.lineTo(180, 160);
            ctx.lineTo(160, 220);
            ctx.lineTo(120, 210);
            ctx.fill();
            
            // Australia
            ctx.beginPath();
            ctx.moveTo(380, 170);
            ctx.lineTo(420, 180);
            ctx.lineTo(410, 210);
            ctx.lineTo(370, 200);
            ctx.fill();
            
            // Eurasia
            ctx.beginPath();
            ctx.moveTo(280, 60);
            ctx.lineTo(380, 50);
            ctx.lineTo(420, 100);
            ctx.lineTo(320, 120);
            ctx.fill();
            
            // Ice caps
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, 30); // North pole
            ctx.fillRect(0, canvas.height - 30, canvas.width, 30); // South pole
            
            // Create texture
            const texture = new THREE.CanvasTexture(canvas);
            planetMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                shininess: 5
            });
        } else {
            // For other planets, use simple material with the planet's color
            planetMaterial = new THREE.MeshPhongMaterial({
                color: planetColors[planet],
                shininess: 5
            });
            
            // Add some variation to the planets
            if (planet === 'jupiter' || planet === 'saturn') {
                // Create a canvas for gas giant banding
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');
                
                // Base color
                ctx.fillStyle = planet === 'jupiter' ? '#e0ae6f' : '#ead6b8';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add bands
                const bandCount = planet === 'jupiter' ? 10 : 8;
                const bandHeight = canvas.height / bandCount;
                
                for (let i = 0; i < bandCount; i++) {
                    if (i % 2 === 0) continue; // Skip every other band
                    
                    const y = i * bandHeight;
                    ctx.fillStyle = planet === 'jupiter' ? 
                        (i % 4 === 1 ? '#be8b4a' : '#d0985b') : 
                        (i % 4 === 1 ? '#c9b699' : '#d6c7a9');
                    ctx.fillRect(0, y, canvas.width, bandHeight);
                }
                
                // For Jupiter, add the Great Red Spot
                if (planet === 'jupiter') {
                    ctx.fillStyle = '#cc3d3d';
                    ctx.beginPath();
                    ctx.ellipse(350, 100, 40, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Create texture
                const texture = new THREE.CanvasTexture(canvas);
                planetMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    shininess: 5
                });
            }
            
            // Add special features for Mars (red with polar caps)
            if (planet === 'mars') {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');
                
                // Base Mars color
                ctx.fillStyle = '#c1440e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add polar caps
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, 20); // North pole
                ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // South pole
                
                // Create texture
                const texture = new THREE.CanvasTexture(canvas);
                planetMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    shininess: 5
                });
            }
        }
        
        planets[planet] = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Position the planet
        const angle = Math.random() * Math.PI * 2;
        const distance = planetData[planet].distanceFromSun * distanceScale;
        planets[planet].position.x = Math.cos(angle) * distance;
        planets[planet].position.z = Math.sin(angle) * distance;
        
        // Apply tilt
        planets[planet].rotation.x = THREE.MathUtils.degToRad(planetData[planet].tilt);
        
        // Add special features (e.g., Saturn's rings)
        if (planetData[planet].hasRings) {
            const ringGeometry = new THREE.RingGeometry(
                planetData[planet].radius * 1.4,
                planetData[planet].radius * 2.2,
                64
            );
            
            // Create a procedural texture for Saturn's rings
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            
            // Create ring gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.2, 'rgba(255, 240, 200, 0.5)');
            gradient.addColorStop(0.4, 'rgba(255, 240, 200, 0.2)');
            gradient.addColorStop(0.6, 'rgba(255, 240, 200, 0.5)');
            gradient.addColorStop(0.8, 'rgba(255, 240, 200, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add some ring division lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            const divisions = [0.3, 0.5, 0.7, 0.9];
            
            divisions.forEach(pos => {
                const x = canvas.width * pos;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            });
            
            const ringTexture = new THREE.CanvasTexture(canvas);
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planets[planet].add(ring);
        }
        
        scene.add(planets[planet]);
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle planet click using raycasting
function onPlanetClick(event) {
    if (isTransitioning) return;
    
    // Calculate mouse position in normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Get all objects intersecting the ray (excluding the sun)
    const planetObjects = [];
    for (const planet in planets) {
        if (planet !== 'sun') { // Exclude the sun from clickable objects
            planetObjects.push(planets[planet]);
        }
    }
    
    const intersects = raycaster.intersectObjects(planetObjects);
    
    if (intersects.length > 0) {
        // Find which planet was clicked
        const clickedPlanet = intersects[0].object;
        for (const planet in planets) {
            if (planets[planet] === clickedPlanet) {
                // First show info about the planet
                zoomToPlanet(planet);
                
                // After 3 seconds of viewing the planet, dispatch event to start the quiz
                setTimeout(() => {
                    // Create and dispatch a custom event that the main app can listen for
                    const event = new CustomEvent('planet-selected', {
                        detail: { planet: planet }
                    });
                    document.dispatchEvent(event);
                }, 3000);
                break;
            }
        }
    }
}

// Zoom to a specific planet
function zoomToPlanet(planetName) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Disable orbit controls during transition
    controls.enabled = false;
    
    // Store current planet for tracking
    currentZoom = planetName;
    
    // Target position for camera
    const planet = planets[planetName];
    const planetPos = planet.position.clone();
    const offset = planetName === 'sun' ? 80 : planetData[planetName].radius * 6;
    
    // Calculate target position for camera
    const cameraTargetPos = planetPos.clone().add(
        new THREE.Vector3(offset, offset / 2, offset)
    );
    
    // Animate camera transition
    const startPos = camera.position.clone();
    const startRotation = camera.quaternion.clone();
    
    // Create target quaternion - camera looking at planet
    const targetQuaternion = new THREE.Quaternion();
    const dummyCamera = new THREE.Object3D();
    dummyCamera.position.copy(cameraTargetPos);
    dummyCamera.lookAt(planetPos);
    targetQuaternion.copy(dummyCamera.quaternion);
    
    // Show info panel with planet data
    showPlanetInfo(planetName);
    
    // Animate transition
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function zoomAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease in-out function
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        // Update camera position
        camera.position.lerpVectors(startPos, cameraTargetPos, easeProgress);
        
        // Update camera rotation
        camera.quaternion.slerpQuaternions(startRotation, targetQuaternion, easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(zoomAnimation);
        } else {
            isTransitioning = false;
            controls.enabled = true;
            controls.target.copy(planetPos);
        }
    }
    
    zoomAnimation();
}

// Reset view to show the entire solar system
function resetView() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Hide planet info panel
    document.getElementById('planet-info-panel').classList.remove('active');
    
    // Disable orbit controls during transition
    controls.enabled = false;
    
    // Target position
    const targetPos = new THREE.Vector3(0, 100, 300);
    const startPos = camera.position.clone();
    
    // Target rotation - looking at the center
    const startRotation = camera.quaternion.clone();
    const targetQuaternion = new THREE.Quaternion();
    const dummyCamera = new THREE.Object3D();
    dummyCamera.position.copy(targetPos);
    dummyCamera.lookAt(0, 0, 0);
    targetQuaternion.copy(dummyCamera.quaternion);
    
    // Animate transition
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function resetAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease in-out function
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        // Update camera position
        camera.position.lerpVectors(startPos, targetPos, easeProgress);
        
        // Update camera rotation
        camera.quaternion.slerpQuaternions(startRotation, targetQuaternion, easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(resetAnimation);
        } else {
            isTransitioning = false;
            controls.enabled = true;
            controls.target.set(0, 0, 0);
            currentZoom = null;
        }
    }
    
    resetAnimation();
}

// Show information about the selected planet
function showPlanetInfo(planetName) {
    const infoPanel = document.getElementById('planet-info-panel');
    const planetTitle = document.getElementById('planet-info-title');
    const planetFacts = document.getElementById('planet-info-facts');
    
    // Set planet name
    planetTitle.textContent = planetData[planetName].name;
    
    // Clear previous facts
    planetFacts.innerHTML = '';
    
    // Add new facts
    planetData[planetName].facts.forEach(fact => {
        const factElement = document.createElement('p');
        factElement.textContent = fact;
        planetFacts.appendChild(factElement);
    });
    
    // Show the panel
    infoPanel.classList.add('active');
}

// Function to update planets (used by both animation loops)
function updatePlanets() {
    // Rotate the sun
    planets.sun.rotation.y += planetData.sun.rotationSpeed;
    
    // Update planets' positions and rotations
    for (const planet in planetData) {
        if (planet === 'sun') continue; // Skip the sun
        
        // Update planet rotation
        planets[planet].rotation.y += planetData[planet].rotationSpeed;
        
        // Calculate new orbital position
        if (currentZoom !== planet || true) { // Keep orbiting even when zoomed in
            const orbit = planetData[planet].orbitSpeed;
            const distance = planetData[planet].distanceFromSun * distanceScale;
            
            // Get current orbital angle and increment it
            const currentAngle = Math.atan2(
                planets[planet].position.z,
                planets[planet].position.x
            );
            const newAngle = currentAngle + orbit;
            
            // Set new position
            planets[planet].position.x = Math.cos(newAngle) * distance;
            planets[planet].position.z = Math.sin(newAngle) * distance;
        }
    }
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update all planet positions and rotations
    updatePlanets();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the 3D scene when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
