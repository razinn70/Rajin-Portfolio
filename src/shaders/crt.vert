varying vec2 vUv;

void main() {
  vUv = uv;

  // Barrel distortion — CRT screen curvature illusion
  vec2 d = vUv - 0.5;
  float r = dot(d, d);
  vUv += d * r * 0.05;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
