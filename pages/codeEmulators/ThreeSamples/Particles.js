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

const particles = 2000;

const geometry = new THREE.BufferGeometry();

const positions = [];

for(let i=0;i<particles;i++){

    positions.push(
        (Math.random()-0.5)*20,
        (Math.random()-0.5)*20,
        (Math.random()-0.5)*20
    );
}

geometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(
positions,
3
)
);

const points =
new THREE.Points(
geometry,
new THREE.PointsMaterial({
size:0.1
})
);

scene.add(points);

camera.position.z = 10;

function animate(){

requestAnimationFrame(animate);

points.rotation.y += 0.002;

renderer.render(scene,camera);
}

animate();
