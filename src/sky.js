import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
  AmbientLight,
} from 'three';

// A soft round sprite for stars and light flecks.
function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

function field(count, spread, colors) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = colors.map((c) => new Color(c));
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    const c = palette[i % palette.length];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(col, 3));
  return geo;
}

export function startSky(canvas, { reducedMotion = false } = {}) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return; // No WebGL: the page still works, just without the sky.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 400);
  camera.position.z = 30;

  const sprite = dotTexture();
  const stars = new Points(
    field(1400, 220, ['#ffffff', '#cfc6ff', '#ffd6f0']),
    new PointsMaterial({ size: 0.5, map: sprite, vertexColors: true, transparent: true, depthWrite: false, opacity: 0.85 }),
  );
  const flecks = new Points(
    field(260, 90, ['#ff3fb4', '#7b4dff', '#6fe7ff', '#ffffff']),
    new PointsMaterial({ size: 1.1, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.7 }),
  );
  scene.add(stars, flecks);

  // The mirror ball: many flat facets catching three coloured lights.
  const ball = new Mesh(
    new IcosahedronGeometry(5, 4),
    new MeshPhongMaterial({ color: '#8d86a8', specular: '#ffffff', shininess: 220, flatShading: true }),
  );
  scene.add(ball);
  scene.add(new AmbientLight('#3a2f5c', 1.6));
  const lights = [
    new PointLight('#ff3fb4', 4, 0, 0),
    new PointLight('#7b4dff', 4, 0, 0),
    new PointLight('#6fe7ff', 2.5, 0, 0),
  ];
  lights.forEach((l) => scene.add(l));

  let scrollY = window.scrollY;
  const onScroll = () => (scrollY = window.scrollY);
  window.addEventListener('scroll', onScroll, { passive: true });

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Keep the ball off to the side so it never sits on top of the copy.
    ball.position.set(w < 720 ? 7 : 17, 7, -6);
    ball.scale.setScalar(w < 720 ? 0.7 : 1);
  };
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  let visible = true;
  document.addEventListener('visibilitychange', () => (visible = !document.hidden));

  const frame = () => {
    if (visible) {
      t += 0.004;
      const y = scrollY / window.innerHeight;
      ball.rotation.y = t * 2.2;
      ball.rotation.x = 0.25 + Math.sin(t) * 0.05;
      ball.position.y = 7 - y * 6;
      lights.forEach((l, i) => {
        const a = t * (1.4 + i * 0.5) + i * 2.1;
        l.position.set(ball.position.x + Math.cos(a) * 14, ball.position.y + Math.sin(a * 0.8) * 10, 12);
      });
      stars.rotation.y = t * 0.15;
      stars.position.y = y * 3;
      flecks.rotation.y = -t * 0.6;
      flecks.position.y = y * 8;
      camera.position.y = -y * 2;
      renderer.render(scene, camera);
    }
    if (!reducedMotion) requestAnimationFrame(frame);
  };
  frame();
}
