/* ===========================================================================
   The courtyard house, built in five 3D acts.

   One world holds every act. Groups are shown and cross-faded as the scroll
   moves between stages, and the camera flies between per-stage keyframes, so
   the model, the construction, the finished house, its street and the city
   around it are all the same building seen from further and further away.

   Geometry is written procedurally — no external assets — and instanced
   wherever a thing repeats (trees, cars, city blocks).
   =========================================================================== */

import * as THREE from "three";

/* ----------------------------------------------------------------- helpers */

const T = (c) => new THREE.Color(c);

const mat = (color, opts = {}) =>
  new THREE.MeshLambertMaterial({ color: T(color), ...opts });

const BOX = new THREE.BoxGeometry(1, 1, 1);

function box(group, w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(BOX, material);
  m.scale.set(w, h, d);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

// a box positioned by its centre rather than its base
function slab(group, w, h, d, material, x, y, z) {
  const m = box(group, w, h, d, material, x, y - h / 2, z);
  return m;
}

function cyl(group, r, h, material, x, y, z, seg = 10) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), material);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

const rnd = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

/* materials are cloned per group so a group can be faded on its own */
function collectMaterials(group) {
  const list = [];
  group.traverse((o) => {
    if (!o.material) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    ms.forEach((m) => {
      if (!list.includes(m)) list.push(m);
    });
  });
  return list;
}

function setOpacity(entry, o) {
  const visible = o > 0.003;
  entry.group.visible = visible;
  if (!visible) return;
  const full = o > 0.997;
  entry.materials.forEach((m) => {
    m.transparent = !full;
    m.opacity = o;
    m.depthWrite = full;
  });
}

/* ------------------------------------------------------------- the house */

const PLAN = {
  w: 10, // east–west
  d: 8, // north–south
  floor: 3, // storey height
  wall: 0.3,
  court: { w: 3, d: 2.6 }, // central courtyard void
};

// the four outer walls of one storey, with the courtyard left open
function shell(group, material, y, h) {
  const { w, d, wall } = PLAN;
  box(group, w, h, wall, material, 0, y, -d / 2 + wall / 2);
  box(group, w, h, wall, material, 0, y, d / 2 - wall / 2);
  box(group, wall, h, d - wall * 2, material, -w / 2 + wall / 2, y, 0);
  box(group, wall, h, d - wall * 2, material, w / 2 - wall / 2, y, 0);
}

// interior partitions — the rooms shown on the plan drawing
function partitions(group, material, y, h) {
  const { wall, court } = PLAN;
  box(group, wall, h, 2.6, material, -1.6, y, -2.6);
  box(group, 3.2, h, wall, material, -3.2, y, -1.3);
  box(group, wall, h, 2.4, material, 1.6, y, -2.6);
  box(group, 2.6, h, wall, material, 3.3, y, -1.2);
  box(group, 3.0, h, wall, material, -3.0, y, 1.6);
  box(group, wall, h, 2.2, material, -1.6, y, 1.8);
  box(group, 2.8, h, wall, material, 3.2, y, 1.6);
  // courtyard kerb
  box(group, court.w, 0.18, wall, material, 0, y, -court.d / 2);
  box(group, court.w, 0.18, wall, material, 0, y, court.d / 2);
  box(group, wall, 0.18, court.d, material, -court.w / 2, y, 0);
  box(group, wall, 0.18, court.d, material, court.w / 2, y, 0);
}

/* ------------------------------------------------------- 03 · study model */

function buildModel() {
  const g = new THREE.Group();
  const white = mat("#f2f1ec");
  const shade = mat("#dcdad2");
  const dark = mat("#8e8d86");
  const { w, d, floor } = PLAN;

  slab(g, w + 1.6, 0.35, d + 1.6, shade, 0, 0.35, 0); // base
  shell(g, white, 0.35, floor);
  partitions(g, white, 0.35, floor * 0.92);
  slab(g, w, 0.22, d, shade, 0, 0.35 + floor + 0.22, 0); // first-floor slab
  shell(g, white, 0.35 + floor + 0.22, floor * 0.9);
  partitions(g, white, 0.35 + floor + 0.22, floor * 0.8);

  // courtyard void punched through both slabs
  slab(g, PLAN.court.w, 0.3, PLAN.court.d, mat("#cfcdc4"), 0, 0.36, 0);

  // openings read as recessed dark panels
  const op = (x, y, z, ww, hh, dd) => box(g, ww, hh, dd, dark, x, y, z);
  op(-3.2, 1.3, -d / 2 + 0.16, 1.5, 1.4, 0.06);
  op(0.4, 1.3, -d / 2 + 0.16, 1.5, 1.4, 0.06);
  op(3.1, 1.2, -d / 2 + 0.16, 1.1, 1.9, 0.06);
  op(-2.6, 1.3, d / 2 - 0.16, 1.6, 1.4, 0.06);
  op(2.4, 1.3, d / 2 - 0.16, 1.6, 1.4, 0.06);
  op(w / 2 - 0.16, 1.3, -1.4, 0.06, 1.4, 1.6);
  op(w / 2 - 0.16, 1.3, 1.6, 0.06, 1.4, 1.6);
  op(-w / 2 + 0.16, 4.6, 0, 0.06, 1.5, 2.4);

  // stair
  for (let i = 0; i < 9; i++) box(g, 1.1, 0.34, 0.3, shade, 2.6, 0.35 + i * 0.34, 1.0 + i * 0.3);

  return g;
}

/* -------------------------------------------------------- 04 · under build */

function buildConstruction() {
  const g = new THREE.Group();
  const concrete = mat("#d9d6cd");
  const slabM = mat("#eceae3");
  const brick = mat("#9e3b2c");
  const brickDark = mat("#7e2e22");
  const steel = mat("#6d7076");
  const plank = mat("#e0a63f");
  const crane = mat("#e4b53c");
  const tank = mat("#2b2b2b");
  const { w, d, floor } = PLAN;

  slab(g, w + 1.6, 0.35, d + 1.6, concrete, 0, 0.35, 0);

  // columns on a grid
  const cols = [];
  for (let i = -2; i <= 2; i++)
    for (let j = -1; j <= 1; j++) cols.push([i * (w / 4.4), j * (d / 2.6)]);

  const levels = [0.35, 0.35 + floor + 0.22];
  levels.forEach((base, L) => {
    cols.forEach(([x, z]) => box(g, 0.34, floor, 0.34, concrete, x, base, z));
    // brick infill between the columns, lower level fuller than the upper
    const hh = L === 0 ? floor * 0.82 : floor * 0.5;
    box(g, w, hh, PLAN.wall, L === 0 ? brick : brickDark, 0, base, -d / 2 + 0.15);
    box(g, w * 0.62, hh, PLAN.wall, brick, -w * 0.19, base, d / 2 - 0.15);
    box(g, PLAN.wall, hh, d * 0.8, L === 0 ? brick : brickDark, -w / 2 + 0.15, base, 0);
    box(g, PLAN.wall, hh * 0.7, d * 0.5, brick, w / 2 - 0.15, base, -1.2);
    if (L === 0) {
      partitions(g, brickDark, base, floor * 0.55);
      slab(g, w, 0.24, d, slabM, 0, base + floor + 0.24, 0);
    }
  });

  // roof slab, partly cast
  slab(g, w, 0.24, d * 0.62, slabM, 0, 0.35 + (floor + 0.22) * 2 + 0.24, -d * 0.19);
  slab(g, w * 0.46, 0.24, d * 0.38, slabM, w * 0.27, 0.35 + (floor + 0.22) * 2 + 0.24, d * 0.31);

  // courtyard void
  slab(g, PLAN.court.w, 0.4, PLAN.court.d, mat("#cdc9bf"), 0, 0.4, 0);

  // scaffolding — uprights, ledgers and timber planks around the perimeter
  const sx = w / 2 + 0.75;
  const sz = d / 2 + 0.75;
  const top = 8.6;
  const pts = [];
  for (let x = -sx; x <= sx + 0.01; x += sx / 3.5) pts.push([x, -sz], [x, sz]);
  for (let z = -sz + 1.2; z < sz - 0.1; z += sz / 2.2) pts.push([-sx, z], [sx, z]);
  pts.forEach(([x, z]) => cyl(g, 0.055, top, steel, x, 0, z, 6));
  [2.1, 4.3, 6.5, 8.3].forEach((y) => {
    box(g, sx * 2, 0.06, 0.08, steel, 0, y, -sz);
    box(g, sx * 2, 0.06, 0.08, steel, 0, y, sz);
    box(g, 0.08, 0.06, sz * 2, steel, -sx, y, 0);
    box(g, 0.08, 0.06, sz * 2, steel, sx, y, 0);
  });
  [2.2, 4.4, 6.6].forEach((y) => {
    box(g, sx * 2, 0.1, 0.5, plank, 0, y, -sz + 0.1);
    box(g, sx * 2, 0.1, 0.5, plank, 0, y, sz - 0.1);
    box(g, 0.5, 0.1, sz * 1.9, plank, -sx + 0.1, y, 0);
  });

  // tower crane mast, hook and the water tank going up
  cyl(g, 0.34, 30, crane, -1.2, 4, -5.6, 4);
  box(g, 11, 0.5, 0.5, crane, 3.6, 15.4, -5.6); // jib
  box(g, 0.12, 4.0, 0.12, steel, 7.2, 11.4, -5.6); // hoist rope
  box(g, 1.9, 0.18, 1.9, steel, 7.2, 11.3, -5.6);
  box(g, 1.6, 1.4, 1.6, tank, 7.2, 9.8, -5.6);

  // a few bricks and bags on the ground
  const r = rnd(7);
  for (let i = 0; i < 9; i++)
    box(g, 0.9, 0.5, 0.6, i % 3 ? brick : concrete, -7 + r() * 3, 0, -4 + r() * 9);

  return g;
}

/* ------------------------------------------------------ shared vegetation */

function tree(group, x, z, s = 1, trunkM, leafM, base = 0) {
  const t = cyl(group, 0.1 * s, 1.5 * s, trunkM, x, base, z, 6);
  t.castShadow = true;
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95 * s, 0), leafM);
  crown.position.set(x, base + 1.5 * s + 0.75 * s, z);
  crown.castShadow = true;
  group.add(crown);
  const crown2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 * s, 0), leafM);
  crown2.position.set(x + 0.35 * s, base + 1.5 * s + 1.4 * s, z - 0.2 * s);
  crown2.castShadow = true;
  group.add(crown2);
}

/* ---------------------------------------------------- 05 · finished house */

function buildLive() {
  const g = new THREE.Group();
  const render = mat("#efe7d6");
  const renderShade = mat("#ded4c0");
  const roof = mat("#e8e1d1");
  const glassM = mat("#5d6a72");
  const jaliM = mat("#d8c9a8");
  const timber = mat("#8a5a3b");
  const leaf = mat("#4a7c46");
  const leafDark = mat("#3c6639");
  const grass = mat("#6f9460");
  const paving = mat("#dad3c4");
  const tankM = mat("#2d2d2d");
  const { w, d, floor } = PLAN;

  // plot
  slab(g, 22, 0.3, 20, paving, 0, 0.3, 0);
  slab(g, 19.4, 0.07, 5.6, grass, 0, 0.36, 6.9);
  slab(g, 19.4, 0.07, 4.2, grass, 0, 0.36, -7.4);
  slab(g, 5.2, 0.07, 10, grass, -7.6, 0.36, 0);
  slab(g, 4.4, 0.07, 10, grass, 8.0, 0.36, 0);
  // boundary wall
  box(g, 22, 0.55, 0.3, renderShade, 0, 0.3, -10);
  box(g, 22, 0.55, 0.3, renderShade, 0, 0.3, 10);
  box(g, 0.3, 0.55, 20, renderShade, -11, 0.3, 0);
  box(g, 0.3, 0.55, 20, renderShade, 11, 0.3, 0);

  slab(g, w + 1.4, 0.5, d + 1.4, renderShade, 0, 0.8, 0); // plinth
  shell(g, render, 0.65, floor);
  slab(g, w, 0.26, d, roof, 0, 0.65 + floor + 0.26, 0);
  shell(g, render, 0.65 + floor + 0.26, floor);
  slab(g, w + 0.5, 0.3, d + 0.5, roof, 0, 0.65 + (floor + 0.26) * 2 + 0.3, 0);

  // courtyard open to the sky through both slabs
  slab(g, PLAN.court.w, 0.5, PLAN.court.d, mat("#cfc6b2"), 0, 0.7, 0);

  // windows — a dark pane, with a warm pane that comes on at dusk
  const lit = [];
  const litM = () =>
    new THREE.MeshBasicMaterial({ color: T("#ffd98a"), transparent: true, opacity: 0 });
  const win = (x, y, z, ww, hh, dd) => {
    box(g, ww, hh, dd, glassM, x, y, z);
    const m = box(g, ww * 0.92, hh * 0.86, dd * 2.2, litM(), x, y + hh * 0.07, z);
    m.castShadow = false;
    m.receiveShadow = false;
    m.visible = false;
    lit.push(m);
    return m;
  };
  win(-3.2, 1.5, -d / 2 + 0.14, 1.7, 1.5, 0.08);
  win(0.5, 1.5, -d / 2 + 0.14, 1.4, 1.5, 0.08);
  win(-2.8, 4.9, -d / 2 + 0.14, 1.6, 1.4, 0.08);
  win(1.2, 4.9, -d / 2 + 0.14, 1.6, 1.4, 0.08);
  win(-2.4, 1.5, d / 2 - 0.14, 1.8, 1.5, 0.08);
  win(2.6, 1.5, d / 2 - 0.14, 1.4, 1.5, 0.08);
  win(-w / 2 + 0.14, 4.9, -0.4, 0.08, 1.4, 2.0);
  // door
  box(g, 1.3, 2.3, 0.1, timber, 3.2, 0.65, d / 2 - 0.14);

  // jali screen — a perforated panel on the hot west face
  const jx = w / 2 - 0.1;
  box(g, 0.08, 3.3, 4.6, mat("#4e4535"), jx - 0.16, 3.6, -0.6); // the shadow behind
  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 8; j++)
      box(g, 0.16, 0.24, 0.24, jaliM, jx + 0.04, 3.75 + j * 0.4, -2.75 + i * 0.44);
  // the frame around the screen
  box(g, 0.2, 0.22, 4.8, jaliM, jx + 0.04, 3.5, -0.6);
  box(g, 0.2, 0.22, 4.8, jaliM, jx + 0.04, 6.9, -0.6);
  box(g, 0.2, 3.6, 0.22, jaliM, jx + 0.04, 3.5, -3.0);
  box(g, 0.2, 3.6, 0.22, jaliM, jx + 0.04, 3.5, 1.8);

  // pergola over the terrace
  [-1.1, 1.1].forEach((dz) => {
    box(g, 0.22, 2.3, 0.22, timber, -3.9, 7.5, 1.4 + dz);
    box(g, 0.22, 2.3, 0.22, timber, -0.6, 7.5, 1.4 + dz);
  });
  box(g, 3.9, 0.16, 0.2, timber, -2.25, 9.72, 0.3);
  box(g, 3.9, 0.16, 0.2, timber, -2.25, 9.72, 2.5);
  for (let i = 0; i < 8; i++) box(g, 0.14, 0.12, 2.5, timber, -3.9 + i * 0.5, 9.86, 1.4);

  // terrace garden beds
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 2; j++) {
      box(g, 1.5, 0.3, 0.9, renderShade, -3.6 + i * 1.7, 7.5, -1.3 + j * 1.1);
      box(g, 1.3, 0.22, 0.7, leafDark, -3.6 + i * 1.7, 7.75, -1.3 + j * 1.1);
    }

  // rooftop tank
  box(g, 1.5, 1.3, 1.5, tankM, 3.4, 7.5, -1.8);
  box(g, 1.7, 0.2, 1.7, renderShade, 3.4, 7.3, -1.8);

  // trees and planting around the house
  const r = rnd(21);
  const spots = [
    [-8.6, -5.2, 1.15],
    [-8.2, 0.6, 1.0],
    [-7.6, 5.4, 1.2],
    [-3.0, 7.4, 1.05],
    [2.4, 7.8, 1.25],
    [7.4, 6.4, 1.0],
    [8.6, 1.2, 1.15],
    [8.2, -4.6, 1.05],
    [-1.0, -7.2, 0.95],
    [4.6, -7.0, 1.1],
  ];
  spots.forEach(([x, z, s]) =>
    tree(g, x, z, s * (0.9 + r() * 0.25), timber, r() > 0.5 ? leaf : leafDark, 0.36)
  );

  // path from the gate to the door
  slab(g, 2.2, 0.09, 6.4, paving, 3.2, 0.44, 7.0);

  const warm = new THREE.PointLight(0xffc77a, 0, 22, 2);
  warm.position.set(0, 3.4, 0);
  g.add(warm);
  g.userData.lit = lit;
  g.userData.warm = warm;
  return g;
}

/* ------------------------------------------- 06 · services and the street */

function buildStreet() {
  const g = new THREE.Group();
  const road = mat("#3c3c3e");
  const kerb = mat("#8d8a82");
  const paint = mat("#e8e5dc");
  const pole = mat("#17171a");
  const timber = mat("#5b4433");
  const leaf = mat("#2f4c33");
  const concrete = mat("#9a948a");
  const lampOn = new THREE.MeshBasicMaterial({ color: T("#ffeab8") });
  const waterM = new THREE.MeshBasicMaterial({ color: T("#3ea4e8") });
  const sewerM = new THREE.MeshBasicMaterial({ color: T("#e8793a") });
  const redM = new THREE.MeshBasicMaterial({ color: T("#e04a3c") });
  const whiteM = new THREE.MeshBasicMaterial({ color: T("#fff6e2") });
  const tankM = mat("#cfc6b6");

  const L = 90; // road length
  const RW = 9; // road width

  // the crossing roads
  slab(g, L, 0.12, RW, road, 0, 0.14, 14);
  slab(g, RW, 0.12, L, road, -16, 0.14, 0);
  // kerbs
  [14 - RW / 2, 14 + RW / 2].forEach((z) => slab(g, L, 0.3, 0.5, kerb, 0, 0.3, z));
  [-16 - RW / 2, -16 + RW / 2].forEach((x) => slab(g, 0.5, 0.3, L, kerb, x, 0.3, 0));

  // lane markings and a zebra at the junction
  for (let x = -44; x < 44; x += 5) {
    if (Math.abs(x + 16) < RW) continue;
    slab(g, 2.2, 0.02, 0.22, paint, x, 0.21, 14);
  }
  for (let z = -44; z < 44; z += 5) {
    if (Math.abs(z - 14) < RW) continue;
    slab(g, 0.22, 0.02, 2.2, paint, -16, 0.21, z);
  }
  for (let i = 0; i < 6; i++) {
    slab(g, 0.55, 0.02, RW - 1, paint, -16 + RW / 2 + 1.4 + i * 0.95, 0.21, 14);
    slab(g, RW - 1, 0.02, 0.55, paint, -16, 0.21, 14 - RW / 2 - 1.4 - i * 0.95);
  }

  // buried services — water, sewer and power, drawn as glowing runs
  slab(g, L, 0.05, 0.35, waterM, 0, 0.1, 14 + RW / 2 + 1.5);
  slab(g, 0.35, 0.05, L, waterM, -16 + RW / 2 + 1.5, 0.1, 0);
  slab(g, L, 0.05, 0.35, sewerM, 0, 0.1, 14 - RW / 2 - 1.5);
  slab(g, 0.35, 0.05, L, sewerM, -16 - RW / 2 - 1.5, 0.1, 0);
  // the spur that serves the house
  slab(g, 0.3, 0.05, 11.4, waterM, 4.6, 0.1, 8.6);
  slab(g, 0.3, 0.05, 11.4, sewerM, 1.6, 0.1, 8.6);

  // street lights
  const lights = [];
  const streetLight = (x, z, rot) => {
    const p = new THREE.Group();
    cyl(p, 0.1, 6.4, pole, 0, 0, 0, 6);
    box(p, 1.6, 0.12, 0.12, pole, 0.8, 6.3, 0);
    const head = box(p, 0.7, 0.18, 0.4, lampOn, 1.5, 6.2, 0);
    const pl = new THREE.PointLight(0xffd9a0, 10, 16, 2);
    pl.position.set(1.5 + x, 6.1, z);
    g.add(pl);
    lights.push(pl);
    p.position.set(x, 0, z);
    p.rotation.y = rot;
    g.add(p);
    head.castShadow = false;
  };
  for (let x = -40; x <= 36; x += 13) {
    if (Math.abs(x + 16) < RW + 3) continue;
    streetLight(x, 14 + RW / 2 + 0.9, Math.PI);
    streetLight(x + 6, 14 - RW / 2 - 0.9, 0);
  }
  for (let z = -38; z <= 4; z += 13) streetLight(-16 - RW / 2 - 0.9, z, Math.PI / 2);

  // utility poles with catenary wires
  const wireM = new THREE.LineBasicMaterial({ color: 0x2a2a30 });
  let prev = null;
  for (let x = -42; x <= 30; x += 12) {
    const px = x;
    const pz = 14 + RW / 2 + 2.6;
    cyl(g, 0.16, 8.5, timber, px, 0, pz, 6);
    box(g, 0.1, 0.12, 2.4, timber, px, 8.0, pz);
    box(g, 0.1, 0.12, 1.8, timber, px, 7.3, pz);
    if (prev !== null) {
      [-1.0, 0, 1.0].forEach((o, i) => {
        const pts = [];
        for (let t = 0; t <= 8; t++) {
          const u = t / 8;
          const sag = Math.sin(u * Math.PI) * 0.5;
          pts.push(new THREE.Vector3(prev + (px - prev) * u, 8.05 - sag - i * 0.02, pz + o));
        }
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireM));
      });
    }
    prev = px;
  }

  // traffic signals at the junction
  const signal = (x, z) => {
    cyl(g, 0.09, 4.6, pole, x, 0, z, 6);
    box(g, 0.4, 1.0, 0.4, pole, x, 4.4, z);
    box(g, 0.14, 0.22, 0.1, redM, x + 0.2, 5.1, z);
  };
  signal(-16 + RW / 2 + 1.0, 14 + RW / 2 + 1.0);
  signal(-16 - RW / 2 - 1.0, 14 - RW / 2 - 1.0);
  signal(-16 + RW / 2 + 1.0, 14 - RW / 2 - 1.0);

  // cars — a body, a cabin and two lamps each
  const carColors = ["#1f2b3a", "#3a2a24", "#4a4a4e", "#6b2f2a", "#2e3b2c", "#55585c", "#7a6a4a"];
  const car = (x, z, rot, ci) => {
    const c = new THREE.Group();
    const body = mat(carColors[ci % carColors.length]);
    box(c, 4.2, 0.75, 1.9, body, 0, 0.18, 0);
    box(c, 2.2, 0.6, 1.75, body, -0.2, 0.9, 0);
    box(c, 0.12, 0.16, 0.5, redM, -2.1, 0.55, 0.55);
    box(c, 0.12, 0.16, 0.5, redM, -2.1, 0.55, -0.55);
    box(c, 0.12, 0.18, 0.55, whiteM, 2.1, 0.5, 0.5);
    box(c, 0.12, 0.18, 0.55, whiteM, 2.1, 0.5, -0.5);
    c.position.set(x, 0, z);
    c.rotation.y = rot;
    g.add(c);
  };
  const r = rnd(13);
  for (let i = 0; i < 9; i++) {
    const x = -44 + i * 10 + r() * 3;
    if (Math.abs(x + 16) < RW + 3) continue;
    car(x, 14 + (i % 2 ? 2.2 : -2.2), 0, i);
  }
  for (let i = 0; i < 6; i++) {
    const z = -40 + i * 11 + r() * 3;
    if (Math.abs(z - 14) < RW + 3) continue;
    car(-16 + (i % 2 ? 2.2 : -2.2), z, Math.PI / 2, i + 3);
  }

  // overhead reservoir
  const tower = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    cyl(tower, 0.2, 9, concrete, Math.cos(a) * 2.0, 0, Math.sin(a) * 2.0, 6);
  }
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 2.7, 3.0, 18), tankM);
  bowl.position.set(0, 10.5, 0);
  bowl.castShadow = true;
  tower.add(bowl);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.15, 4.15, 0.28, 18), waterM);
  ring.position.set(0, 9.9, 0);
  tower.add(ring);
  cyl(tower, 0.28, 9, concrete, 0, 0, 0, 8);
  tower.position.set(-23, 0, -11);
  g.add(tower);

  // sump and pump beside the house
  box(g, 1.6, 0.5, 1.6, concrete, 4.6, 0.2, 5.4);
  box(g, 0.7, 0.5, 0.6, mat("#44464a"), 3.2, 0.7, 5.4);

  // street trees
  for (let x = -36; x <= 30; x += 13) tree(g, x, 14 + RW / 2 + 4.4, 1.1, timber, leaf);
  for (let z = -34; z <= 2; z += 13) tree(g, -16 - RW / 2 - 4.4, z, 1.05, timber, leaf);

  // dashed plot boundary
  const dash = new THREE.LineDashedMaterial({ color: 0xcfd6e4, dashSize: 1.1, gapSize: 0.9 });
  const b = 13;
  const loop = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-b, 0.3, -b),
    new THREE.Vector3(b, 0.3, -b),
    new THREE.Vector3(b, 0.3, b),
    new THREE.Vector3(-b, 0.3, b),
    new THREE.Vector3(-b, 0.3, -b),
  ]);
  const line = new THREE.Line(loop, dash);
  line.computeLineDistances();
  g.add(line);

  g.userData.lights = lights;
  // anchors are chosen to sit on the right of the frame, clear of the copy
  g.userData.labels = [
    ["Street light", -3, 7.6, 22],
    ["Power line", -6, 8.0, 21.1],
    ["Water main", -7, 1.6, 19.6],
    ["Sump + pump", 4.2, 1.8, 5.4],
    ["Signalled junction", -10.5, 5.0, 18.6],
    ["Rooftop tank", 3.4, 9.4, -1.8],
    ["Overhead reservoir", -23, 14.6, -11],
    ["Sewer line", -4, 1.4, 8.0],
  ];
  return g;
}

/* ----------------------------------------------------------- 07 · the city */

function buildCity() {
  const g = new THREE.Group();
  const ground = mat("#e4e0d6");
  const roadM = mat("#cfcabe");
  const arterial = mat("#c2493f");
  const water = mat("#b9cbd6");
  const siteM = mat("#6f9460");
  const rail = mat("#8d8a82");

  slab(g, 520, 0.1, 520, ground, 0, 0.02, 0);

  // river
  slab(g, 70, 0.08, 520, water, -250, 0.06, 0).rotation.y = 0.12;

  // street grid
  for (let i = -6; i <= 6; i++) {
    slab(g, 520, 0.06, 7, roadM, 0, 0.1, i * 42);
    slab(g, 7, 0.06, 520, roadM, i * 42, 0.1, 0);
  }
  slab(g, 520, 0.07, 9, arterial, 0, 0.12, -84);
  // rail line
  slab(g, 520, 0.07, 4, rail, 0, 0.12, 44);

  // blocks — instanced, two tones
  const r = rnd(5);
  const light = mat("#f1eee6");
  const grey = mat("#dcd7cb");
  const count = 460;
  const mesh = new THREE.InstancedMesh(BOX, light, count);
  const mesh2 = new THREE.InstancedMesh(BOX, grey, count);
  const dummy = new THREE.Object3D();
  let a = 0;
  let b = 0;
  for (let gx = -6; gx < 6; gx++) {
    for (let gz = -6; gz < 6; gz++) {
      const cx = gx * 42 + 21;
      const cz = gz * 42 + 21;
      if (Math.abs(cx) < 30 && Math.abs(cz) < 30) continue; // the site stays clear
      const n = 2 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const w = 8 + r() * 12;
        const d = 8 + r() * 12;
        const h = 4 + r() * 16;
        dummy.position.set(cx - 14 + r() * 28, h / 2, cz - 14 + r() * 28);
        dummy.scale.set(w, h, d);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        if (r() > 0.45) {
          if (a < count) mesh.setMatrixAt(a++, dummy.matrix);
        } else if (b < count) mesh2.setMatrixAt(b++, dummy.matrix);
      }
    }
  }
  mesh.count = a;
  mesh2.count = b;
  mesh.castShadow = mesh2.castShadow = true;
  mesh.receiveShadow = mesh2.receiveShadow = true;
  g.add(mesh, mesh2);

  // the site, green and labelled
  slab(g, 34, 0.2, 30, siteM, 0, 0.2, 0);
  box(g, 9, 5.5, 7, light, -2, 0.2, -1);
  for (let i = 0; i < 5; i++) tree(g, -13 + i * 6.5, 11, 1.6, mat("#6b5340"), mat("#4a7c46"));

  // a station beside the rail line
  box(g, 30, 9, 11, mat("#f2efe7"), -46, 0.1, 44);
  box(g, 38, 0.6, 16, mat("#cfc9bb"), -46, 9.1, 44);

  g.userData.labels = [
    ["Your site", 0, 7.5, 0],
    ["Station", -46, 12, 44],
    ["Ward boundary", 120, 3, -120],
  ];
  return g;
}

/* --------------------------------------------------------------- the world */

// camera keyframes per stage index (3 … 7)
const SHOTS = {
  3: { pos: [19, 17, 24], tgt: [0, 2.2, 0], fov: 28 },
  4: { pos: [27, 21, 27], tgt: [0, 5.2, 0], fov: 30 },
  5: { pos: [31, 23, 34], tgt: [0, 2.6, 0], fov: 30 },
  6: { pos: [56, 50, 60], tgt: [-6, 0, 5], fov: 30 },
  7: { pos: [150, 200, 185], tgt: [-10, 0, -10], fov: 28 },
};

// which acts are on stage, and over what span they fade
const SPAN = {
  3: [2.25, 2.75, 3.4, 3.8],
  4: [3.3, 3.75, 4.35, 4.8],
  5: [4.3, 4.75, 6.3, 6.9],
  6: [5.3, 5.85, 7.1, 7.5],
  7: [6.35, 6.85, 7.6, 8.0],
};

// labels clear sooner than the geometry they sit on
const LABEL_SPAN = {
  6: [5.45, 5.9, 6.25, 6.5],
  7: [6.75, 7.05, 7.7, 8.1],
};

// 0 → 1 → 0 across the four span marks
function band([a, b, c, d], s) {
  if (s <= a || s >= d) return 0;
  if (s < b) return (s - a) / (b - a);
  if (s > c) return 1 - (s - c) / (d - c);
  return 1;
}

const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ground tint and sun per stage
const MOOD = {
  3: { ground: "#eeebe3", sun: 2.0, sunC: 0xffffff, amb: 1.5, ambC: 0xffffff, hemi: 0xe4e0d4, lamp: 0 },
  4: { ground: "#f0e9d6", sun: 2.0, sunC: 0xfff6e4, amb: 1.45, ambC: 0xdcebf7, hemi: 0xe8dfc8, lamp: 0 },
  5: { ground: "#cbbc9a", sun: 1.95, sunC: 0xfff0d0, amb: 1.3, ambC: 0xffe9cc, hemi: 0xd8c8a4, lamp: 0 },
  6: { ground: "#242b3e", sun: 0.3, sunC: 0x93a6dc, amb: 0.62, ambC: 0x7d8cc4, hemi: 0x2a3148, lamp: 1 },
  7: { ground: "#e6e2d8", sun: 1.9, sunC: 0xffffff, amb: 1.5, ambC: 0xffffff, hemi: 0xe0dccf, lamp: 0 },
};

export function createWorld(canvas, { calm = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 3000);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x9a9484, 0.75);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.25);
  sun.position.set(24, 34, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 110;
  const S = 32;
  Object.assign(sun.shadow.camera, { left: -S, right: S, top: S, bottom: -S });
  sun.shadow.bias = -0.0012;
  scene.add(sun, sun.target);

  // ground that reads as paper, tarmac or night depending on the act
  const groundMat = new THREE.MeshLambertMaterial({ color: T(MOOD[3].ground) });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(170, 48), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const groups = {};
  const register = (i, group) => {
    scene.add(group);
    group.visible = false;
    groups[i] = { group, materials: collectMaterials(group) };
  };
  register(3, buildModel());
  register(4, buildConstruction());
  register(5, buildLive());
  register(6, buildStreet());
  register(7, buildCity());

  const streetLights = groups[6].group.userData.lights || [];
  const litWindows = groups[5].group.userData.lit || [];
  const warmLight = groups[5].group.userData.warm || null;
  streetLights.forEach((l) => (l.intensity = 0));

  // labels that ride on the model, drawn as DOM so the type stays crisp
  const labels = [];
  [6, 7].forEach((i) => {
    (groups[i].group.userData.labels || []).forEach(([text, x, y, z]) => {
      labels.push({ stage: i, text, v: new THREE.Vector3(x, y, z) });
    });
  });

  const tmp = new THREE.Vector3();
  const camPos = new THREE.Vector3();
  const camTgt = new THREE.Vector3();
  let w = 1;
  let h = 1;

  function resize(width, height, dprCap = 1.75) {
    w = Math.max(1, width);
    h = Math.max(1, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* stage is a float: 3.0 … 7.0, plus a little below 3 while the 2D acts run */
  function update(stage) {
    const s = Math.min(7, Math.max(3, stage));
    const lo = Math.min(6, Math.floor(s));
    const hi = Math.min(7, lo + 1);
    const t = ease(Math.min(1, Math.max(0, s - lo)));

    // camera
    const A = SHOTS[lo];
    const B = SHOTS[hi];
    camPos.set(
      lerp(A.pos[0], B.pos[0], t),
      lerp(A.pos[1], B.pos[1], t),
      lerp(A.pos[2], B.pos[2], t)
    );
    camTgt.set(
      lerp(A.tgt[0], B.tgt[0], t),
      lerp(A.tgt[1], B.tgt[1], t),
      lerp(A.tgt[2], B.tgt[2], t)
    );
    // a slow drift through each act, so a held stage never looks frozen.
    // Visitors who ask for reduced motion get a camera that only moves when
    // they scroll.
    const spin = calm ? 0 : Math.sin((s - 3) * 1.0) * 0.022;
    const cs = Math.cos(spin);
    const sn = Math.sin(spin);
    camera.position.set(
      camPos.x * cs - camPos.z * sn,
      camPos.y,
      camPos.x * sn + camPos.z * cs
    );
    camera.lookAt(camTgt);
    camera.fov = lerp(A.fov, B.fov, t);

    // wide: hold the subject clear of the copy column.
    // narrow: drop it below the copy instead, since there is no room beside it.
    const wide = w > 980;
    if (wide) camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else camera.setViewOffset(w, h, 0, -h * 0.17, w, h);
    camera.updateProjectionMatrix();

    sun.target.position.copy(camTgt);
    sun.position.set(camTgt.x + 30, camTgt.y + 44, camTgt.z + 24);
    const reach = lerp(lo <= 5 ? 20 : 110, hi <= 5 ? 20 : 110, t);
    Object.assign(sun.shadow.camera, {
      left: -reach,
      right: reach,
      top: reach,
      bottom: -reach,
    });
    sun.shadow.camera.far = reach * 6;
    sun.shadow.camera.updateProjectionMatrix();

    // mood
    const MA = MOOD[lo];
    const MB = MOOD[hi];
    groundMat.color.set(MA.ground).lerp(T(MB.ground), t);
    sun.intensity = lerp(MA.sun, MB.sun, t);
    sun.color.set(MA.sunC).lerp(T(MB.sunC), t);
    ambient.intensity = lerp(MA.amb, MB.amb, t);
    ambient.color.set(MA.ambC).lerp(T(MB.ambC), t);
    ambient.groundColor.set(MA.hemi).lerp(T(MB.hemi), t);
    const lamp = lerp(MA.lamp, MB.lamp, t);
    streetLights.forEach((l) => (l.intensity = lamp * 26));
    if (warmLight) warmLight.intensity = lamp * 60;
    litWindows.forEach((m) => {
      m.material.opacity = lamp;
      m.material.transparent = lamp < 0.99;
      m.visible = lamp > 0.02;
    });
    renderer.shadowMap.enabled = lamp < 0.5;

    // which acts are on stage
    for (let i = 3; i <= 7; i++) setOpacity(groups[i], band(SPAN[i], stage));

    // project the labels — there is no room for them on a narrow screen
    const roomForLabels = w > 760;
    labels.forEach((l) => {
      if (!roomForLabels) {
        l.on = false;
        return;
      }
      const on = band(LABEL_SPAN[l.stage] || SPAN[l.stage], stage);
      l.on = on > 0.02;
      if (!l.on) return;
      tmp.copy(l.v).project(camera);
      l.x = (tmp.x * 0.5 + 0.5) * w;
      l.y = (-tmp.y * 0.5 + 0.5) * h;
      // the copy column stays clear: a label that would land in it is nudged
      // to the edge of the model area rather than dropped
      const guard = w > 980 ? w * 0.4 : 74;
      const far = l.x < guard - 260 || l.x > w - 40;
      if (l.x < guard) l.x = guard;
      const inside = !far && l.y > 96 && l.y < h - 132;
      l.o = tmp.z < 1 && inside ? on : 0;
    });

    renderer.render(scene, camera);
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
  }

  return { update, resize, dispose, labels };
}
