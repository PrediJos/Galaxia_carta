// ESCENA BÁSICA THREE.JS
let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  5000
);

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position="fixed";
renderer.domElement.style.top="0";
renderer.domElement.style.left="0";
document.body.appendChild(renderer.domElement);

camera.position.z = 400;

// LUZ
const light = new THREE.PointLight(0xffffff,1.2);
light.position.set(0,0,0);
scene.add(light);

//////////////////////////////////////////////////
// 🪐 PLANETA TIPO SATURNO
//////////////////////////////////////////////////

const textureLoader = new THREE.TextureLoader();

// textura planeta
const saturnTexture = textureLoader.load(
 "https://threejs.org/examples/textures/planets/saturn.jpg"
);

const planetGeo = new THREE.SphereGeometry(50,64,64);
const planetMat = new THREE.MeshStandardMaterial({
  map:saturnTexture,
  roughness:0.9,
  metalness:0.1
});

const planet = new THREE.Mesh(planetGeo, planetMat);
scene.add(planet);

// 💍 ANILLOS DE SATURNO
const ringTexture = textureLoader.load(
 "https://threejs.org/examples/textures/planets/saturnringcolor.jpg"
);

ringTexture.wrapS = THREE.ClampToEdgeWrapping;
ringTexture.wrapT = THREE.ClampToEdgeWrapping;
ringTexture.encoding = THREE.sRGBEncoding;


const ringGeo = new THREE.RingGeometry(70,110,64);

const ringMat = new THREE.MeshBasicMaterial({
  map: ringTexture,
  side: THREE.DoubleSide,
  transparent: true,

  opacity: 1,          // más visible
  color: 0xd6d6d6      // gris claro
});

const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2.5;
scene.add(ring);

// atmósfera glow suave
const glowGeo = new THREE.SphereGeometry(58,64,64);
const glowMat = new THREE.MeshBasicMaterial({
  color:0xffddaa,
  transparent:true,
  opacity:0.15
});
const glow = new THREE.Mesh(glowGeo, glowMat);
scene.add(glow);



//////////////////////////////////////////////////
// ✨ GALAXIA
//////////////////////////////////////////////////

let galaxyObjects = [];

let stars = new THREE.BufferGeometry();
let starCount = 4000;
let positions = [];

for(let i=0;i<starCount;i++){
  let radius = Math.random()*1200;
  let angle = Math.random()*Math.PI*2;
  let height = (Math.random()-0.5)*200;

  let x = Math.cos(angle)*radius;
  let z = Math.sin(angle)*radius;
  let y = height;

  positions.push(x,y,z);
}

stars.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions,3)
);

let starMaterial = new THREE.PointsMaterial({
  color:0xffffff,
  size:1,
  transparent:true,
  opacity:1
});

let starField = new THREE.Points(stars, starMaterial);
scene.add(starField);
galaxyObjects.push(starField);

//////////////////////////////////////////////////
// 💬 MENSAJES 3D MASIVOS
//////////////////////////////////////////////////

const messages = [
 "Te quiero",
 "Gracias por todo",
 "Eres mi estrella",
 "Gracias por estar",
 "Gracias por existir",
 "Gracias por tu tiempo",
 "Brillas ✨",
 "Te elegiría siempre",
 "Gracias por tu apoyo",
 "Gracias por tanto",
 "Eres increíble",
 "Gracias por acompañarme",
 "Gracias por compartir conmigo",
 "Gracias por formar parte",
 "Gracias por coincidir conmigo ✨"
];

function createTextSprite(message){
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 512;
  canvas.height = 256;

  ctx.fillStyle="white";
  ctx.font="40px Arial";
  ctx.fillText(message,20,120);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map:texture,
    transparent:true,
    opacity:0.9
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(110,55,1);
  return sprite;
}

// 🔥 MUCHOS MENSAJES
for(let i=0;i<200;i++){

  let msg = messages[Math.floor(Math.random()*messages.length)];
  let sprite = createTextSprite(msg);

  let radius = 250 + Math.random()*900;
  let angle = Math.random()*Math.PI*2;
  let height = (Math.random()-0.5)*400;

  sprite.position.set(
    Math.cos(angle)*radius,
    height,
    Math.sin(angle)*radius
  );

  scene.add(sprite);
  galaxyObjects.push(sprite);
}

//////////////////////////////////////////////////
// 🔭 CONTROLES MOUSE
//////////////////////////////////////////////////

let isDragging=false;
let prevX, prevY;

document.addEventListener("mousedown", e=>{
  isDragging=true;
  prevX=e.clientX;
  prevY=e.clientY;
});

document.addEventListener("mouseup", ()=> isDragging=false);

document.addEventListener("mousemove", e=>{
  if(!isDragging) return;
  scene.rotation.y += (e.clientX-prevX)*0.005;
  scene.rotation.x += (e.clientY-prevY)*0.005;
  prevX=e.clientX;
  prevY=e.clientY;
});

document.addEventListener("wheel", e=>{
  camera.position.z += e.deltaY*0.2;
});

//////////////////////////////////////////////////
// 💫 CLICK EN CUALQUIER PARTE → TRANSICIÓN
//////////////////////////////////////////////////

let transitionStarted = false;

renderer.domElement.addEventListener("click", () => {

  if(transitionStarted) return;
  transitionStarted = true;

  let fade = 1;

  let fadeOut = setInterval(() => {

    fade -= 0.02;

    starField.material.opacity = fade;

    galaxyObjects.forEach(obj=>{
      if(obj.material){
        obj.material.opacity = fade;
      }
    });

    camera.position.z -= 1.5;

    if(fade <= 0){
      clearInterval(fadeOut);

      galaxyObjects.forEach(obj=> scene.remove(obj));
      scene.remove(planet);

      document.getElementById("letterScreen")
        .classList.add("show");
    }

  },16);
});

//////////////////////////////////////////////////
// 🔄 ANIMACIÓN
//////////////////////////////////////////////////

function animate(){
  requestAnimationFrame(animate);
  planet.rotation.y += 0.002;
  ring.rotation.z += 0.001;
  glow.rotation.y += 0.001;

  renderer.render(scene,camera);
}

animate();
