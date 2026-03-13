import * as THREE from 'three';
import vertSrc from '@/shaders/crt.vert?raw';
import fragSrc from '@/shaders/crt.frag?raw';
export function createCRTMaterial(texture) {
    return new THREE.ShaderMaterial({
        vertexShader: vertSrc,
        fragmentShader: fragSrc,
        uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(512, 384) },
        },
    });
}
