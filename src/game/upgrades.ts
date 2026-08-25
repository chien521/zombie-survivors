import { CONFIG } from './config';

/** 一輪遊戲的可變數值（會被升級修改） */
export interface RunState {
  // 玩家
  moveSpeed: number;
  maxHp: number;
  /** 跳躍初速（越高跳越高、滯空越久） */
  jumpStrength: number;
  /** 經驗吸取範圍 */
  pickupRadius: number;
  xpMultiplier: number;
  // 武器
  damage: number;
  fireInterval: number;
  projectileCount: number;
  range: number;
  projectileSpeed: number;
  // 環繞衛星
  orbitalCount: number;
  orbitalDamage: number;
  orbitalRadius: number;
  orbitalSpeed: number;
  // 傷害光環
  auraRadius: number;
  auraDamage: number;
  // 連鎖閃電
  lightningCount: number;
  lightningDamage: number;
  // 新星爆
  novaRadius: number;
  novaDamage: number;
  // 回力鏢
  boomerangCount: number;
  boomerangDamage: number;
  // 群控
  enemySpeedMul: number; // 時緩：全場怪速倍率
  slowRadius: number; // 減速光環半徑（0=關）
  slowFactor: number; // 範圍內怪速倍率
  freezeChance: number; // 命中冰凍機率
  // 防禦／續航
  lifestealOnKill: number; // 擊殺回血
  hpRegen: number; // 每秒回血
  damageReduction: number; // 受傷減免（0~0.8）
  shieldInterval: number; // 護盾再生間隔秒（0=關）
  // 進攻修飾
  critChance: number;
  critMult: number;
  pierce: number; // 子彈穿透數
  explodeRadius: number; // 爆裂半徑（0=關）
  explodeDamage: number;
  // 升級羈絆（synergy）：已解鎖的羈絆 id 集合，每局重置
  synergyUnlocked: Record<string, true>;
}

export function createRunState(): RunState {
  return {
    moveSpeed: CONFIG.player.speed,
    maxHp: CONFIG.player.maxHp,
    jumpStrength: CONFIG.player.jump.strength,
    pickupRadius: 5,
    xpMultiplier: 1,
    damage: CONFIG.weapon.damage,
    fireInterval: CONFIG.weapon.fireInterval,
    projectileCount: 1,
    range: CONFIG.weapon.range,
    projectileSpeed: CONFIG.weapon.projectileSpeed,
    orbitalCount: 0,
    orbitalDamage: 2,
    orbitalRadius: 4,
    orbitalSpeed: 2.4,
    auraRadius: 0,
    auraDamage: 1,
    lightningCount: 0,
    lightningDamage: 3,
    novaRadius: 0,
    novaDamage: 4,
    boomerangCount: 0,
    boomerangDamage: 4,
    enemySpeedMul: 1,
    slowRadius: 0,
    slowFactor: 0.5,
    freezeChance: 0,
    lifestealOnKill: 0,
    hpRegen: 0,
    damageReduction: 0,
    shieldInterval: 0,
    critChance: 0,
    critMult: 2,
    pierce: 0,
    explodeRadius: 0,
    explodeDamage: 3,
    synergyUnlocked: {},
  };
}

/** 升級羈絆分類（每個升級恰屬於一種流派） */
export type SynergyTag = 'berserker' | 'controller' | 'guardian' | 'swarm' | 'scout';

export interface Upgrade {
  id: string;
  name: string;
  /** UI 顯示用翻譯 key（見 src/i18n.ts）；死鬥祝福/詛咒等一次性選項未列入本輪翻譯範圍，留空即可 */
  nameKey?: string;
  desc: string;
  descKey?: string;
  emoji: string;
  maxLevel: number;
  /** 羈絆流派；死鬥模式的祝福/詛咒等一次性特殊選項不屬於任何流派，留空即可 */
  tag?: SynergyTag;
  apply: (s: RunState) => void;
}

export const UPGRADES: Upgrade[] = [
  { id: 'damage', name: '攻擊力', nameKey: 'upgrade.damage.name', desc: '武器傷害 +1', descKey: 'upgrade.damage.desc', emoji: '⚔️', maxLevel: 8, tag: 'berserker', apply: (s) => (s.damage += 1) },
  { id: 'firerate', name: '攻速', nameKey: 'upgrade.firerate.name', desc: '發射間隔 −12%', descKey: 'upgrade.firerate.desc', emoji: '⚡', maxLevel: 8, tag: 'berserker', apply: (s) => (s.fireInterval *= 0.88) },
  { id: 'multishot', name: '多重彈', nameKey: 'upgrade.multishot.name', desc: '投射物 +1', descKey: 'upgrade.multishot.desc', emoji: '🎯', maxLevel: 4, tag: 'scout', apply: (s) => (s.projectileCount += 1) },
  { id: 'range', name: '射程', nameKey: 'upgrade.range.name', desc: '鎖定範圍 +20%', descKey: 'upgrade.range.desc', emoji: '🔭', maxLevel: 5, tag: 'scout', apply: (s) => (s.range *= 1.2) },
  { id: 'projspeed', name: '彈速', nameKey: 'upgrade.projspeed.name', desc: '投射物速度 +20%', descKey: 'upgrade.projspeed.desc', emoji: '💨', maxLevel: 5, tag: 'scout', apply: (s) => (s.projectileSpeed *= 1.2) },
  { id: 'movespeed', name: '移動速度', nameKey: 'upgrade.movespeed.name', desc: '移速 +10%', descKey: 'upgrade.movespeed.desc', emoji: '👟', maxLevel: 5, tag: 'scout', apply: (s) => (s.moveSpeed *= 1.1) },
  {
    id: 'jump',
    name: '跳躍強化',
    nameKey: 'upgrade.jump.name',
    desc: '跳得更高、滯空更久（騰空可閃避接觸傷害）',
    descKey: 'upgrade.jump.desc',
    emoji: '🦘',
    maxLevel: 4,
    tag: 'scout',
    apply: (s) => (s.jumpStrength += 2),
  },
  { id: 'maxhp', name: '最大生命', nameKey: 'upgrade.maxhp.name', desc: '生命上限 +20 並補滿', descKey: 'upgrade.maxhp.desc', emoji: '❤️', maxLevel: 5, tag: 'guardian', apply: (s) => (s.maxHp += 20) },
  { id: 'magnet', name: '拾取範圍', nameKey: 'upgrade.magnet.name', desc: '經驗吸取範圍 +30%', descKey: 'upgrade.magnet.desc', emoji: '🧲', maxLevel: 5, tag: 'scout', apply: (s) => (s.pickupRadius *= 1.3) },
  { id: 'xpgain', name: '經驗加成', nameKey: 'upgrade.xpgain.name', desc: '經驗獲得 +15%', descKey: 'upgrade.xpgain.desc', emoji: '⭐', maxLevel: 5, tag: 'scout', apply: (s) => (s.xpMultiplier *= 1.15) },
  {
    id: 'orbital',
    name: '環繞飛斧',
    nameKey: 'upgrade.orbital.name',
    desc: '召喚環繞身邊的旋轉斧頭，碰撞傷害敵人；已有則 +1 把並擴大環繞範圍',
    descKey: 'upgrade.orbital.desc',
    emoji: '🪓',
    maxLevel: 10,
    tag: 'swarm',
    apply: (s) => {
      s.orbitalCount += 1;
      s.orbitalDamage += 1;
      s.orbitalRadius += 1.4;
    },
  },
  {
    id: 'aura',
    name: '傷害光環',
    nameKey: 'upgrade.aura.name',
    desc: '展開持續傷害光環，自動灼燒靠近的敵人；已有則擴大並增傷',
    descKey: 'upgrade.aura.desc',
    emoji: '🌀',
    maxLevel: 10,
    tag: 'swarm',
    apply: (s) => {
      s.auraRadius = s.auraRadius === 0 ? 4 : s.auraRadius + 1.6;
      s.auraDamage += 1;
    },
  },
  {
    id: 'lightning',
    name: '連鎖閃電',
    nameKey: 'upgrade.lightning.name',
    desc: '定期電擊最近的敵人並向周圍連鎖；已有則 +1 連鎖數並增傷',
    descKey: 'upgrade.lightning.desc',
    emoji: '⚡',
    maxLevel: 10,
    tag: 'controller',
    apply: (s) => {
      s.lightningCount += 1;
      s.lightningDamage += 1;
    },
  },
  {
    id: 'nova',
    name: '新星爆',
    nameKey: 'upgrade.nova.name',
    desc: '定期釋放向外擴張的衝擊波，炸傷周圍所有敵人；已有則擴大並增傷',
    descKey: 'upgrade.nova.desc',
    emoji: '💥',
    maxLevel: 10,
    tag: 'swarm',
    apply: (s) => {
      s.novaRadius = s.novaRadius === 0 ? 6 : s.novaRadius + 1;
      s.novaDamage += 2;
    },
  },
  {
    id: 'boomerang',
    name: '回力鏢',
    nameKey: 'upgrade.boomerang.name',
    desc: '定期丟出長矛飛出再飛回，沿途貫穿傷害敵人；已有則 +1 支並增傷',
    descKey: 'upgrade.boomerang.desc',
    emoji: '🪃',
    maxLevel: 10,
    tag: 'swarm',
    apply: (s) => {
      s.boomerangCount += 1;
      s.boomerangDamage += 1;
    },
  },
  // ===== 群控 =====
  {
    id: 'slowfield',
    name: '減速光環',
    nameKey: 'upgrade.slowfield.name',
    desc: '身邊一圈的殭屍移動變慢；已有則擴大範圍',
    descKey: 'upgrade.slowfield.desc',
    emoji: '❄️',
    maxLevel: 5,
    tag: 'controller',
    apply: (s) => {
      s.slowRadius = s.slowRadius === 0 ? 7 : s.slowRadius + 1.5;
      s.slowFactor = Math.max(0.3, s.slowFactor - 0.05);
    },
  },
  {
    id: 'timeslow',
    name: '時緩',
    nameKey: 'upgrade.timeslow.name',
    desc: '全場殭屍永久減速 8%',
    descKey: 'upgrade.timeslow.desc',
    emoji: '🐌',
    maxLevel: 5,
    tag: 'controller',
    apply: (s) => (s.enemySpeedMul *= 0.92),
  },
  {
    id: 'freeze',
    name: '冰凍彈',
    nameKey: 'upgrade.freeze.name',
    desc: '子彈命中有機率短暫冰凍殭屍；已有則機率提升',
    descKey: 'upgrade.freeze.desc',
    emoji: '🧊',
    maxLevel: 5,
    tag: 'controller',
    apply: (s) => (s.freezeChance = Math.min(0.5, s.freezeChance + 0.08)),
  },
  // ===== 防禦／續航 =====
  {
    id: 'lifesteal',
    name: '吸血',
    nameKey: 'upgrade.lifesteal.name',
    desc: '擊殺殭屍回復生命（每秒回血有上限）；已有則上限提升',
    descKey: 'upgrade.lifesteal.desc',
    emoji: '🩸',
    maxLevel: 5,
    tag: 'guardian',
    apply: (s) => (s.lifestealOnKill += 0.35),
  },
  {
    id: 'regen',
    name: '生命再生',
    nameKey: 'upgrade.regen.name',
    desc: '每秒回復生命；已有則回更多',
    descKey: 'upgrade.regen.desc',
    emoji: '❤️‍🩹',
    maxLevel: 5,
    tag: 'guardian',
    apply: (s) => (s.hpRegen += 0.7),
  },
  {
    id: 'armor',
    name: '護甲',
    nameKey: 'upgrade.armor.name',
    desc: '受到的傷害減免 10%（最多 70%）',
    descKey: 'upgrade.armor.desc',
    emoji: '🛡️',
    maxLevel: 5,
    tag: 'guardian',
    apply: (s) => (s.damageReduction = Math.min(0.7, s.damageReduction + 0.1)),
  },
  {
    id: 'shield',
    name: '能量護盾',
    nameKey: 'upgrade.shield.name',
    desc: '定期生成可擋一次傷害的護盾；已有則生成更快',
    descKey: 'upgrade.shield.desc',
    emoji: '🔆',
    maxLevel: 5,
    tag: 'guardian',
    apply: (s) => (s.shieldInterval = s.shieldInterval === 0 ? 12 : Math.max(4, s.shieldInterval - 2)),
  },
  // ===== 進攻修飾 =====
  {
    id: 'crit',
    name: '暴擊',
    nameKey: 'upgrade.crit.name',
    desc: '子彈有機率造成 2 倍傷害；已有則機率提升',
    descKey: 'upgrade.crit.desc',
    emoji: '💥',
    maxLevel: 5,
    tag: 'berserker',
    apply: (s) => (s.critChance = Math.min(0.6, s.critChance + 0.1)),
  },
  {
    id: 'pierce',
    name: '穿透',
    nameKey: 'upgrade.pierce.name',
    desc: '子彈可貫穿 +1 隻殭屍不消失',
    descKey: 'upgrade.pierce.desc',
    emoji: '🎯',
    maxLevel: 4,
    tag: 'berserker',
    apply: (s) => (s.pierce += 1),
  },
  {
    id: 'explode',
    name: '爆裂彈',
    nameKey: 'upgrade.explode.name',
    desc: '子彈命中產生範圍爆炸；已有則擴大並增傷',
    descKey: 'upgrade.explode.desc',
    emoji: '🧨',
    maxLevel: 5,
    tag: 'berserker',
    apply: (s) => {
      s.explodeRadius = s.explodeRadius === 0 ? 3 : s.explodeRadius + 0.8;
      s.explodeDamage += 2;
    },
  },
];

export interface SynergyTier {
  id: string;
  tag: SynergyTag;
  /** 該流派需擁有幾種不同升級（不看等級，只看是否擁有）才會解鎖 */
  threshold: number;
  name: string;
  nameKey: string;
  desc: string;
  descKey: string;
  emoji: string;
  apply: (s: RunState) => void;
}

/** 升級羈絆：同一流派擁有的「不同升級種類數」達門檻時，一次性解鎖額外加成（不隨等級重複疊加） */
export const SYNERGY_TIERS: SynergyTier[] = [
  { id: 'berserker-1', tag: 'berserker', threshold: 3, name: '嗜血 I', nameKey: 'synergy.berserker-1.name', desc: '暴擊率額外 +5%', descKey: 'synergy.berserker-1.desc', emoji: '🔴', apply: (s) => (s.critChance = Math.min(0.6, s.critChance + 0.05)) },
  { id: 'berserker-2', tag: 'berserker', threshold: 5, name: '嗜血 II', nameKey: 'synergy.berserker-2.name', desc: '暴擊傷害倍率額外 +0.5', descKey: 'synergy.berserker-2.desc', emoji: '🔴', apply: (s) => (s.critMult += 0.5) },
  { id: 'controller-1', tag: 'controller', threshold: 2, name: '寒霜 I', nameKey: 'synergy.controller-1.name', desc: '冰凍機率額外 +5%', descKey: 'synergy.controller-1.desc', emoji: '🔵', apply: (s) => (s.freezeChance = Math.min(0.5, s.freezeChance + 0.05)) },
  { id: 'controller-2', tag: 'controller', threshold: 4, name: '寒霜 II', nameKey: 'synergy.controller-2.name', desc: '全場殭屍再減速 5%', descKey: 'synergy.controller-2.desc', emoji: '🔵', apply: (s) => (s.enemySpeedMul *= 0.95) },
  { id: 'guardian-1', tag: 'guardian', threshold: 3, name: '不屈 I', nameKey: 'synergy.guardian-1.name', desc: '傷害減免額外 +5%', descKey: 'synergy.guardian-1.desc', emoji: '🟢', apply: (s) => (s.damageReduction = Math.min(0.7, s.damageReduction + 0.05)) },
  { id: 'guardian-2', tag: 'guardian', threshold: 5, name: '不屈 II', nameKey: 'synergy.guardian-2.name', desc: '每秒回血額外 +1', descKey: 'synergy.guardian-2.desc', emoji: '🟢', apply: (s) => (s.hpRegen += 1) },
  {
    id: 'swarm-1',
    tag: 'swarm',
    threshold: 2,
    name: '亂舞 I',
    nameKey: 'synergy.swarm-1.name',
    desc: '所有副武器傷害額外 +1',
    descKey: 'synergy.swarm-1.desc',
    emoji: '🟣',
    apply: (s) => {
      s.orbitalDamage += 1;
      s.auraDamage += 1;
      s.lightningDamage += 1;
      s.novaDamage += 1;
      s.boomerangDamage += 1;
    },
  },
  {
    id: 'swarm-2',
    tag: 'swarm',
    threshold: 4,
    name: '亂舞 II',
    nameKey: 'synergy.swarm-2.name',
    desc: '所有副武器傷害再 +1，環繞／光環範圍擴大',
    descKey: 'synergy.swarm-2.desc',
    emoji: '🟣',
    apply: (s) => {
      s.orbitalDamage += 1;
      s.auraDamage += 1;
      s.lightningDamage += 1;
      s.novaDamage += 1;
      s.boomerangDamage += 1;
      s.orbitalRadius += 1;
      s.auraRadius += 1;
    },
  },
  { id: 'scout-1', tag: 'scout', threshold: 4, name: '疾行 I', nameKey: 'synergy.scout-1.name', desc: '經驗獲得額外 +10%', descKey: 'synergy.scout-1.desc', emoji: '🟡', apply: (s) => (s.xpMultiplier *= 1.1) },
  { id: 'scout-2', tag: 'scout', threshold: 7, name: '疾行 II', nameKey: 'synergy.scout-2.name', desc: '移速額外 +5%、拾取範圍額外 +30%', descKey: 'synergy.scout-2.desc', emoji: '🟡', apply: (s) => { s.moveSpeed *= 1.05; s.pickupRadius *= 1.3; } },
];

/** 檢查是否有新的流派羈絆達門檻；若有則套用加成、記錄已解鎖，並回傳新解鎖的羈絆列表（供 UI 提示） */
export function checkSynergyUnlocks(run: RunState, levels: Record<string, number>): SynergyTier[] {
  const unlocked: SynergyTier[] = [];
  for (const tier of SYNERGY_TIERS) {
    if (run.synergyUnlocked[tier.id]) continue;
    const owned = UPGRADES.filter((u) => u.tag === tier.tag && (levels[u.id] ?? 0) > 0).length;
    if (owned < tier.threshold) continue;
    tier.apply(run);
    run.synergyUnlocked[tier.id] = true;
    unlocked.push(tier);
  }
  return unlocked;
}

/** 從尚未滿級的升級中隨機抽 n 個；uncapped=true 時忽略滿級上限（死鬥無盡強化） */
export function rollChoices(levels: Record<string, number>, n = 3, uncapped = false): Upgrade[] {
  const pool = UPGRADES.filter((u) => uncapped || (levels[u.id] ?? 0) < u.maxLevel);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/** 升到指定等級所需經驗 */
/** 升到指定等級所需經驗：加速成長（二次項），避免後期經驗洪流造成連續升級洗版 */
export function xpForLevel(level: number): number {
  return Math.round(5 + level * 4 + level * level * 0.4);
}
