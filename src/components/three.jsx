import { useEffect } from "react"
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Three(){

    useEffect(() => {
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 6);

        scene.add(camera);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        //RENDERER
        document.body.appendChild(renderer.domElement);

        //CONTROLS
        const controls = new OrbitControls(camera, renderer.domElement);

        controls.enableDamping = true;

        //GLTF LOADER
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            './anteojos.gltf',
            (gltf) => {
                gltf.scene.position.set(0, 1, 0);
                var model = gltf.scene;
                var newMaterial = new THREE.MeshNormalMaterial({flatShading: true});
                model.traverse((o) => {
                    if (o.isMesh) o.material = newMaterial;
                });
                scene.add(gltf.scene);
            }
        );


        //TEXTURE LOADER
        const textureLoader = new THREE.TextureLoader();
        const matcap = textureLoader.load('./matcap.jpg');

        const map = textureLoader.load('./base.jpg');
        const AOMap = textureLoader.load('./ambientalOclusion.jpg');
        const normals = textureLoader.load('./normales.jpg');
        const roughness = textureLoader.load('./roughness.jpg');
        const height = textureLoader.load('./height.png');

        //SPHERE
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry( 0.6, 32, 16 ),
            new THREE.MeshMatcapMaterial({matcap: matcap}),
        );
        sphere.position.set(-1.5, 0, 0)
        scene.add(sphere);

        //CUBO
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1,
                4, 4, 4    
            ),
            new THREE.MeshStandardMaterial({
                map: map,
                aoMap: AOMap,
                roughnessMap: roughness,
                normalMap: normals,
                displacementMap: height,
                displacementScale: 0.001,
            })
        );
        scene.add(cube);

        //LIGHTS
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0xffffff, 5);
        pointLight.position.set(-1, 2, 1);
        scene.add(ambientLight);
        scene.add(pointLight);

        //TORUSKNOT
        const torusKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry( 0.4, 0.1, 100, 16 ),
            new THREE.MeshNormalMaterial({flatShading: true}), 
        );
        torusKnot.position.set(1.5, 0, 0);
        scene.add(torusKnot);
        

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        //CLEAN UP 
        return () => {
            document.body.removeChild(renderer.domElement);
        }
    }, []);
    return (
        <div 
            className="contenedor3D"
        >
        </div>
    )
}