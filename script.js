// Global Variables
let scene, camera, renderer;
let ground, player;
let obstacles = [];
let obstacleSpawnInterval = 2000; // in ms
let lastObstacleTime = 0;
let gameSpeed = 0.2;
let laneWidth = 4;
let currentLane = 0; // 0: center; -1: left; 1: right

// Initialize Scene
function init() {
  const container = document.getElementById("game-container");
  
  // Scene and Camera
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.002);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  
  // Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 10, 5);
  scene.add(directionalLight);
  
  // Ground (a large plane that moves)
  const groundGeometry = new THREE.PlaneGeometry(20, 1000);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -400;
  scene.add(ground);
  
  // Player (a simple cube)
  const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
  const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(0, 1, 5);
  scene.add(player);
  
  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);
  
  // Handle player input (arrow keys)
  window.addEventListener("keydown", handleKeyDown, false);
  
  animate();
}

// Window resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle arrow keys for lane change
function handleKeyDown(e) {
  if (e.key === "ArrowLeft" && currentLane > -1) {
    currentLane--;
  } else if (e.key === "ArrowRight" && currentLane < 1) {
    currentLane++;
  }
  // Smooth transition to lane
  const targetX = currentLane * laneWidth;
  // Tweening can be used here; for simplicity, set directly:
  player.position.x = targetX;
}

// Spawn obstacles (simple boxes) ahead on random lanes
function spawnObstacle() {
  const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
  const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  
  // Random lane: -1, 0, or 1
  const lane = [-1, 0, 1][Math.floor(Math.random() * 3)];
  obstacle.position.x = lane * laneWidth;
  obstacle.position.y = 1;
  obstacle.position.z = -400; // start at the far end of ground
  
  scene.add(obstacle);
  obstacles.push(obstacle);
}

// Animation loop
function animate(timestamp) {
  requestAnimationFrame(animate);
  
  // Move ground towards the camera to simulate running
  ground.position.z += gameSpeed;
  if (ground.position.z > 50) {
    ground.position.z = -400;
  }
  
  // Move obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].position.z += gameSpeed;
    // Collision detection with player
    if (obstacles[i].position.z > player.position.z - 1 &&
        obstacles[i].position.z < player.position.z + 1 &&
        Math.abs(obstacles[i].position.x - player.position.x) < 1.5) {
      // Collision occurred
      console.log("Game Over!");
      // Here you can implement a restart or game over screen
      // For now, stop the game
      return;
    }
    // Remove obstacles that passed the camera
    if (obstacles[i].position.z > camera.position.z + 10) {
      scene.remove(obstacles[i]);
      obstacles.splice(i, 1);
    }
  }
  
  // Spawn new obstacles at intervals
  if (!lastObstacleTime) lastObstacleTime = timestamp;
  if (timestamp - lastObstacleTime > obstacleSpawnInterval) {
    spawnObstacle();
    lastObstacleTime = timestamp;
  }
  
  renderer.render(scene, camera);
}

// Start the game
init();
