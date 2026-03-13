uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  // Discard fragments outside the barrel-distorted boundary
  if (vUv.x < 0.0 || vUv.x > 1.0 || vUv.y < 0.0 || vUv.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Base texture sample
  vec4 color = texture2D(uTexture, vUv);

  // Scanlines — 8% opacity darkening at 2px intervals
  float lineY = vUv.y * uResolution.y;
  float scanline = sin(lineY * 3.14159) * 0.5 + 0.5;
  color.rgb *= mix(0.92, 1.0, scanline);

  // Phosphor glow — 3x3 kernel spread
  float spread = 1.5 / uResolution.x;
  vec4 glow = vec4(0.0);
  glow += texture2D(uTexture, vUv + vec2(-spread, -spread)) * 0.075;
  glow += texture2D(uTexture, vUv + vec2(0.0,    -spread)) * 0.125;
  glow += texture2D(uTexture, vUv + vec2( spread, -spread)) * 0.075;
  glow += texture2D(uTexture, vUv + vec2(-spread,  0.0   )) * 0.125;
  glow += texture2D(uTexture, vUv + vec2( spread,  0.0   )) * 0.125;
  glow += texture2D(uTexture, vUv + vec2(-spread,  spread)) * 0.075;
  glow += texture2D(uTexture, vUv + vec2(0.0,      spread)) * 0.125;
  glow += texture2D(uTexture, vUv + vec2( spread,  spread)) * 0.075;
  color.rgb += glow.rgb * 0.18;

  // Vignette — darken corners
  vec2 vignUv = vUv - 0.5;
  float vignette = 1.0 - dot(vignUv, vignUv) * 1.6;
  color.rgb *= clamp(vignette, 0.0, 1.0);

  // Subtle chromatic aberration
  float abr = 0.0015;
  float rChannel = texture2D(uTexture, vUv + vec2( abr, 0.0)).r;
  float bChannel = texture2D(uTexture, vUv + vec2(-abr, 0.0)).b;
  color.r = mix(color.r, rChannel, 0.4);
  color.b = mix(color.b, bChannel, 0.4);

  // Animated horizontal noise band
  float noise = sin(vUv.y * 800.0 + uTime * 3.0) * 0.003;
  color.rgb += noise;

  gl_FragColor = color;
}
