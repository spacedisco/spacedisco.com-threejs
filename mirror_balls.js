import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from 'https://unpkg.com/three@0.126.0/examples/jsm/utils/BufferGeometryUtils.js';

import gsap from "gsap";

const surfaceCanvas = document.querySelector('#surface');

document.addEventListener('DOMContentLoaded', () => {
    const surface = createMirrorBalls()

    window.surface = surface

    console.log({surface})
});

export async function createMirrorBalls(n=6) {

    const matcapTexture = await (new THREE.TextureLoader()).loadAsync('/assets/matcap-crystal.png')

    let surface = new MirrorBallsSurface(matcapTexture);

    surface.createObjects(matcapTexture);

    surface.startLoop(surface);

    window.addEventListener('resize', () => {
        surface.updateSize();
    }, false);

    return surface
}

export async function createMirrorBall() {

    const matcapTexture = await (new THREE.TextureLoader()).loadAsync('/assets/matcap-crystal.png')

    let surface = new MirrorBallsSurface({ texture: matcapTexture });

    const ball = surface.createMirrorBall()

    surface.startLoop(surface);

    return surface
}

export class MirrorBall {
 
    constructor({ texture, radius }) {

        this.ballInnerMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });

        this.mirrorMaterial = new THREE.MeshMatcapMaterial({ side: THREE.BackSide });

        this.mirrorMaterial.matcap = texture;

        this.radius = radius || 1 + Math.random()

        this.group = this.createBall();

    }

    createBall() {
        const ballInnerGeometry = new THREE.SphereBufferGeometry(radius, 9, 9);

        let isoGeometry = new THREE.IcosahedronBufferGeometry(radius, 3);
        isoGeometry.deleteAttribute('normal');
        isoGeometry.deleteAttribute('uv');
        isoGeometry = BufferGeometryUtils.mergeVertices(isoGeometry);
        const mirrorGeometry = new THREE.PlaneBufferGeometry(.23 * radius, .23 * radius, 1, 1);

        let isoVertices = isoGeometry.attributes.position.array;
        let instancedMirrorMesh = new THREE.InstancedMesh(
            mirrorGeometry,
            this.mirrorMaterial,
            isoGeometry.attributes.position.count
        );
        for (let i = 0; i < isoVertices.length; i += 3) {
            this.dummy.position.set(isoVertices[i], isoVertices[i + 1], isoVertices[i + 2]);
            this.dummy.lookAt(0, 0, 0);
            this.dummy.updateMatrix();
            instancedMirrorMesh.setMatrixAt(i / 3, this.dummy.matrix);
        }

        const group = new THREE.Group();
        group.add(new THREE.Mesh(
            ballInnerGeometry,
            this.ballInnerMaterial
        ));
        group.add(instancedMirrorMesh);
        return group;
    }
}

export class MirrorBallsSurface {

    constructor(matcapTexture, scene, renderer) {
        this.scene = scene || new THREE.Scene();
        this.scene.background = new THREE.Color(0xE5E6E8);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 25);

        this.renderer = renderer || new THREE.WebGLRenderer({canvas: surfaceCanvas});
        this.updateSize();

        this.createOrbitControls();

        this.ballInnerMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        this.mirrorMaterial = new THREE.MeshMatcapMaterial({ side: THREE.BackSide });
        this.mirrorMaterial.matcap = matcapTexture;
    }

    createOrbitControls() {
        this.controls = new OrbitControls(this.camera, surfaceCanvas);
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableDamping = true;
        this.controls.minPolarAngle = .35 * Math.PI;
        this.controls.maxPolarAngle = .65 * Math.PI;
        this.controls.autoRotate = true;
    }

    createObjects(matcapTexture, numberOfBalls=6) {

        this.balls = [];



        for (let i = 0; i < numberOfBalls; i++) {



            const ball = this.createBall(1 + Math.random(), matcapTexture);

            this.balls.push(ball)

            this.addBallToScene(ball)

        }

        return this.balls
    }

    addBallToScene(ball) {

        ball.position.set(
            Math.random() * 12 - 6,
            Math.random() * 12 - 6,
            Math.random() * 12 - 6,
        )

        this.scene.add(ball)

    }

    createBall(radius) {
        this.dummy = new THREE.Object3D();

        const ballInnerGeometry = new THREE.SphereBufferGeometry(radius, 9, 9);

        let isoGeometry = new THREE.IcosahedronBufferGeometry(radius, 3);
        isoGeometry.deleteAttribute('normal');
        isoGeometry.deleteAttribute('uv');
        isoGeometry = BufferGeometryUtils.mergeVertices(isoGeometry);
        const mirrorGeometry = new THREE.PlaneBufferGeometry(.23 * radius, .23 * radius, 1, 1);

        let isoVertices = isoGeometry.attributes.position.array;

        console.log('material', this.mirrorMaterial)

        let instancedMirrorMesh = new THREE.InstancedMesh(
            mirrorGeometry,
            this.mirrorMaterial,
            isoGeometry.attributes.position.count
        );
        for (let i = 0; i < isoVertices.length; i += 3) {
            this.dummy.position.set(isoVertices[i], isoVertices[i + 1], isoVertices[i + 2]);
            this.dummy.lookAt(0, 0, 0);
            this.dummy.updateMatrix();
            instancedMirrorMesh.setMatrixAt(i / 3, this.dummy.matrix);
        }

        const group = new THREE.Group();
        group.add(new THREE.Mesh(
            ballInnerGeometry,
            this.ballInnerMaterial
        ));
        group.add(instancedMirrorMesh);
        return group;
    }

    startLoop(surface) {
        surface.balls.forEach((b, bIdx) => {
            gsap.timeline({
                repeat: -1,
                onUpdate: () => {
                    if (bIdx === 0) {
                        surface.controls.update();
                        surface.renderer.render(surface.scene, surface.camera);
                    }
                }
            })
                .to(b.rotation, {
                    duration: 4 + Math.random() * 4,
                    y: Math.random() > .5 ? -2 * Math.PI: 2 * Math.PI,
                    ease: 'none'
                })
        })
    }

    updateSize() {
        surfaceCanvas.style.width = window.innerWidth + 'px';
        surfaceCanvas.style.height = window.innerHeight + 'px';
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}