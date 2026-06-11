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

const cube = new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshNormalMaterial()
);

scene.add(cube);

camera.position.z = 4;

window.addEventListener("mousemove",(e)=>{

    const x = (e.clientX/window.innerWidth)*2-1;
    const y = (e.clientY/window.innerHeight)*2-1;

    camera.position.x = x*3;
    camera.position.y = -y*3;

    camera.lookAt(0,0,0);
});

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

animate();
