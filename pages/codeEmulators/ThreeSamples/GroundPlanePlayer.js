const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const player =
new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshNormalMaterial()
);

scene.add(player);

const ground =
new THREE.Mesh(
new THREE.PlaneGeometry(20,20),
new THREE.MeshBasicMaterial({
wireframe:true
})
);

ground.rotation.x = -Math.PI/2;

scene.add(ground);

camera.position.set(0,5,8);
camera.lookAt(0,0,0);

const keys = {};

window.addEventListener("keydown",
e=>keys[e.key.toLowerCase()]=true);

window.addEventListener("keyup",
e=>keys[e.key.toLowerCase()]=false);

function animate(){

requestAnimationFrame(animate);

if(keys["w"]) player.position.z -= 0.05;
if(keys["s"]) player.position.z += 0.05;
if(keys["a"]) player.position.x -= 0.05;
if(keys["d"]) player.position.x += 0.05;

renderer.render(scene,camera);
}

animate();
