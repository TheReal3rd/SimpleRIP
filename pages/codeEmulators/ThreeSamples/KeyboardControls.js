const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshNormalMaterial()
);

scene.add(cube);

camera.position.z = 5;

const keys = {};

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

function animate() {

    requestAnimationFrame(animate);

    if(keys["w"]) cube.position.z -= 0.05;
    if(keys["s"]) cube.position.z += 0.05;
    if(keys["a"]) cube.position.x -= 0.05;
    if(keys["d"]) cube.position.x += 0.05;

    renderer.render(scene,camera);
}

animate();
