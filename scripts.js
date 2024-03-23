import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
//import dat from "https://cdn.skypack.dev/dat.gui";
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

let canvas = document.querySelector('.webgl');

let scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1000, 350000);
camera.position.set(700, 1300, 3000);

camera.zoom = 1.3;
camera.updateProjectionMatrix();
scene.add(camera);

/*var gui = new dat.GUI();

gui.add(camera.position, 'x', -1000 , 5000 );
gui.add(camera.position, 'y' , 0 , 5000);
gui.add(camera.position, 'z' , 0 , 5000);

gui.add(camera.rotation, 'x', -1 , 1 ).step(0.001);
gui.add(camera.rotation, 'y' , -1 , 1).step(0.001);
gui.add(camera.rotation, 'z' , -1 , 1).step(0.001);
gui.add(camera, 'zoom');
gui.add(camera, 'fov', 1, 180).onChange( camera.updateProjectionMatrix() );

class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(camera.updateProjectionMatrix());
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(camera.updateProjectionMatrix());*/



let istreasureopen = false;
let map = null;
let chest_top = null;

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
    //alpha: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(10, 450, 10);
controls.minDistance = 2000;
controls.maxDistance = 3000;
controls.zoomSpeed = 1;
controls.minPolarAngle = 0;
controls.maxPolarAngle =  Math.PI * 0.5;
controls.update();

let light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
light.position.set(50,60,40);
light.castShadow = true;
light.target.position.set(0, 0, 0);
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.far = 500.0;
light.shadow.camera.near = 0.5;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
scene.add(light);

//Load background texture
/*const bgloader = new THREE.TextureLoader();
bgloader.load('images/bg2.jpg' , function(texture)
{
    scene.background = texture;  
});*/


let light2 = new THREE.AmbientLight(0xFFFFFF, 0.6);
scene.add(light2);

window.addEventListener('resize', () => 
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});

/*let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
let skybox = new THREE.Mesh(skyboxGeo);
scene.add(skybox);

const ft = new THREE.TextureLoader().load("interstellar_ft.tga");
const bk = new THREE.TextureLoader().load("interstellar_bk.png");
const up = new THREE.TextureLoader().load("skyboxes/envmap_interstellar/interstellar_up.tga");
const dn = new THREE.TextureLoader().load("interstellar_dn.tga");
const rt = new THREE.TextureLoader().load("interstellar_rt.tga");
const lf = new THREE.TextureLoader().load("skyboxes/envmap_interstellar/interstellar_lf.tga");

const sides = [ft, bk, up, dn, rt, lf];

var skyMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    envMap: sides,
    opacity: 0,
    transparent: true
});

var skyGeometry = new THREE.BoxGeometry(2000, 2000, 2000);

var skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyMesh);
//renderer.render(scene, camera);*/

/*scene.background = new THREE.CubeTextureLoader().load([
    'skyboxes/envmap_interstellar/interstellar_ft.tga',
    'skyboxes/envmap_interstellar/png/interstellar_bk.png',
    'skyboxes/envmap_interstellar/interstellar_up.tga',
    'skyboxes/envmap_interstellar/interstellar_dn.tga',
    'skyboxes/envmap_interstellar/interstellar_rt.tga',
    'skyboxes/envmap_interstellar/interstellar_lf.tga',
]);*/

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( 'skyboxes/envmap_interstellar/png/interstellar_ft.png');
let texture_bk = new THREE.TextureLoader().load( 'skyboxes/envmap_interstellar/png/interstellar_bk.png');
let texture_up = new THREE.TextureLoader().load( 'skyboxes/envmap_interstellar/png/interstellar_up.png');
let texture_dn = new THREE.TextureLoader().load( 'skyboxes/envmap_interstellar/png/interstellar_dn.png');
let texture_rt = new THREE.TextureLoader().load( 'skyboxes/envmap_interstellar/png/interstellar_rt.png');
let texture_lf = new THREE.TextureLoader().load( 'skyboxes/envmap_interstellar/png/interstellar_lf.png');
  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );


const gltfloader = new GLTFLoader();
gltfloader.load('forestscene/scene.gltf',(gltf) => {
    gltf.scene;
    gltf.scene.traverse(c => { c.castShadow = true; });
    gltf.scene.scale.set(5,5,5);//to scale

    scene.add(gltf.scene);
});

const chestgltfloader = new GLTFLoader();
chestgltfloader.load('models/chest_top.glb',(gltf) => {
        chest_top = gltf.scene;
        gltf.scene.scale.set(100,100,100);//to scale
        gltf.scene.traverse(c => { c.castShadow = true; 
        }
    );

    gltf.scene.translateX(-650);
    gltf.scene.translateY(250);

    gltf.scene.rotation.y = -370;
    gltf.scene.translateZ(250);
    scene.add(gltf.scene);
});

const chestgltfloaderbase = new GLTFLoader();
chestgltfloaderbase.load('models/chest_base.glb',(gltf) => {
        gltf.scene;
        gltf.scene.scale.set(100,100,100);//to scale
        gltf.scene.traverse(c => { c.castShadow = true; 
    });

    gltf.scene.translateX(-650);
    gltf.scene.translateY(250);

    gltf.scene.rotation.y = -370;
    gltf.scene.translateZ(250);
    scene.add(gltf.scene);
});

const maploader = new GLTFLoader();
maploader.load('models/mapv2.glb',(gltf) => {
    map = gltf.scene;
    gltf.scene.scale.set(800, 800, 800);//to scale
    gltf.scene.traverse(c => { 
    c.castShadow = true; 
    });

    gltf.scene.translateX(150);
    gltf.scene.translateY(470);
    gltf.scene.translateZ(700);

    gltf.scene.rotation.x = 0;
    gltf.scene.rotation.y = 40.5;
    gltf.scene.rotation.z = 80.1;

    scene.add(gltf.scene);

    // if(map)
    // {
    // gui.add(map.rotation, 'x', -5 , 100).step(0.001);
    // gui.add(map.rotation, 'y' , 30 , 50).step(0.001);
    // gui.add(map.rotation, 'z' , -5 , 100).step(0.001);

    // gui.add(map.position, 'x' , -500 , 500).step(0.001);
    // gui.add(map.position, 'y' , -500 , 500).step(0.001);
    // gui.add(map.position, 'z' , 700 ,1000).step(0.001);
    // }
});


renderer.domElement.addEventListener('click', onClick, false);

function onClick() {

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
  
    var intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects)

    if (intersects.length > 0) 
    {
      if(intersects[0].object.material.name == 'maps_updated-removebg')
      {
        closeMap();
      }
        
    }
}

function openMap()
{
    istreasureopen = true;
                
    document.getElementById('openmap').style.display = 'none';
    gsap.to(camera.position, {
        y: 1800, duration:1.5
    });

    gsap.to(map.rotation, {
        x: 1.5,
        y: 42.5,
        z: 77.28,
        duration:1
    });

    gsap.to(map.scale, {
        x: 2900,
        y: 2900,
        z: 2900,
        duration:1.5
    });

    map.translateX(-700);
    map.translateY(10);
    map.translateZ(30);
}

function closeMap()
{
    document.getElementById('openmap').style.display = 'none';
    istreasureopen = true;
    
    gsap.to(camera.position, {
        y: 1300, duration:1.5
    });

    gsap.to(map.rotation, {
        x: 0,
        y: 40.5,
        z: 80.1,
        duration:1
    });

    gsap.to(map.position, {
        y: 489,
        z: 730.2,
        delay: 0.5,
        duration:1
    });

    gsap.to(map.scale, {
        x: 300,
        y: 300,
        z: 300,
        duration:1
    });

    map.translateX(-800);
    map.translateY(10);
    map.translateZ(30);

    setTimeout(openChest(),1000);

    setTimeout(function(){
        window.location.href = 'portfolio.html';
     }, 3000);
}

function openChest(){
    gsap.to(chest_top.rotation, {
       x: -0.5,
        duration: 1.5
    });
    gsap.to(camera.position, {
        x: 28,
        y: 965,
        z: 1345,
        delay: 1,
        duration: 1.5
     });

     gsap.to(camera.rotation, {
        x:-0.43,
        y:0.37,
        z: 0.134,
        delay: 1,
        duration: 1.5
     });

     gsap.to(camera, {
        fov: 4,
        near: 37,
        delay: 1,
        duration: 1.5
     });
}

// document.addEventListener('mousemove', function(e) {
//     skybox.rotation.y += e.clientY * 0.00002;
//   });

function animate()
{
    if(!istreasureopen && map)
    {
        document.getElementById('openmap').style.display = 'block';
        map.rotation.y += 0.005;
        document.onkeydown = function(e) 
        {
            switch (e.key) 
            {
                case 'v':
                openMap();

                break;
            }
        };
    }
    skybox.rotation.y -=  0.0004;
    camera.updateProjectionMatrix();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();




    //   const fbxLoader = new FBXLoader()
    //   fbxLoader.load(
    //       'models/jolleen.fbx', (object) => {
    //           //const anim = new FBXLoader()
    //          //  anim.load('models/Standing Idle.fbx', (anim) =>{
    //          //      const mixer = new THREE.AnimationMixer(object)
    //          //      const idle = mixer.clipAction(anim.animations[0])
    //          //      idle.play()
    //          // })
    //           object.scale.set(5,5,5)
    //           object.scene.position.x = 3;
    //           scene.add(object)
    //       },
    //       (xhr) => {
    //       },
    //       (error) => {
    //           console.log("error : "+error)
    //       }
    //   )