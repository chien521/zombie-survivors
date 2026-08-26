import { Scene, Mesh, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

/** 王的招式對「玩家」造成傷害的實體：彈幕、震波、毒池。 */

const PROJ_CAP = 64;
const PROJ_RADIUS = 0.5;
const PROJ_LIFE = 4;
const PROJ_Y = 1.1;

const SHOCK_DURATION = 0.9;
const SHOCK_MAX_R = 16;
const SHOCK_BAND = 1.8;

const POISON_DURATION = 5;
const POISON_RADIUS = 4;

/** 追蹤彈每秒轉向玩家的比例（0~1，越高轉向越快、越難甩開） */
const HOMING_TURN_RATE = 1.4;

interface Shock {
  mesh: Mesh;
  t: number;
  x: number;
  z: number;
  hit: boolean;
}
interface Poison {
  mesh: Mesh;
  t: number;
  x: number;
  z: number;
}

export class BossHazards {
  private scene: Scene;

  private px = new Float32Array(PROJ_CAP);
  private pz = new Float32Array(PROJ_CAP);
  private vx = new Float32Array(PROJ_CAP);
  private vz = new Float32Array(PROJ_CAP);
  private life = new Float32Array(PROJ_CAP);
  private active = new Uint8Array(PROJ_CAP);
  /** 每發彈幕的傷害 */
  private projDmg = new Float32Array(PROJ_CAP);
  /** 追蹤彈：1 表示每幀朝玩家當前位置轉向（骷髏王詛咒彈） */
  private homing = new Uint8Array(PROJ_CAP);
  private projMesh: Mesh[] = [];

  private shocks: Shock[] = [];
  private poisons: Poison[] = [];

  private projMat!: StandardMaterial;
  private shockMat: StandardMaterial;
  private poisonMat: StandardMaterial;
  private homingMat: StandardMaterial;
  /** 玩家所在地形高度（招式貼地基準） */
  private baseY = 0;
  /** 招式傷害（debug 可調） */
  projDamage = 12;
  shockDamage = 20;
  poisonDps = 16;

  constructor(scene: Scene) {
    this.scene = scene;

    this.projMat = new StandardMaterial('boss-proj-mat', scene);
    this.projMat.diffuseColor = new Color3(0.8, 0.3, 0.9);
    this.projMat.emissiveColor = new Color3(0.7, 0.2, 0.9);
    this.projMat.specularColor = Color3.Black();
    this.projMat.disableLighting = true;
    for (let i = 0; i < PROJ_CAP; i++) {
      const m = MeshBuilder.CreateSphere(`bproj-${i}`, { diameter: PROJ_RADIUS * 2, segments: 8 }, scene);
      m.material = this.projMat;
      m.isPickable = false;
      m.setEnabled(false);
      this.projMesh.push(m);
    }

    this.shockMat = new StandardMaterial('shock-mat', scene);
    this.shockMat.diffuseColor = new Color3(1, 0.7, 0.3);
    this.shockMat.emissiveColor = new Color3(1, 0.55, 0.2);
    this.shockMat.specularColor = Color3.Black();
    this.shockMat.disableLighting = true;
    this.shockMat.alpha = 0.6;

    this.poisonMat = new StandardMaterial('poison-mat', scene);
    this.poisonMat.diffuseColor = new Color3(0.4, 0.9, 0.3);
    this.poisonMat.emissiveColor = new Color3(0.3, 0.7, 0.2);
    this.poisonMat.specularColor = Color3.Black();
    this.poisonMat.disableLighting = true;
    this.poisonMat.alpha = 0.4;
    this.poisonMat.backFaceCulling = false;

    this.homingMat = new StandardMaterial('homing-mat', scene);
    this.homingMat.diffuseColor = new Color3(0.35, 0.95, 0.55);
    this.homingMat.emissiveColor = new Color3(0.25, 0.9, 0.45);
    this.homingMat.specularColor = Color3.Black();
    this.homingMat.disableLighting = true;
  }

  private spawnProj(x: number, z: number, dirX: number, dirZ: number, speed: number, damage: number, homing = false) {
    for (let i = 0; i < PROJ_CAP; i++) {
      if (this.active[i]) continue;
      this.active[i] = 1;
      this.px[i] = x;
      this.pz[i] = z;
      this.vx[i] = dirX * speed;
      this.vz[i] = dirZ * speed;
      this.life[i] = PROJ_LIFE;
      this.projDmg[i] = damage;
      this.homing[i] = homing ? 1 : 0;
      this.projMesh[i].material = homing ? this.homingMat : this.projMat;
      this.projMesh[i].position.set(x, this.baseY + PROJ_Y, z);
      this.projMesh[i].setEnabled(true);
      return;
    }
  }

  /** 朝玩家連射數發（狂暴肋骨怪） */
  aimedBarrage(x: number, z: number, targetX: number, targetZ: number, count: number) {
    const base = Math.atan2(targetZ - z, targetX - x);
    for (let k = 0; k < count; k++) {
      const a = base + (k - (count - 1) / 2) * 0.18;
      this.spawnProj(x, z, Math.cos(a), Math.sin(a), 20, this.projDamage);
    }
  }

  /** 全方位環形彈幕（終極殭屍王） */
  radialBarrage(x: number, z: number, count: number) {
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2;
      this.spawnProj(x, z, Math.cos(a), Math.sin(a), 16, this.projDamage);
    }
  }

  /** 詛咒追蹤彈：速度較慢但每幀朝玩家當前位置緩慢轉向（骷髏王） */
  homingBarrage(x: number, z: number, targetX: number, targetZ: number, count: number) {
    const base = Math.atan2(targetZ - z, targetX - x);
    for (let k = 0; k < count; k++) {
      const a = base + (k - (count - 1) / 2) * 0.5;
      this.spawnProj(x, z, Math.cos(a), Math.sin(a), 9, this.projDamage, true);
    }
  }

  /** 敵人遠程單發攻擊（自訂傷害；無頭骷髏用） */
  enemyShot(x: number, z: number, targetX: number, targetZ: number, damage: number) {
    const a = Math.atan2(targetZ - z, targetX - x);
    this.spawnProj(x, z, Math.cos(a), Math.sin(a), 16, damage);
  }

  /** 落地震波擴散環（斷臂巨怪） */
  shockwave(x: number, z: number) {
    const mesh = MeshBuilder.CreateTorus('shock', { diameter: 2, thickness: 0.5, tessellation: 40 }, this.scene);
    mesh.material = this.shockMat;
    mesh.isPickable = false;
    mesh.position.set(x, this.baseY + 0.3, z);
    this.shocks.push({ mesh, t: 0, x, z, hit: false });
  }

  /** 玩家腳下生成持續毒池（腐毒殭屍） */
  poison(x: number, z: number) {
    const mesh = MeshBuilder.CreateDisc('poison', { radius: POISON_RADIUS, tessellation: 32 }, this.scene);
    mesh.rotation.x = Math.PI / 2;
    mesh.material = this.poisonMat;
    mesh.isPickable = false;
    mesh.position.set(x, this.baseY + 0.06, z);
    this.poisons.push({ mesh, t: 0, x, z });
  }

  /** 每幀更新，回傳本幀對玩家造成的總傷害 */
  update(dt: number, playerX: number, playerZ: number, baseY: number): number {
    this.baseY = baseY;
    let damage = 0;

    /** 彈幕 */
    const hitR = PROJ_RADIUS + 0.9;
    const hitR2 = hitR * hitR;
    for (let i = 0; i < PROJ_CAP; i++) {
      if (!this.active[i]) continue;
      /** 追蹤彈：緩慢將速度向量轉向玩家當前位置（可被甩開，非鎖死） */
      if (this.homing[i]) {
        const tdx = playerX - this.px[i];
        const tdz = playerZ - this.pz[i];
        const tlen = Math.hypot(tdx, tdz) || 1;
        const speed = Math.hypot(this.vx[i], this.vz[i]) || 9;
        const turn = HOMING_TURN_RATE * dt;
        this.vx[i] += ((tdx / tlen) * speed - this.vx[i]) * turn;
        this.vz[i] += ((tdz / tlen) * speed - this.vz[i]) * turn;
      }
      this.px[i] += this.vx[i] * dt;
      this.pz[i] += this.vz[i] * dt;
      this.life[i] -= dt;
      const dx = this.px[i] - playerX;
      const dz = this.pz[i] - playerZ;
      if (dx * dx + dz * dz <= hitR2) {
        damage += this.projDmg[i];
        this.active[i] = 0;
        this.projMesh[i].setEnabled(false);
        continue;
      }
      if (this.life[i] <= 0) {
        this.active[i] = 0;
        this.projMesh[i].setEnabled(false);
        continue;
      }
      this.projMesh[i].position.set(this.px[i], this.baseY + PROJ_Y, this.pz[i]);
    }

    /** 震波：擴散環，掃過玩家造成一次傷害 */
    for (let i = this.shocks.length - 1; i >= 0; i--) {
      const s = this.shocks[i];
      s.t += dt;
      const r = (s.t / SHOCK_DURATION) * SHOCK_MAX_R;
      s.mesh.scaling.set(r, 1, r);
      s.mesh.visibility = Math.max(0, 1 - s.t / SHOCK_DURATION);
      if (!s.hit) {
        const d = Math.hypot(playerX - s.x, playerZ - s.z);
        if (Math.abs(d - r) <= SHOCK_BAND) {
          damage += this.shockDamage;
          s.hit = true;
        }
      }
      if (s.t >= SHOCK_DURATION) {
        s.mesh.dispose();
        this.shocks.splice(i, 1);
      }
    }

    /** 毒池：站在內持續扣血 */
    for (let i = this.poisons.length - 1; i >= 0; i--) {
      const p = this.poisons[i];
      p.t += dt;
      const d2 = (playerX - p.x) ** 2 + (playerZ - p.z) ** 2;
      if (d2 <= POISON_RADIUS * POISON_RADIUS) damage += this.poisonDps * dt;
      if (p.t >= POISON_DURATION) {
        p.mesh.dispose();
        this.poisons.splice(i, 1);
      } else {
        p.mesh.visibility = p.t > POISON_DURATION - 1 ? POISON_DURATION - p.t : 1;
      }
    }

    return damage;
  }

  reset() {
    this.active.fill(0);
    this.homing.fill(0);
    for (const m of this.projMesh) m.setEnabled(false);
    for (const s of this.shocks) s.mesh.dispose();
    for (const p of this.poisons) p.mesh.dispose();
    this.shocks.length = 0;
    this.poisons.length = 0;
  }
}
