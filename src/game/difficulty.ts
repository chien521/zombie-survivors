/** 難度設定：以倍率調整怪物/王強度與獎勵。簡單＝現況（全 ×1）。 */
export interface Difficulty {
  id: string;
  name: string;
  nameKey: string;
  emoji: string;
  desc: string;
  descKey: string;
  color: string;
  /** 怪物血量倍率 */
  enemyHp: number;
  /** 怪物速度倍率 */
  enemySpeed: number;
  /** 接觸傷害倍率（小怪與王） */
  enemyContact: number;
  /** 王血量倍率 */
  bossHp: number;
  /** 隨時間升壓的加速倍率 */
  growth: number;
  /** 金幣獎勵倍率 */
  goldReward: number;
}

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', name: '簡單', nameKey: 'difflevel.easy.name', emoji: '😀', color: '#4a7a2e', desc: '標準體驗，適合新手熟悉操作', descKey: 'difflevel.easy.desc', enemyHp: 1, enemySpeed: 1, enemyContact: 1, bossHp: 1, growth: 1, goldReward: 1 },
  { id: 'normal', name: '普通', nameKey: 'difflevel.normal.name', emoji: '🙂', color: '#6b8c2a', desc: '怪更硬、傷害更高', descKey: 'difflevel.normal.desc', enemyHp: 1.5, enemySpeed: 1.1, enemyContact: 1.3, bossHp: 1.5, growth: 1.2, goldReward: 1.5 },
  { id: 'hard', name: '困難', nameKey: 'difflevel.hard.name', emoji: '😬', color: '#a67c00', desc: '明顯吃緊，需要好的 build', descKey: 'difflevel.hard.desc', enemyHp: 2.2, enemySpeed: 1.2, enemyContact: 1.6, bossHp: 2.2, growth: 1.5, goldReward: 2.2 },
  { id: 'nightmare', name: '夢魘', nameKey: 'difflevel.nightmare.name', emoji: '😱', color: '#c25500', desc: '高壓快節奏，考驗極限', descKey: 'difflevel.nightmare.desc', enemyHp: 3.5, enemySpeed: 1.35, enemyContact: 2, bossHp: 3.5, growth: 1.8, goldReward: 3.5 },
  { id: 'hell', name: '地獄', nameKey: 'difflevel.hell.name', emoji: '💀', color: '#a81f1f', desc: '殘酷的極限挑戰', descKey: 'difflevel.hell.desc', enemyHp: 5, enemySpeed: 1.5, enemyContact: 2.6, bossHp: 5, growth: 2.2, goldReward: 5 },
];

export function getDifficulty(id: string): Difficulty {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}
