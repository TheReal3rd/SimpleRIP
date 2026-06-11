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

const cube =
new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshBasicMaterial({
color:0x00ff00
})
);

scene.add(cube);

camera.position.z = 3;

const raycaster =
new THREE.Raycaster();

const mouse =
new THREE.Vector2();

window.addEventListener("click",(e)=>{

mouse.x =
(e.clientX/window.innerWidth)*2-1;

mouse.y =
-(e.clientY/window.innerHeight)*2+1;

raycaster.setFromCamera(mouse,camera);

const hits =
raycaster.intersectObjects(scene.children);

if(hits.length > 0){

    hits[0].object.material.color.set(
        Math.random()*0xffffff
    );
}
});

function animate(){

requestAnimationFrame(animate);

cube.rotation.y += 0.01;

renderer.render(scene,camera);
}

animate();
