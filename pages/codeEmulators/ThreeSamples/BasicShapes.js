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

const material = new THREE.MeshNormalMaterial();

const cube =
new THREE.Mesh(new THREE.BoxGeometry(),material);

cube.position.x = -3;

const sphere =
new THREE.Mesh(new THREE.SphereGeometry(1,32,32),material);

const cone =
new THREE.Mesh(new THREE.ConeGeometry(1,2,32),material);

cone.position.x = 3;

scene.add(cube);
scene.add(sphere);
scene.add(cone);

camera.position.z = 8;

function animate(){

    requestAnimationFrame(animate);

    cube.rotation.y += 0.01;
    sphere.rotation.y += 0.01;
    cone.rotation.y += 0.01;

    renderer.render(scene,camera);
}

animate();
