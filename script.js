import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.outputEncoding = THREE.sRGBEncoding; 
document.getElementById('container').appendChild(renderer.domElement);

// Load textures
const loader = new THREE.TextureLoader();
const cardTexture = loader.load('./carapuce-card.png');
const normalMap = loader.load('./Water_002_NORM.jpg'); 

// Create card geometry
const cardWidth = 5;
const cardHeight = 7;
const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

// Create card material with holographic effect
const material = new THREE.MeshStandardMaterial({
    map: cardTexture,       
    normalMap: normalMap,   
    metalness: 0.9,         
    roughness: 0.8,         
    transparent: true,      
    side: THREE.DoubleSide, 
});

// Create the card mesh
const card = new THREE.Mesh(geometry, material);
scene.add(card);

// Add environment lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Add point lights for dynamic reflections
const pointLight1 = new THREE.PointLight(0xff00ff, 1, 90);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ffff, 1, 50);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// Rotate lights dynamically
function animateLights() {
    const time = Date.now() * 0.001;
    pointLight1.position.x = Math.sin(time) * 10;
    pointLight1.position.z = Math.cos(time) * 10;

    pointLight2.position.y = Math.sin(time * 0.8) * 10;
    pointLight2.position.x = Math.cos(time * 0.8) * 10;
}

// Position the card and camera
card.position.set(0, 0, 0);
camera.position.z = 10;

// Add mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Add interactive rotation
    card.rotation.y = mouseX * 0.3;
    card.rotation.x = mouseY * 0.3;

    animateLights();
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
