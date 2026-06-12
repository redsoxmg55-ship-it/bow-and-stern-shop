'use client';
import { useEffect, useRef } from 'react';
import type * as THREE_TYPES from 'three';

interface Soap3DProps {
  form: 'Bar' | 'Circle' | 'Bunny';
  color: string;       // hex e.g. '#1a2b45'
  swirl?: [string, string] | null;
  scent?: string;
  initials?: string;
}

export default function Soap3D({ form, color, swirl, scent, initials }: Soap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track latest prop values so they can be applied once Three.js finishes loading
  const latestInitials = useRef(initials || '');
  latestInitials.current = initials || '';

  const apiRef = useRef<{
    setForm: (f: string) => void;
    setColor: (hex: string) => void;
    setSwirl: (h1: string, h2: string) => void;
    setScent: (s: string) => void;
    setInitials: (s: string) => void;
    destroy: () => void;
  } | null>(null);

  // Init Three.js scene on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mounted = true;

    import('three').then((THREE: typeof THREE_TYPES) => {
      if (!mounted || !containerRef.current) return;

      const container = containerRef.current;

      // ---- state ----
      const state = {
        form: form.toLowerCase() as 'bar' | 'circle' | 'bunny',
        color: color,
        swirl: swirl || null as [string, string] | null,
        scent: scent || '',
        initials: initials || '',
      };

      // ---- shape builders ----
      function roundedRect(s: THREE_TYPES.Shape, w: number, h: number, r: number) {
        const x = -w / 2, y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      }

      function bunnyShape(s: THREE_TYPES.Shape) {
        s.moveTo(-1.52, -0.05);
        s.bezierCurveTo(-1.54, 0.30, -1.28, 0.52, -1.00, 0.52);
        s.bezierCurveTo(-0.86, 0.70, -0.74, 0.92, -0.60, 0.92);
        s.bezierCurveTo(-0.50, 0.90, -0.40, 0.80, -0.34, 0.74);
        s.bezierCurveTo(-0.05, 0.92, 0.22, 1.04, 0.58, 1.02);
        s.bezierCurveTo(1.02, 0.96, 1.54, 0.62, 1.50, 0.08);
        s.bezierCurveTo(1.46, -0.48, 1.40, -0.82, 1.22, -0.92);
        s.bezierCurveTo(0.40, -1.06, -0.45, -1.06, -1.14, -0.92);
        s.bezierCurveTo(-1.48, -0.82, -1.64, -0.42, -1.52, -0.05);
      }

      const SHAPES = {
        bar: { make: () => { const s = new THREE.Shape(); roundedRect(s, 3.3, 2.05, 0.55); return s; }, depth: 0.85, bevel: 0.26, ey: 0.50 },
        circle: { make: () => { const s = new THREE.Shape(); s.absarc(0, 0, 1.35, 0, Math.PI * 2, false); return s; }, depth: 0.72, bevel: 0.28, ey: 0.50 },
        bunny: { make: () => { const s = new THREE.Shape(); bunnyShape(s); return s; }, depth: 0.62, bevel: 0.20, ey: 0.70 },
      };

      // ---- renderer / scene / camera ----
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.25, 7.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.98;
      container.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;cursor:grab;touch-action:none';

      // ---- env map ----
      function buildEnv() {
        const c = document.createElement('canvas'); c.width = 16; c.height = 256;
        const g = c.getContext('2d')!;
        const grd = g.createLinearGradient(0, 0, 0, 256);
        grd.addColorStop(0, '#eaf2f7'); grd.addColorStop(0.45, '#9fb4c2'); grd.addColorStop(1, '#243743');
        g.fillStyle = grd; g.fillRect(0, 0, 16, 256);
        const tex = new THREE.CanvasTexture(c);
        tex.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromEquirectangular(tex).texture;
        tex.dispose(); pmrem.dispose();
      }
      buildEnv();

      // ---- lights ----
      scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4650, 0.42));
      const key = new THREE.DirectionalLight(0xffffff, 0.85); key.position.set(3, 4, 5); scene.add(key);
      const fill = new THREE.DirectionalLight(0xcfe3ee, 0.28); fill.position.set(-4, 1, 2); scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.45); rim.position.set(-2, 3, -5); scene.add(rim);

      // ---- bump map ----
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512; bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext('2d')!;
      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.anisotropy = 4;

      function drawBump() {
        const w = bumpCanvas.width, h = bumpCanvas.height;
        bumpCtx.clearRect(0, 0, w, h);
        bumpCtx.fillStyle = '#ffffff';
        bumpCtx.fillRect(0, 0, w, h);
        if (state.initials) {
          const ey = (SHAPES[state.form] || SHAPES.bar).ey;
          bumpCtx.save();
          bumpCtx.translate(w / 2, h * ey);
          bumpCtx.textAlign = 'center';
          bumpCtx.textBaseline = 'middle';
          const fontSize = state.form === 'bunny' ? 110 : 140;
          bumpCtx.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
          // Outer glow to create a soft inset rim
          bumpCtx.shadowColor = '#888';
          bumpCtx.shadowBlur = 22;
          bumpCtx.fillStyle = '#000000';
          bumpCtx.fillText(state.initials, 0, 0);
          // Second pass — sharp core, fully black
          bumpCtx.shadowBlur = 0;
          bumpCtx.fillStyle = '#000000';
          bumpCtx.fillText(state.initials, 0, 0);
          bumpCtx.restore();
        }
        bumpTex.needsUpdate = true;
      }
      drawBump();

      // ---- speckle / swirl map ----
      const speckCanvas = document.createElement('canvas');
      speckCanvas.width = 512; speckCanvas.height = 512;
      const speckCtx = speckCanvas.getContext('2d')!;
      const speckTex = new THREE.CanvasTexture(speckCanvas);
      speckTex.anisotropy = 4;

      function mix(a: string, b: string, t: number) {
        const rgb = (h: string) => { const n = parseInt(h.replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
        const x = rgb(a), y = rgb(b);
        return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',') + ')';
      }

      function drawSwirl(W: number, H: number) {
        const [c1, c2] = state.swirl!;
        const ctx = speckCtx;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = c1; ctx.fillRect(0, 0, W, H);
        ctx.translate(W / 2, H / 2); ctx.rotate(-0.5); ctx.translate(-W / 2, -H / 2);
        ctx.lineCap = 'round';
        ctx.filter = 'blur(10px)';
        for (let i = 0; i < 6; i++) {
          const base = H * (i + 0.5) / 6 - H * 0.08;
          ctx.strokeStyle = c2; ctx.globalAlpha = 0.7; ctx.lineWidth = 30 + (i % 3) * 16;
          ctx.beginPath(); ctx.moveTo(-40, base);
          for (let x = -40; x <= W + 40; x += 22) { ctx.lineTo(x, base + Math.sin((x / W) * Math.PI * 2.2 + i * 1.1) * 52); }
          ctx.stroke();
        }
        ctx.filter = 'blur(5px)';
        for (let k = 0; k < 3; k++) {
          const ky = H * (k + 0.7) / 3;
          ctx.strokeStyle = c1; ctx.globalAlpha = 0.55; ctx.lineWidth = 12;
          ctx.beginPath(); ctx.moveTo(-40, ky);
          for (let kx = -40; kx <= W + 40; kx += 20) { ctx.lineTo(kx, ky + Math.sin((kx / W) * Math.PI * 2.6 + k * 2) * 40); }
          ctx.stroke();
        }
        ctx.filter = 'blur(1.5px)';
        const vein = mix(c2, '#ffffff', 0.45);
        for (let j = 0; j < 6; j++) {
          const vy = H * (j + 0.5) / 6 + Math.sin(j * 2.3) * 26;
          ctx.strokeStyle = vein; ctx.globalAlpha = 0.45; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(-40, vy);
          for (let vx = -40; vx <= W + 40; vx += 18) { ctx.lineTo(vx, vy + Math.sin((vx / W) * Math.PI * 3.1 + j) * 30); }
          ctx.stroke();
        }
        ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.restore();
      }

      function drawInitialsOnColor(W: number, H: number) {
        if (!state.initials) return;
        const ey = (SHAPES[state.form] || SHAPES.bar).ey;
        speckCtx.save();
        speckCtx.translate(W / 2, H * ey);
        speckCtx.textAlign = 'center';
        speckCtx.textBaseline = 'middle';
        const fontSize = state.form === 'bunny' ? 110 : 140;
        speckCtx.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
        // Soft shadow halo
        speckCtx.shadowColor = 'rgba(0,0,0,0.55)';
        speckCtx.shadowBlur = 18;
        speckCtx.fillStyle = 'rgba(0,0,0,0.55)';
        speckCtx.fillText(state.initials, 0, 0);
        // Sharp dark core
        speckCtx.shadowBlur = 0;
        speckCtx.fillStyle = 'rgba(0,0,0,0.45)';
        speckCtx.fillText(state.initials, 0, 0);
        speckCtx.restore();
      }

      function drawSpecks() {
        const W = speckCanvas.width, H = speckCanvas.height;
        if (state.swirl) { drawSwirl(W, H); }
        else { speckCtx.fillStyle = '#ffffff'; speckCtx.fillRect(0, 0, W, H); }
        drawInitialsOnColor(W, H);
        speckTex.needsUpdate = true;
      }
      drawSpecks();

      // ---- material ----
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(state.swirl ? '#ffffff' : state.color),
        roughness: 0.6, metalness: 0.0,
        clearcoat: 0.35, clearcoatRoughness: 0.45,
        map: speckTex, bumpMap: bumpTex, bumpScale: 0.45, envMapIntensity: 0.45,
      });

      // ---- UV generator ----
      function makeUVGenerator(minX: number, minY: number, sw: number, sh: number, depth: number) {
        const mid = depth / 2;
        function uv(v: Float32Array, i: number, flip: boolean) {
          const u = (v[i * 3] - minX) / sw;
          return new THREE.Vector2(flip ? 1 - u : u, (v[i * 3 + 1] - minY) / sh);
        }
        return {
          generateTopUV(_geom: THREE_TYPES.ExtrudeGeometry, verts: Float32Array, a: number, b: number, c: number) {
            const flip = verts[a * 3 + 2] < mid;
            return [uv(verts, a, flip), uv(verts, b, flip), uv(verts, c, flip)];
          },
          generateSideWallUV() { return [new THREE.Vector2(0,0), new THREE.Vector2(0,0), new THREE.Vector2(0,0), new THREE.Vector2(0,0)]; },
        };
      }

      // ---- mesh ----
      let mesh: THREE_TYPES.Mesh | null = null;
      let fitR = 2;

      function fitCamera() {
        const w = container.clientWidth || 1, h = container.clientHeight || 1;
        const aspect = w / h, vfov = (camera.fov * Math.PI) / 180;
        const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
        const dist = (fitR / Math.sin(Math.min(vfov, hfov) / 2)) * 1.06;
        camera.position.set(0, 0.1, dist); camera.lookAt(0, 0, 0);
      }

      function buildMesh() {
        const def = SHAPES[state.form] || SHAPES.bar;
        const shape = def.make();
        const pts = shape.getPoints(64);
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        pts.forEach(p => { if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x; if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; });
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: def.depth, bevelEnabled: true, bevelThickness: def.bevel, bevelSize: def.bevel,
          bevelSegments: 6, curveSegments: 48,
          // @ts-expect-error — UVGenerator is valid at runtime but not in @types/three
          UVGenerator: makeUVGenerator(minX, minY, maxX - minX, maxY - minY, def.depth),
        });
        geo.center(); geo.computeBoundingSphere();
        fitR = geo.boundingSphere?.radius ?? 2;
        if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); }
        mesh = new THREE.Mesh(geo, material);
        scene.add(mesh);
        fitCamera();
      }
      buildMesh();

      // ---- drag / rotation ----
      let rotY = -0.45, rotX = -0.5, velY = 0, velX = 0;
      let dragging = false, lastX = 0, lastY = 0, idle = 0;

      const dom = renderer.domElement;
      const onDown = (e: MouseEvent | TouchEvent) => {
        dragging = true; idle = 0;
        lastX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        lastY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dom.style.cursor = 'grabbing';
      };
      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!dragging) return;
        const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
        velY = (cx - lastX) * 0.01; velX = (cy - lastY) * 0.01;
        lastX = cx; lastY = cy;
        rotY += velY; rotX = Math.max(-1.2, Math.min(0.5, rotX + velX));
        if ('cancelable' in e && e.cancelable) e.preventDefault();
      };
      const onUp = () => { dragging = false; dom.style.cursor = 'grab'; };

      dom.addEventListener('mousedown', onDown as EventListener);
      window.addEventListener('mousemove', onMove as EventListener);
      window.addEventListener('mouseup', onUp);
      dom.addEventListener('touchstart', onDown as EventListener, { passive: true });
      dom.addEventListener('touchmove', onMove as EventListener, { passive: false });
      window.addEventListener('touchend', onUp);

      // ---- resize ----
      function resize() {
        const w = container.clientWidth, h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        fitCamera();
      }
      const ro = new ResizeObserver(resize);
      ro.observe(container);
      resize();

      // ---- animate ----
      let raf: number;
      function animate() {
        raf = requestAnimationFrame(animate);
        if (!dragging) {
          velY *= 0.94; velX *= 0.92;
          rotY += velY; rotX = Math.max(-1.2, Math.min(0.5, rotX + velX));
          idle++;
          if (idle > 90 && Math.abs(velY) < 0.002) rotY += 0.0028;
        }
        if (mesh) { mesh.rotation.y = rotY; mesh.rotation.x = rotX; }
        renderer.render(scene, camera);
      }
      animate();

      // ---- public API ----
      apiRef.current = {
        setForm(f: string) {
          const key = f.toLowerCase() as 'bar' | 'circle' | 'bunny';
          if (key === state.form) return;
          state.form = key; buildMesh(); drawBump();
        },
        setColor(hex: string) {
          state.swirl = null; state.color = hex;
          material.color.set(hex); drawSpecks();
        },
        setSwirl(h1: string, h2: string) {
          state.swirl = [h1, h2]; material.color.set('#ffffff'); drawSpecks();
        },
        setScent(s: string) { state.scent = s; drawSpecks(); },
        setInitials(s: string) { state.initials = s; drawBump(); drawSpecks(); },
        destroy() {

          cancelAnimationFrame(raf);
          ro.disconnect();
          dom.removeEventListener('mousedown', onDown as EventListener);
          window.removeEventListener('mousemove', onMove as EventListener);
          window.removeEventListener('mouseup', onUp);
          dom.removeEventListener('touchstart', onDown as EventListener);
          dom.removeEventListener('touchmove', onMove as EventListener);
          window.removeEventListener('touchend', onUp);
          renderer.dispose();
          if (container.contains(dom)) container.removeChild(dom);
        },
      };

      // Apply any initials that were typed before Three.js finished loading
      if (latestInitials.current) {
        state.initials = latestInitials.current;
        drawBump();
      }
    });

    return () => {
      mounted = false;
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to prop changes after mount
  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.setForm(form);
  }, [form]);

  useEffect(() => {
    if (!apiRef.current) return;
    if (swirl) apiRef.current.setSwirl(swirl[0], swirl[1]);
    else apiRef.current.setColor(color);
  }, [color, swirl]);

  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.setScent(scent || '');
  }, [scent]);

  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.setInitials(initials || '');
  }, [initials]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 320 }} />
  );
}
