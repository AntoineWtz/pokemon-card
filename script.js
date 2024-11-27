import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Load card texture
const loader = new THREE.TextureLoader();
const texture = loader.load(
    './carapuce-card.png', // Path to your card image
    () => console.log('Texture loaded successfully'),
    undefined,
    (err) => console.error('Error loading texture', err)
);

// Create the card geometry
const cardWidth = 5;
const cardHeight = 7;
const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

// Create material with texture (no lighting interaction)
const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,  // Display on both sides
});

// Create the card mesh
const card = new THREE.Mesh(geometry, material);
scene.add(card);

// Add dynamic holographic lights (we'll use a ShaderMaterial for this)
const light1 = new THREE.PointLight(0xff00ff, 1.5, 50);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.PointLight(0x00ffff, 1.5, 50);
light2.position.set(-10, -10, 10);
scene.add(light2);

const light3 = new THREE.PointLight(0xffff00, 1.5, 50);
light3.position.set(0, 10, -10);
scene.add(light3);

// Create a spotlight to simulate glow effect
const spotLight = new THREE.SpotLight(0x00ff00, 2, 50, Math.PI / 4, 0.5, 1);
spotLight.position.set(0, 5, 10);
scene.add(spotLight);

// Rotate lights dynamically
function animateLights() {
    const time = Date.now() * 0.001;
    light1.position.x = Math.sin(time) * 10;
    light1.position.z = Math.cos(time) * 10;

    light2.position.y = Math.sin(time * 0.8) * 10;
    light2.position.x = Math.cos(time * 0.8) * 10;

    light3.position.z = Math.sin(time * 1.2) * 10;
    light3.position.y = Math.cos(time * 1.2) * 10;
}

// Position the card and camera
camera.position.z = 10;

// Add mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseX = normalizedX;
    mouseY = normalizedY;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    animateLights();

    // Add interactive rotation
    card.rotation.y = mouseX * 0.5;
    card.rotation.x = mouseY * 0.5;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
