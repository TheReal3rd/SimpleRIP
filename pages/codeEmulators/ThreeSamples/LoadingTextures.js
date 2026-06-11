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

const loader = new THREE.TextureLoader();

loader.load(
"https://threejs.org/examples/textures/uv_grid_opengl.jpg",
(texture)=>{

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({
            map:texture
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
});
