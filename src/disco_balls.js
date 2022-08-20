import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from 'https://unpkg.com/three@0.126.0/examples/jsm/utils/BufferGeometryUtils.js';

import gsap from "gsap";

const surfaceCanvas = document.querySelector('#surface');

document.addEventListener('DOMContentLoaded', async () => {

    let surface = new Surface();

    const matcapTexture = await (new THREE.TextureLoader()).loadAsync('https://assets.codepen.io/959327/matcap-crystal.png')

    surface.createObjects(matcapTexture);

    surface.startLoop(surface);

    window.addEventListener('resize', () => {
        surface.updateSize();
    }, false);

});

class Surface {

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xE5E6E8);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 25);

        this.renderer = new THREE.WebGLRenderer({canvas: surfaceCanvas});
        this.updateSize();

        this.createOrbitControls();
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

    createObjects(matcapTexture) {

        this.dummy = new THREE.Object3D();

        const ballInnerMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const mirrorMaterial = new THREE.MeshMatcapMaterial({ side: THREE.BackSide });
        mirrorMaterial.matcap = matcapTexture;

        const numberOfBalls = 6;
        this.balls = [];

        for (let i = 0; i < numberOfBalls; i++) {
            this.balls[i] = this.createBall(1 + Math.random(), ballInnerMaterial, mirrorMaterial);
            this.balls[i].position.set(
                Math.random() * 12 - 6,
                Math.random() * 12 - 6,
                Math.random() * 12 - 6,
            );
            this.scene.add(this.balls[i]);
        }
    }

    createBall(radius, innerSphereMaterial, planeMaterial) {
        const ballInnerGeometry = new THREE.SphereBufferGeometry(radius, 9, 9);

        let isoGeometry = new THREE.IcosahedronBufferGeometry(radius, 3);
        isoGeometry.deleteAttribute('normal');
        isoGeometry.deleteAttribute('uv');
        isoGeometry = BufferGeometryUtils.mergeVertices(isoGeometry);
        const mirrorGeometry = new THREE.PlaneBufferGeometry(.23 * radius, .23 * radius, 1, 1);

        let isoVertices = isoGeometry.attributes.position.array;
        let instancedMirrorMesh = new THREE.InstancedMesh(
            mirrorGeometry,
            planeMaterial,
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
            innerSphereMaterial
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