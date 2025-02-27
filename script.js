import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146/build/three.module.js';

// Scene তৈরি করুন
const scene = new THREE.Scene();

// ক্যামেরা তৈরি করুন
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 10);

// Renderer তৈরি করুন
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// মাটির জন্য প্লেন তৈরি করুন
const groundGeometry = new THREE.PlaneGeometry(10, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// প্লেয়ার তৈরি করুন (Cube হিসেবে)
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.position.x > -3) {
        player.position.x -= 3; // বাঁ দিকে যাওয়া
    }
    if (event.key === "ArrowRight" && player.position.x < 3) {
        player.position.x += 3; // ডান দিকে যাওয়া
    }
    if (event.key === "ArrowUp") {
        player.position.y += 3; // লাফ দেওয়া
        setTimeout(() => { player.position.y -= 3; }, 300);
    }
});
const obstacles = [];

function createObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set((Math.random() - 0.5) * 6, 1, -50);
    scene.add(obstacle);
    obstacles.push(obstacle);
}

setInterval(createObstacle, 2000); // প্রতি 2 সেকেন্ডে নতুন বাধা তৈরি

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.position.z += 0.5;
        if (obstacle.position.z > 10) {
            scene.remove(obstacle);
            obstacles.splice(index, 1);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateObstacles();
    renderer.render(scene, camera);
}

animate();
let speed = 0.5;

function moveGround() {
    ground.position.z += speed;
    if (ground.position.z > 50) {
        ground.position.z = -50; // রাস্তা লুপ করবে
    }
}

function increaseSpeed() {
    speed += 0.01; // ধীরে ধীরে গতি বাড়বে
}

setInterval(increaseSpeed, 5000); // প্রতি ৫ সেকেন্ডে গতি বাড়বে

function animate() {
    requestAnimationFrame(animate);
    moveGround();
    updateObstacles();
    renderer.render(scene, camera);
}

animate();
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146/build/three.module.js';

// 🎮 Scene তৈরি করা
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 10);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🛤️ রাস্তা তৈরি করা
const groundGeometry = new THREE.PlaneGeometry(10, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 🏃 প্লেয়ার তৈরি করা
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

// 🎮 প্লেয়ার মুভমেন্ট (Arrow Keys)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.position.x > -3) {
        player.position.x -= 3;
    }
    if (event.key === "ArrowRight" && player.position.x < 3) {
        player.position.x += 3;
    }
    if (event.key === "ArrowUp") {
        player.position.y += 3;
        setTimeout(() => { player.position.y -= 3; }, 300);
    }
});

// 🚧 বাধা (Obstacles) তৈরি করা
const obstacles = [];
function createObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set((Math.random() - 0.5) * 6, 1, -50);
    scene.add(obstacle);
    obstacles.push(obstacle);
}
setInterval(createObstacle, 2000);

// 🪙 কয়েন ও স্কোর সিস্টেম
let score = 0;
const coins = [];
function createCoin() {
    const coinGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coinMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.position.set((Math.random() - 0.5) * 6, 1, -50);
    scene.add(coin);
    coins.push(coin);
}
setInterval(createCoin, 3000);

// 🎮 আপডেট ফাংশন (রাস্তা, বাধা, কয়েন আপডেট করা)
let speed = 0.5;
function updateObjects() {
    ground.position.z += speed;
    if (ground.position.z > 50) ground.position.z = -50;
    
    obstacles.forEach((obstacle, index) => {
        obstacle.position.z += speed;
        if (obstacle.position.z > 10) {
            scene.remove(obstacle);
            obstacles.splice(index, 1);
        }
    });

    coins.forEach((coin, index) => {
        coin.position.z += speed;
        if (coin.position.z > 10) {
            scene.remove(coin);
            coins.splice(index, 1);
        }
        if (player.position.distanceTo(coin.position) < 1.5) {
            score += 10;
            console.log("Score:", score);
            scene.remove(coin);
            coins.splice(index, 1);
        }
    });
}

// 🔄 গতি বাড়ানো
setInterval(() => { speed += 0.01; }, 5000);

// 🏃‍♂️ Animation Loop
function animate() {
    requestAnimationFrame(animate);
    updateObjects();
    renderer.render(scene, camera);
}

animate();
