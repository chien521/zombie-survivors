import { createRunState, type RunState } from './upgrades';
import { getCharacter } from './characters';

/** 永久升級（roguelite meta，花金幣，套用到每一輪） */
export interface PermaUpgrade {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  maxLevel: number;
  costBase: number;
  costStep: number;
}

export const PERMA: PermaUpgrade[] = [
  { id: 'might', name: '威力', emoji: '⚔️', desc: '起始傷害 +1／級', maxLevel: 5, costBase: 100, costStep: 80 },
  { id: 'haste', name: '急速', emoji: '⚡', desc: '起始攻速 +6%／級', maxLevel: 5, costBase: 120, costStep: 90 },
  { id: 'vigor', name: '活力', emoji: '❤️', desc: '起始生命 +20／級', maxLevel: 5, costBase: 100, costStep: 80 },
  { id: 'swift', name: '敏捷', emoji: '👟', desc: '起始移速 +5%／級', maxLevel: 5, costBase: 100, costStep: 80 },
  { id: 'greed', name: '貪婪', emoji: '💰', desc: '金幣獲得 +15%／級', maxLevel: 5, costBase: 150, costStep: 120 },
];

export function permaCost(p: PermaUpgrade, currentLevel: number): number {
  return p.costBase + p.costStep * currentLevel;
}

/** 角色熟練度：累積擊殺數／勝場數，達門檻解鎖被動加成 */
export interface MasteryProgress {
  kills: number;
  wins: number;
}

export interface MetaData {
  gold: number;
  unlocked: string[];
  perma: Record<string, number>;
  /** 每個角色各自累積；舊存檔沒有此欄位時預設為空物件 */
  mastery: Record<string, MasteryProgress>;
}

const KEY = 'animal-survivors:meta:v2';

export function loadMeta(): MetaData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<MetaData>;
      return {
        gold: data.gold ?? 0,
        unlocked: data.unlocked ?? ['matt'],
        perma: data.perma ?? {},
        mastery: data.mastery ?? {},
      };
    }
  } catch {
    /* 忽略損毀資料 */
  }
  return { gold: 0, unlocked: ['matt'], perma: {}, mastery: {} };
}

/** 熟練度門檻：Lv1/Lv2 看累積擊殺，Lv3（角色專屬加成）看累積勝場 */
const MASTERY_TIER1_KILLS = 50;
const MASTERY_TIER2_KILLS = 200;
const MASTERY_TIER3_WINS = 10;

/** 目前熟練度等級（0~3） */
export function masteryTier(progress: MasteryProgress | undefined): 0 | 1 | 2 | 3 {
  const p = progress ?? { kills: 0, wins: 0 };
  if (p.wins >= MASTERY_TIER3_WINS) return 3;
  if (p.kills >= MASTERY_TIER2_KILLS) return 2;
  if (p.kills >= MASTERY_TIER1_KILLS) return 1;
  return 0;
}

/** 下一等級的進度文字（供角色卡顯示，如「熟練度 32/50」），已滿等回傳 null */
export function masteryProgressLabel(progress: MasteryProgress | undefined): string | null {
  const tier = masteryTier(progress);
  const p = progress ?? { kills: 0, wins: 0 };
  if (tier === 0) return `熟練度 ${p.kills}/${MASTERY_TIER1_KILLS}`;
  if (tier === 1) return `熟練度 ${p.kills}/${MASTERY_TIER2_KILLS}`;
  if (tier === 2) return `熟練度 ${p.wins}/${MASTERY_TIER3_WINS} 勝`;
  return null;
}

/** 套用熟練度加成：Lv1 生命 +10、Lv2 移速 +5%、Lv3 該角色專屬加成 */
export function applyMastery(s: RunState, characterId: string, progress: MasteryProgress | undefined) {
  const tier = masteryTier(progress);
  if (tier >= 1) s.maxHp += 10;
  if (tier >= 2) s.moveSpeed *= 1.05;
  if (tier >= 3) getCharacter(characterId).masteryBonus?.(s);
}

export function saveMeta(meta: MetaData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(meta));
  } catch {
    /* 忽略寫入失敗 */
  }
}

/** 依角色、永久升級與角色熟練度計算一輪的起始數值 */
export function computeStartRunState(
  characterId: string,
  perma: Record<string, number>,
  mastery?: Record<string, MasteryProgress>,
): RunState {
  const s = createRunState();
  getCharacter(characterId).apply(s);

  const might = perma.might ?? 0;
  const haste = perma.haste ?? 0;
  const vigor = perma.vigor ?? 0;
  const swift = perma.swift ?? 0;

  s.damage += might;
  s.fireInterval *= Math.pow(0.94, haste);
  s.maxHp += 20 * vigor;
  s.moveSpeed *= Math.pow(1.05, swift);
  applyMastery(s, characterId, mastery?.[characterId]);
  return s;
}

/** 金幣加成倍率（貪婪） */
export function goldMultiplier(perma: Record<string, number>): number {
  return 1 + 0.15 * (perma.greed ?? 0);
}
