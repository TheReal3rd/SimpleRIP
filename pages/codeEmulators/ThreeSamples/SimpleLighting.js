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

const light =
new THREE.DirectionalLight(0xffffff,1);

light.position.set(5,5,5);

scene.add(light);

const cube =
new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial({
        color:0x00ff88
    })
);

scene.add(cube);

camera.position.z = 3;

function animate(){

    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene,camera);
}

animate();
