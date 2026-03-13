import * as THREE from 'three';
export class SceneManager {
    scene;
    renderer;
    camera;
    clock;
    _animCallback = null;
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.set(0, 0.2, 5);
        this.camera.lookAt(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
    }
    start(onFrame) {
        this._animCallback = onFrame;
        this.renderer.setAnimationLoop(() => {
            const delta = this.clock.getDelta();
            const elapsed = this.clock.getElapsedTime();
            this._animCallback?.(delta, elapsed);
            this.renderer.render(this.scene, this.camera);
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    dispose() {
        this.stop();
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
