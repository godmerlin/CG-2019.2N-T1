import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

var scene, camera, controls;
var renderer = new THREE.WebGLRenderer();
var loader_ground = new THREE.TextureLoader();
var loader_geodude = new GLTFLoader().setPath( '/modelo/' );

var ground_y_position = -250;
var geodude;
var sentido=1;
init();


function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // cena
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xadc8f0, 15, 10000 );

    // ceu
    scene.background = new THREE.Color( 0x808000 );

    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.set( 0, 2500, 2500 );

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
    
    loader_geodude.load('/scene.gltf',pokemon_load);

    function pokemon_load(gltf){
        geodude = gltf.scene.children[0];
        geodude.scale.set(1.7,1.7,1.7);
        geodude.position.set(0,ground_y_position+10,0);
        geodude.rotation.z = - Math.PI;
        scene.add(geodude);
    }

    // // movimentacao pokemon
    // function onKeyDown(event) {
    //     var keyCode = event.which;
    //     var velocidade = 100;
    //     if (keyCode == 87) {                   // w
    //         geodude.position.z -= velocidade; 
    //     } else if (keyCode == 83) {            // s
    //         geodude.position.z += velocidade;
    //     } else if (keyCode == 65) {            // a
    //         geodude.rotation.z += Math.PI / 32;
    //     } else if (keyCode == 68) {            // d
    //         geodude.rotation.z -= Math.PI / 32;;
    //     } else if (keyCode == 81) {            // q
    //         if(geodude.position.y >= ground_y_position+200)
    //             geodude.position.y -= velocidade;
    //     } else if (keyCode == 69) {            // e
    //         geodude.position.y += velocidade;
    //     } else if (keyCode == 32) {            // espaco
    //         geodude.position.set(50,500,100);
    //     }
    // };
    // document.addEventListener("keydown", onKeyDown, false);
    

function moves(){


    geodude.position.y += (0.001 * sentido);

    if(geodude.position.y<= -10 || geodude.position.y>= 10){
    sentido *=-1;
    } 

}
}





function moves(){


        geodude.position.y += (0.00001 * sentido);

        if(geodude.position.y<= -10 || geodude.position.y>= 10){
        sentido *=-1;
        } 
    
}
function animate() {
    requestAnimationFrame(animate);
    moves();
    renderer.render(scene, camera);
};


animate();

window.onload = init;