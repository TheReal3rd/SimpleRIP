const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(renderer.domElement);

for(let i=0;i<200;i++){

    const cube =
    new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshNormalMaterial()
    );

    cube.position.set(
        (Math.random()-0.5)*50,
        (Math.random()-0.5)*50,
        (Math.random()-0.5)*50
    );

    scene.add(cube);
}

camera.position.z = 20;

function animate(){

requestAnimationFrame(animate);

scene.rotation.y += 0.002;

renderer.render(scene,camera);
}

animate();
