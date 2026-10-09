import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { BELT_COLORS, beltRotationAt, rankAt, ribbonGeometry, surfaceGeometry, torsoPoint, sleevePoint } from '../src/components/experience/experienceGeometry.ts';

test('all five ranks have stable stops and colour blending stays continuous', () => {
  assert.equal(BELT_COLORS.length, 5);
  const scalar = p => { const { index, mix } = rankAt(p); return index + mix; };
  assert.equal(scalar(-1), 0);
  assert.equal(scalar(1.5), 4);
  for (let i = 0; i < 5; i++) assert.ok(Math.abs(scalar(0.08 + i * 0.78 / 4) - i) < 1e-9);
  for (let i = 1; i <= 1000; i++) {
    const delta = scalar(i / 1000) - scalar((i - 1) / 1000);
    assert.ok(delta >= -1e-12 && delta < 0.02, `colour jump at ${i / 1000}`);
  }
  const forward = Array.from({length:101}, (_, i) => scalar(i / 100));
  assert.deepEqual(Array.from({length:101}, (_, i) => scalar((100 - i) / 100)).reverse(), forward);
});

test('garment shells have finite geometry, depth, normals and valid triangle indices', () => {
  for (const fn of [torsoPoint, (u,v)=>sleevePoint(1,u,v), (u,v)=>sleevePoint(-1,u,v)]) {
    const geometry = surfaceGeometry(fn, 32, 40);
    for (const name of ['position','normal','uv']) assert.ok(geometry.getAttribute(name).array.every(Number.isFinite));
    assert.ok(geometry.index.array.every(i => i < geometry.getAttribute('position').count));
    geometry.computeBoundingBox();
    assert.ok(geometry.boundingBox.max.z - geometry.boundingBox.min.z > 0.45);
    geometry.dispose();
  }
});

test('sleeves are mirrored and circular seams close exactly', () => {
  for (let i = 0; i <= 20; i++) {
    const u = i / 20, v = 0.65;
    const left = sleevePoint(-1,u,v), right = sleevePoint(1,u,v);
    assert.ok(Math.abs(left.x + right.x) < 1e-10);
    assert.equal(left.y, right.y); assert.equal(left.z, right.z);
    assert.ok(torsoPoint(0,u).distanceTo(torsoPoint(1,u)) < 1e-10);
  }
});

test('the belt ribbon has physical thickness and sealed ends', () => {
  const geometry = ribbonGeometry([new Vector3(0,0,0), new Vector3(0,-1,0), new Vector3(0,-2,0)], 0.25, 0.052);
  geometry.computeBoundingBox();
  assert.ok(Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z - 0.052) < 1e-6);
  const indices = Array.from(geometry.index.array);
  assert.ok(indices.every(i => i < geometry.getAttribute('position').count));
  assert.ok(geometry.getAttribute('normal').array.every(Number.isFinite));
  geometry.dispose();
});


test('rotation is gradual, reversible and continues through rank dwell intervals', () => {
  const forward = Array.from({ length: 1001 }, (_, i) => beltRotationAt(i / 1000));
  for (let i = 1; i < forward.length; i++) {
    assert.ok(forward[i] > forward[i - 1]);
    assert.ok(forward[i] - forward[i - 1] < 0.01);
  }
  assert.deepEqual(Array.from({ length: 1001 }, (_, i) => beltRotationAt((1000 - i) / 1000)).reverse(), forward);
  for (let rank = 0; rank < 4; rank++) {
    const start = 0.08 + rank * 0.78 / 4;
    const end = start + 0.78 / 4 * 0.2;
    const from = rankAt(start), to = rankAt(end);
    assert.ok(Math.abs((from.index + from.mix) - (to.index + to.mix)) < 1e-9);
    assert.ok(beltRotationAt(end) > beltRotationAt(start));
  }
  assert.equal(beltRotationAt(-1), 0);
  assert.equal(beltRotationAt(2), Math.PI * 2);
});
