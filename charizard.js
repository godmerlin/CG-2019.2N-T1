import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

var scene, camera, controls;
var renderer = new THREE.WebGLRenderer();
var loader_ground = new THREE.TextureLoader();
var loader_geodude = new GLTFLoader().setPath( '/modelo/geodude/' );
var loader_mew = new GLTFLoader().setPath('/modelo/mew/');
var loader_zapdos = new GLTFLoader().setPath( '/modelo/zapdos/' );
var ground_y_position = -250;
var mew;
var geodude;
var zapdos;
var sentido=1;
var sentidozap=1;

init();


function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // cena
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xadc8f0, 15, 10000 );

    // ceu
    scene.background = new THREE.Color( 0x0080ff );

    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.set( 0, 1000, -2500 );

    // luz
    scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

    var light = new THREE.DirectionalLight( 0xdfebff, 2.5 );
    light.position.set(-1500,5000,-5000 );
    scene.add( light );

    // chao
     var groundTexture = loader_ground.load( 'texturas/chao.jpg' );
     groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
     groundTexture.repeat.set( 25, 25 );
     groundTexture.anisotropy = 16;
     groundTexture.encoding = THREE.sRGBEncoding;

     var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

     var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
     ground.position.y = ground_y_position;
     ground.rotation.x = - Math.PI / 2;
     scene.add( ground );

    // controles
    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1000;
    controls.maxDistance = 4000;
    controls.enableKeys = false;
    controls.enablePan = false;

    // pokemon
    
    loader_geodude.load('/scene.gltf',geodude_load);

    function geodude_load(gltf){
        geodude = gltf.scene.children[0];
        geodude.scale.set(1.7,1.7,1.7);
        geodude.position.set(0,ground_y_position+10,0);
        geodude.rotation.z = - Math.PI;
        scene.add(geodude);
        
    }

    loader_mew.load('/scene.gltf',mew_load);

    function mew_load(gltf){
        mew = gltf.scene.children[0];
        mew.scale.set(5.7,5.7,5.7);
        mew.position.set(1000,ground_y_position+500,0);
        mew.rotation.z = - Math.PI;
        scene.add(mew);
    }

    loader_zapdos.load('/scene.gltf',zapdos_load);
     
    function zapdos_load(gltf){
        zapdos = gltf.scene.children[0];
        zapdos.scale.set(2.7,2.7,2.7);
        zapdos.position.set(-1000,ground_y_position+500,0);
        zapdos.rotation.z = - Math.PI;
        scene.add(zapdos);
    }
     // movimentacao pokemon
     function onKeyDown(event) {
         var keyCode = event.which;
        var velocidade = 100;
         if (keyCode == 87) {                   // w
             geodude.position.z -= velocidade; 
         } else if (keyCode == 83) {            // s
             geodude.position.z += velocidade;
         } else if (keyCode == 65) {            // a
             geodude.rotation.z += Math.PI / 32;
         } else if (keyCode == 68) {            // d
             geodude.rotation.z -= Math.PI / 32;;
         } else if (keyCode == 81) {            // q
            if(geodude.position.y >= ground_y_position+200)
                geodude.position.y -= velocidade;
        } else if (keyCode == 69) {            // e
            geodude.position.y += velocidade;
         } else if (keyCode == 32) {            // espaco
             geodude.position.set(50,500,100);
         }
     };
     document.addEventListener("keydown", onKeyDown, false);
    
     var listener = new THREE.AudioListener();
     camera.add( listener );
     
     // create a global audio source
     var sound = new THREE.Audio( listener );
     
     // load a sound and set it as the Audio object's buffer
     var audioLoader = new THREE.AudioLoader();
     audioLoader.load( 'sounds/audio.ogg', function( buffer ) {
         sound.setBuffer( buffer );
         sound.setLoop( true );
         sound.setVolume( 0.3 );
         sound.play();
     });
}





function moves(){
        mew.rotation.x += 0.1;

        zapdos.rotation.z += 0.3;
        zapdos.position.z += (20.0 * sentidozap);

        geodude.position.y += (8.0 * sentido);

        if(geodude.position.y<= -250 || geodude.position.y>= 50){
        sentido *=-1;
        } 
        if(zapdos.position.z <= -1000 || zapdos.position.z>=1000){
            sentidozap *=-1;
        }
}

function animate() {
    requestAnimationFrame(animate);
    moves();
    renderer.render(scene, camera);
};


animate();

window.onload = init;