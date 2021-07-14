import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLightHelper } from 'three'
import { PCFShadowMap } from 'three'



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Texture loader
const textureloader = new THREE.TextureLoader()
const billboardColorTexture = textureloader.load('/textures/billboard/Plastic010_2K_Color.png')
const billboardAmbientOcclusionTexture = textureloader.load('/textures/billboard//floor/Plastic_Rough_001_ambientOcclusion.jpg')
const billboardNormalTexture = textureloader.load('/textures/billboard/Plastic010_2K_Normal.png')
const billboardDisplacementTexture = textureloader.load('/textures/billboard/Plastic010_2K_Displacement.png')
const billboardRoughnessTexture = textureloader.load('/textures/billboard/Plastic010_2K_Roughness.png')

const floorColorTexture = textureloader.load('/textures/billboard/floor/Plastic_Rough_001_basecolor.jpg')
const floorAoTexture = textureloader.load('/textures/billboard/floor/Plastic_Rough_001_ambientOcclusion.jpg')
const floorHeightTexture = textureloader.load('/textures/billboard/floor/Plastic_Rough_001_height.png')
const floorNormalTexture = textureloader.load('/textures/billboard/floor/Plastic_Rough_001_normal.jpg')
const floorRoughnessTexture = textureloader.load('/textures/billboard/floor/Plastic_Rough_001_roughness.jpg')


/**
 * Objects
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 3),
    new THREE.MeshStandardMaterial({
        map: billboardColorTexture,
        transparent: true,
        displacementMap: billboardDisplacementTexture,
        displacementScale: 5,
        aoMap: billboardAmbientOcclusionTexture,
        normalMap: billboardNormalTexture,
        roughnessMap: billboardRoughnessTexture,
        side: THREE.DoubleSide
    })
)

floor.position.z = -2.75
floor.roughness = 100


const ground = new THREE.Mesh(
    new THREE.BoxGeometry(8, 3),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        transparent: true,
        displacementMap: floorHeightTexture,
        displacementScale: 0,
        aoMap: floorAoTexture,
        normalMap: floorNormalTexture,
        roughnessMap: floorRoughnessTexture
    })
)
scene.add(ground)


// Font loader
const fontLoader = new THREE.FontLoader()

fontLoader.load('/fonts/helvetiker_bold.typeface.json',
(font) => {
    const nameGeometry = new THREE.TextGeometry('Bently Sengrath', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.005,
        bevelOffset: 0,
        bevelSegments: 4,
    })

    const name = new THREE.Mesh(nameGeometry, new THREE.MeshStandardMaterial())
    scene.add(floor, name)
    name.wireFrame = true
    name.position.z = 1.9
    name.position.x = -2.50
    name.position.y = -0.5
    name.rotation.y = 0.015

    gui.add(name.position, 'z').min(0).max(10).step(0.5)
    gui.add(name.position, 'x').min(-5).max(10).step(0.05)

    name.castShadow = true
    name.receiveShadow = true
})




/**
 * Debug
 */

const gui = new dat.GUI()
const parameters = {}


//BillBoard gui
//gui.add(floor.roughness)

//gui.add(floor.position, 'x').min(2).max(10).step(0.001)
//gui.add(floor.position, 'y').min(2).max(10).step(0.001)
//gui.add(floor.position, 'z').min(-20).max(5).step(0.015)


gui.add(ground.position, 'x').min(-10).max(10).step(0.5)
gui.add(ground.position, 'y').min(-10).max(10).step(0.5)
gui.add(ground.position, 'z').min(-0).max(10).step(0.5)
gui.add(ground.rotation, 'x').min(-0).max(10).step(0.001)
ground.rotation.x = 1.57
ground.position.set(0, -2, 3.1)

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('white', 0.00012)
scene.add(directionalLight)

directionalLight.position.set(4, 3, 4)
scene.add(directionalLight.target)

//helper for directionalLight
//const helper = new THREE.DirectionalLightHelper(directionalLight, 0.12);
//scene.add( helper );

//ambientLight
const ambientLight = new THREE.AmbientLight('purple', 0.014)
gui.add(ambientLight, 'intensity').min(0).max(5).step(0.001)
scene.add(ambientLight)

//Hemispehre Light
const HeimLight = new THREE.HemisphereLight('orange', 'purple', 2)
HeimLight.position.z = 0.09
HeimLight.position.y = 0.375
HeimLight.rotation.y = 20
const HemisphereLightHelper = new THREE.HemisphereLightHelper(HeimLight, 2)

//gui.add(HeimLight.position, 'z').min(-5).max(20).step(0.015)
//gui.add(HeimLight.position, 'y').min(-5).max(20).step(0.015)

scene.add(HeimLight)

//Point Light
const pointLight = new THREE.PointLight(0xffffff, 1, 7)
pointLight.position.z = 2.535
pointLight.position.y = 1.725
scene.add(pointLight)
const pointlightHelper = new THREE.PointLightHelper(pointLight, 1)
//scene.add(pointlightHelper)

//pointlightHelper.update()
//gui.add(pointLight.position, 'z').min(-5).max(20).step(0.015)
//gui.add(pointLight.position, 'y').min(-5).max(20).step(0.015)


/**
 * casting shadows
 */

directionalLight.castShadow = true
ambientLight.castShadow = true
HeimLight.castShadow = true
ground.castShadow = true
ground.receiveShadow = true


/**
* window resize
*/

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight


    //Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// renderer
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Camera
 */

 const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
 camera.position.set(4, 2, 5)
 scene.add(camera)
 
 
/**
 * Orbit Controls
 */

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//animate
const clock = new THREE.Clock()


const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Request the next frame 
    window.requestAnimationFrame(animate)
}

animate()