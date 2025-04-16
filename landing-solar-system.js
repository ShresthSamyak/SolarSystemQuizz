// Simple 3D Solar System for Landing Page
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('landing-3d-container');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        60, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 30, 100);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2, 500);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = THREE.MathUtils.randFloatSpread(500);
        const y = THREE.MathUtils.randFloatSpread(500);
        const z = THREE.MathUtils.randFloatSpread(500);
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Planet data
    const planetData = {
        sun: { 
            radius: 10, 
            color: 0xffcc00, 
            position: [0, 0, 0] 
        },
        mercury: { 
            radius: 2, 
            color: 0x8c8c8c, 
            orbitRadius: 20, 
            speed: 0.008 
        },
        venus: { 
            radius: 3, 
            color: 0xe6c35c, 
            orbitRadius: 30, 
            speed: 0.006 
        },
        earth: { 
            radius: 3.5, 
            color: 0x2277ff, 
            orbitRadius: 40, 
            speed: 0.005 
        },
        mars: { 
            radius: 3, 
            color: 0xc1440e, 
            orbitRadius: 50, 
            speed: 0.004 
        },
        jupiter: { 
            radius: 7, 
            color: 0xe0ae6f, 
            orbitRadius: 65, 
            speed: 0.002 
        },
        saturn: { 
            radius: 6, 
            color: 0xead6b8, 
            orbitRadius: 80, 
            speed: 0.0015,
            hasRings: true
        },
        uranus: { 
            radius: 5, 
            color: 0x9db4ff, 
            orbitRadius: 95, 
            speed: 0.001 
        },
        neptune: { 
            radius: 5, 
            color: 0x3e66f9, 
            orbitRadius: 110, 
            speed: 0.0008 
        }
    };
    
    // Create objects
    const planets = {};
    const orbits = {};
    
    // Create sun
    const sunGeometry = new THREE.SphereGeometry(planetData.sun.radius, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: planetData.sun.color,
        emissive: 0xffff00
    });
    planets.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(planets.sun);
    
    // Sun glow
    const sunGlowGeometry = new THREE.SphereGeometry(planetData.sun.radius * 1.2, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.2
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);
    
    // Create planets and orbits
    for (const name in planetData) {
        if (name === 'sun') continue;
        
        const planet = planetData[name];
        
        // Create orbit
        const orbitGeometry = new THREE.RingGeometry(planet.orbitRadius, planet.orbitRadius + 0.2, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        
        orbits[name] = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbits[name].rotation.x = Math.PI / 2;
        scene.add(orbits[name]);
        
        // Create planet
        const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
        const planetMaterial = new THREE.MeshPhongMaterial({ 
            color: planet.color,
            shininess: 10
        });
        
        planets[name] = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Initial position
        const angle = Math.random() * Math.PI * 2;
        planets[name].position.x = Math.cos(angle) * planet.orbitRadius;
        planets[name].position.z = Math.sin(angle) * planet.orbitRadius;
        
        // Add Saturn's rings
        if (name === 'saturn') {
            const ringGeometry = new THREE.RingGeometry(
                planet.radius * 1.4,
                planet.radius * 2.2,
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
            planets[name].add(ring);
        }
        
        scene.add(planets[name]);
    }
    
    // OrbitControls for interaction (rotation only, no zoom)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.enableZoom = false; // Disable zooming completely
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the sun
        planets.sun.rotation.y += 0.005;
        
        // Update planets
        for (const name in planetData) {
            if (name === 'sun') continue;
            
            const planet = planetData[name];
            const planetObj = planets[name];
            
            // Rotate planet
            planetObj.rotation.y += 0.01;
            
            // Orbit around sun
            const angle = Math.atan2(planetObj.position.z, planetObj.position.x) + planet.speed;
            planetObj.position.x = Math.cos(angle) * planet.orbitRadius;
            planetObj.position.z = Math.sin(angle) * planet.orbitRadius;
        }
        
        // Update controls
        controls.update();
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
    
    // Make sun not clickable (skip ray intersections)
    planets.sun.userData.noClick = true;
    
    // Add click event for planets
    renderer.domElement.addEventListener('click', function(event) {
        // Get mouse position
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycasting
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Get all planets except sun
        const clickablePlanets = [];
        for (const name in planets) {
            if (name !== 'sun') {
                clickablePlanets.push(planets[name]);
            }
        }
        
        // Check for intersections
        const intersects = raycaster.intersectObjects(clickablePlanets);
        
        if (intersects.length > 0) {
            // Go to planet-specific page when clicked
            for (const name in planets) {
                if (planets[name] === intersects[0].object) {
                    // Trigger planet button click
                    const planetButtons = document.querySelectorAll('.planet-btn');
                    planetButtons.forEach(btn => {
                        if (btn.getAttribute('data-planet') === name) {
                            btn.click();
                        }
                    });
                    break;
                }
            }
        }
    });
    
    // Start animation
    animate();
});
