import test from 'node:test';
import assert from 'node:assert/strict';
import type { Lesson } from '../web/src/data/types.ts';
import {
  SCENE_BUILD_STEPS,
  SCENE_META,
  sceneBuildStepForLesson,
  sceneForLesson,
  type Scene3DKind
} from '../web/src/components/labs/scene3dConfig.ts';

const KIND = (partial: Partial<Lesson>): Lesson => partial as Lesson;

test('scene3d: cada paso guiado selecciona una fase visual coherente', () => {
  const triangle = KIND({
    worldId: 'trigonometria',
    steps: [{ title: 'a' }, { title: 'b' }, { title: 'c' }, { title: 'd' }]
  });
  assert.deepEqual(
    triangle.steps.map((_, index) => sceneBuildStepForLesson(triangle, index)),
    [0, 1, 2, 3]
  );

  const quadratic = KIND({
    worldId: 'ecuaciones',
    steps: [{ title: 'a' }, { title: 'b' }, { title: 'c' }]
  });
  assert.equal(sceneBuildStepForLesson(quadratic, 0), 0);
  assert.ok(sceneBuildStepForLesson(quadratic, 1) > sceneBuildStepForLesson(quadratic, 0));
  assert.equal(sceneBuildStepForLesson(quadratic, 2), 2);
  assert.equal(sceneBuildStepForLesson(quadratic, 99), 2);
});

test('scene3d: toda escena declarada tiene metadatos válidos', () => {
  const kinds = Object.keys(SCENE_META) as Scene3DKind[];
  assert.ok(kinds.length >= 9);

  for (const kind of kinds) {
    const meta = SCENE_META[kind];
    assert.ok(meta.title.length > 0, `${kind} sin título`);
    assert.ok(meta.subtitle.length > 0, `${kind} sin subtítulo`);
    assert.ok(meta.minA < meta.maxA, `${kind} rango A inválido`);
    assert.ok(meta.minB < meta.maxB, `${kind} rango B inválido`);
    assert.ok(meta.defaultA >= meta.minA && meta.defaultA <= meta.maxA, `${kind} defaultA fuera de rango`);
    assert.ok(meta.defaultB >= meta.minB && meta.defaultB <= meta.maxB, `${kind} defaultB fuera de rango`);
    assert.ok(meta.stepA > 0 && meta.stepB > 0, `${kind} paso inválido`);
  }
});

test('scene3d: la escena estrella de trigonometría existe y tiene guion', () => {
  assert.ok(SCENE_META.righttriangle3d);
  assert.ok(SCENE_META.righttriangle3d.legend);
  assert.ok(SCENE_META.righttriangle3d.hint);
  assert.equal(SCENE_META.righttriangle3d.defaultA, 37);
  assert.equal(SCENE_META.righttriangle3d.defaultB, 1);

  const steps = SCENE_BUILD_STEPS.righttriangle3d;
  assert.ok(steps && steps.length === 4, 'El triángulo debe construirse en 4 pasos');
  assert.match(steps[0].title, /hipotenusa/i);
  assert.match(steps[1].title, /catetos/i);
  assert.match(steps[2].title, /círculo/i);
  assert.match(steps[3].title, /tangente/i);
});

test('scene3d: las lecciones pueden sobrescribir la escena del mundo', () => {
  assert.equal(sceneForLesson(KIND({ worldId: 'trigonometria' })), 'righttriangle3d');
  assert.equal(
    sceneForLesson(KIND({ worldId: 'trigonometria', scene3d: 'helix3d' })),
    'helix3d'
  );
  assert.equal(sceneForLesson(KIND({ worldId: 'algebra', scene3d: 'cube3d' })), 'cube3d');
  // Una escena inexistente no debe romper: cae al default del mundo.
  assert.equal(
    sceneForLesson(KIND({ worldId: 'trigonometria', scene3d: 'no-existe' })),
    'righttriangle3d'
  );
});

test('scene3d: cada mundo tiene una escena por defecto coherente', () => {
  const expected: Record<string, Scene3DKind> = {
    reales: 'sets3d',
    operaciones: 'powers3d',
    trigonometria: 'righttriangle3d',
    algebra: 'cube3d',
    ecuaciones: 'parabola3d',
    inecuaciones: 'rational3d',
    sistemas: 'planes3d'
  };
  for (const [worldId, kind] of Object.entries(expected)) {
    assert.equal(sceneForLesson(KIND({ worldId })), kind);
  }
});
