import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  clamp01,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  lerpVec3,
  progressSince,
  projectPoint,
  unprojectToPlaneZ0,
  type Vec3
} from '../web/src/lib/geometry3d.ts';

const VIEW = { width: 800, height: 600, zoom: 1.08 };

test('projectPoint: el origen cae en el centro del canvas', () => {
  const p = projectPoint({ x: 0, y: 0, z: 0 }, 0, 0, 1, VIEW.width, VIEW.height);
  assert.equal(p.x, 400);
  assert.equal(p.y, 300);
  assert.equal(p.depth, 0);
});

test('unprojectToPlaneZ0: ida y vuelta exacta sobre el plano z = 0', () => {
  const points: Vec3[] = [
    { x: 1.2, y: 0.7, z: 0 },
    { x: -2.1, y: 1.6, z: 0 },
    { x: 0.35, y: -0.45, z: 0 },
    { x: 2.5, y: 2.5, z: 0 }
  ];
  const yaws = [-1.1, -0.45, 0, 0.55, 1.1];
  const pitches = [-0.9, -0.3, 0.2, 0.7];

  for (const yaw of yaws) {
    for (const pitch of pitches) {
      for (const point of points) {
        const screen = projectPoint(point, yaw, pitch, VIEW.zoom, VIEW.width, VIEW.height);
        const back = unprojectToPlaneZ0(
          screen.x,
          screen.y,
          yaw,
          pitch,
          VIEW.zoom,
          VIEW.width,
          VIEW.height
        );
        assert.ok(back, `sin solución para yaw=${yaw} pitch=${pitch}`);
        assert.ok(
          Math.abs(back.x - point.x) < 1e-6,
          `x: esperado ${point.x}, obtenido ${back.x} (yaw=${yaw}, pitch=${pitch})`
        );
        assert.ok(
          Math.abs(back.y - point.y) < 1e-6,
          `y: esperado ${point.y}, obtenido ${back.y} (yaw=${yaw}, pitch=${pitch})`
        );
        assert.equal(back.z, 0);
      }
    }
  }
});

test('unprojectToPlaneZ0: devuelve null cuando el plano se ve de canto', () => {
  const screen = projectPoint({ x: 1, y: 1, z: 0 }, Math.PI / 2, 0, 1, 800, 600);
  assert.equal(
    unprojectToPlaneZ0(screen.x, screen.y, Math.PI / 2, 0, 1, 800, 600),
    null
  );
  assert.equal(unprojectToPlaneZ0(400, 300, 0, Math.PI / 2, 1, 800, 600), null);
});

test('unprojectToPlaneZ0: entrada inválida devuelve null', () => {
  assert.equal(unprojectToPlaneZ0(400, 300, 0, 0, 1, 0, 0), null);
  assert.equal(unprojectToPlaneZ0(400, 300, 0, 0, 0, 800, 600), null);
});

test('clamp y lerp respetan sus límites', () => {
  assert.equal(clamp(-2, 0, 1), 0);
  assert.equal(clamp(2, 0, 1), 1);
  assert.equal(clamp(0.5, 0, 1), 0.5);
  assert.equal(clamp01(1.7), 1);
  assert.equal(lerp(10, 20, 0.25), 12.5);
  assert.deepEqual(lerpVec3({ x: 0, y: 0, z: 0 }, { x: 2, y: 4, z: 6 }, 0.5), {
    x: 1,
    y: 2,
    z: 3
  });
});

test('easing: arrancan en 0, terminan en 1 y son monótonos', () => {
  for (const easing of [easeOutCubic, easeInOutCubic]) {
    assert.ok(Math.abs(easing(0)) < 1e-9);
    assert.ok(Math.abs(easing(1) - 1) < 1e-9);
    for (let i = 1; i <= 20; i += 1) {
      const a = easing((i - 1) / 20);
      const b = easing(i / 20);
      assert.ok(b >= a - 1e-9, `${easing.name} no es monótona en ${i / 20}`);
    }
  }
  // easeOutBack tiene un overshoot intencional para "encajar" piezas.
  assert.ok(Math.abs(easeOutBack(0)) < 1e-9);
  assert.ok(Math.abs(easeOutBack(1) - 1) < 1e-9);
  const peak = Math.max(...Array.from({ length: 21 }, (_, i) => easeOutBack(i / 20)));
  assert.ok(peak > 1);
});

test('progressSince acota el progreso y soporta duración cero', () => {
  assert.equal(progressSince(1000, 1250, 500), 0.5);
  assert.equal(progressSince(1000, 2000, 500), 1);
  assert.equal(progressSince(1000, 900, 500), 0);
  assert.equal(progressSince(1000, 1000, 0), 1);
});
