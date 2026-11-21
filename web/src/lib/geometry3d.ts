/**
 * Proyección 3D mínima sin dependencias.
 *
 * El workbench dibuja sus escenas sobre un canvas 2D con una cámara
 * yaw/pitch/zoom. Estas funciones viven acá (y no dentro del render) para
 * poder testearlas y reutilizarlas desde cualquier escena.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const CAMERA_DIST = 16.5;

/** Proyecta un punto del espacio a coordenadas de pantalla + profundidad. */
export function projectPoint(
  p: Vec3,
  yaw: number,
  pitch: number,
  zoom: number,
  width: number,
  height: number
): { x: number; y: number; depth: number } {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;

  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const y1 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;

  const scale = (zoom * Math.min(width, height)) / Math.max(2, z2 + CAMERA_DIST);
  return {
    x: width / 2 + x1 * scale,
    y: height / 2 - y1 * scale,
    depth: z2
  };
}

/**
 * Inversa de `projectPoint` restringida al plano z = 0.
 *
 * Devuelve el punto del plano que el usuario está señalando en pantalla.
 * Es lo que permite arrastrar un vértice del triángulo "de verdad" aunque la
 * cámara esté rotada. Si la cámara mira el plano de canto (yaw ≈ ±90° o
 * pitch ≈ ±90°) no hay solución estable y devolvemos `null`.
 */
export function unprojectToPlaneZ0(
  screenX: number,
  screenY: number,
  yaw: number,
  pitch: number,
  zoom: number,
  width: number,
  height: number
): Vec3 | null {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);

  if (Math.abs(cy) < 0.08 || Math.abs(cx) < 0.08) return null;

  const minSide = Math.min(width, height);
  if (minSide <= 0 || zoom <= 0) return null;

  const Sx = screenX - width / 2;
  const Sy = screenY - height / 2;

  // z2 = k · B, con k = (z2 + dist) / (zoom · minSide)
  const B = (Sx * sy / cy - Sy * sx) / cx;
  const denom = zoom * minSide - B;
  if (Math.abs(denom) < 1e-6) return null;

  const k = CAMERA_DIST / denom;
  const z2 = k * B;
  if (z2 + CAMERA_DIST < 2) return null;

  const x1 = Sx * k;
  const y1 = -Sy * k;
  const px = x1 / cy;
  const py = (y1 + px * sy * sx) / cx;

  return { x: px, y: py, z: 0 };
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function lerpVec3(from: Vec3, to: Vec3, t: number): Vec3 {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    z: lerp(from.z, to.z, t)
  };
}

/** Arranca rápido y frena suave: ideal para "dibujar" una figura. */
export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Rebote mínimo para piezas que "encajan". */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = clamp01(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/** Progreso 0..1 de una animación que empezó en `startedAt` (ms). */
export function progressSince(startedAt: number, now: number, durationMs: number): number {
  if (durationMs <= 0) return 1;
  return clamp01((now - startedAt) / durationMs);
}
