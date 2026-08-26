import type { RunState } from './upgrades';

export interface Character {
  id: string;
  /** 中文原文（後端排行榜提交用，維持原樣不隨語系變動） */
  name: string;
  /** UI 顯示用翻譯 key（見 src/i18n.ts） */
  nameKey: string;
  traitKey: string;
  descKey: string;
  emoji: string;
  /** 解鎖所需金幣，0 為預設已解鎖 */
  cost: number;
  /** 一句話特性（標籤） */
  trait: string;
  /** 詳細介紹（數值與起始攻擊機制） */
  desc: string;
  /** 身體顏色（程序化造型 fallback 用） */
  bodyColor: [number, number, number];
  /** GLB 模型路徑（無則用程序化造型） */
  model?: string;
  /** 套用至起始 RunState 的角色差異 */
  apply: (s: RunState) => void;
  /** 該角色熟練度 Lv3（累積 10 勝）解鎖的專屬加成 */
  masteryBonus?: (s: RunState) => void;
}

export const CHARACTERS: Character[] = [
  {
    id: 'matt',
    name: '工頭麥特',
    nameKey: 'character.matt.name',
    traitKey: 'character.matt.trait',
    descKey: 'character.matt.desc',
    emoji: '🔫',
    cost: 0,
    trait: '均衡｜起始攻擊：強化單發子彈',
    desc: '各項數值標準、無弱點，適合新手。起手傷害 +1，穩定單發點放，靠升級自由組合流派。',
    bodyColor: [0.3, 0.45, 0.6],
    model: 'models/zombie/survivor_matt_armed.glb',
    apply: (s) => {
      s.damage += 1;
    },
    masteryBonus: (s) => (s.projectileCount += 1),
  },
  {
    id: 'lis',
    name: '飛毛腿莉絲',
    nameKey: 'character.lis.name',
    traitKey: 'character.lis.trait',
    descKey: 'character.lis.desc',
    emoji: '👟',
    cost: 300,
    trait: '高速脆皮｜起始攻擊：三連發散射',
    desc: '移速 +20%、生命 −25。開局子彈一次噴三發扇形散彈，近距離火力強，但血薄要靠走位。',
    bodyColor: [0.8, 0.4, 0.5],
    model: 'models/zombie/survivor_lis_armed.glb',
    apply: (s) => {
      s.moveSpeed *= 1.2;
      s.maxHp -= 25;
      s.projectileCount = 3;
    },
    masteryBonus: (s) => (s.projectileCount += 1),
  },
  {
    id: 'sam',
    name: '龐克山姆',
    nameKey: 'character.sam.name',
    traitKey: 'character.sam.trait',
    descKey: 'character.sam.desc',
    emoji: '⚡',
    cost: 300,
    trait: '輸出爆發｜起始攻擊：極速連射',
    desc: '發射間隔 −45%、生命 −15。子彈如雨般極速連射，單體輸出爆裂，疊攻擊力後非常猛。',
    bodyColor: [0.85, 0.7, 0.3],
    model: 'models/zombie/survivor_sam_armed.glb',
    apply: (s) => {
      s.fireInterval *= 0.55;
      s.maxHp -= 15;
    },
    masteryBonus: (s) => (s.fireInterval *= 0.9),
  },
  {
    id: 'shaun',
    name: '背包客尚恩',
    nameKey: 'character.shaun.name',
    traitKey: 'character.shaun.trait',
    descKey: 'character.shaun.desc',
    emoji: '🧲',
    cost: 200,
    trait: '拾取廣｜起始攻擊：環繞飛斧',
    desc: '拾取範圍 +70%、經驗 +20%，升級最快。開局自帶一把環繞旋轉的飛斧近身保護。',
    bodyColor: [0.5, 0.6, 0.45],
    model: 'models/zombie/survivor_shaun_armed.glb',
    apply: (s) => {
      s.pickupRadius *= 1.7;
      s.xpMultiplier *= 1.2;
      s.orbitalCount = 1;
    },
    masteryBonus: (s) => (s.orbitalCount += 1),
  },
  {
    id: 'shepherd',
    name: '德國狼犬',
    nameKey: 'character.shepherd.name',
    traitKey: 'character.shepherd.trait',
    descKey: 'character.shepherd.desc',
    emoji: '🐕',
    cost: 400,
    trait: '機動忠犬｜起始攻擊：連鎖閃電',
    desc: '移速 +15%、射程 +15%，機動風箏流。開局定期釋放連鎖閃電，自動電擊並跳躍清怪。',
    bodyColor: [0.5, 0.35, 0.2],
    model: 'models/zombie/char_shepherd.glb',
    apply: (s) => {
      s.moveSpeed *= 1.15;
      s.range *= 1.15;
      s.lightningCount = 1;
    },
    masteryBonus: (s) => (s.lightningCount += 1),
  },
  {
    id: 'pug',
    name: '巴哥犬',
    nameKey: 'character.pug.name',
    traitKey: 'character.pug.trait',
    descKey: 'character.pug.desc',
    emoji: '🐶',
    cost: 350,
    trait: '肉盾｜起始攻擊：傷害光環',
    desc: '生命 +40、移速 −10%，超耐打。身上展開傷害光環，持續灼燒貼近的殭屍，適合衝進怪堆。',
    bodyColor: [0.8, 0.7, 0.5],
    model: 'models/zombie/char_pug.glb',
    apply: (s) => {
      s.maxHp += 40;
      s.moveSpeed *= 0.9;
      s.auraRadius = 4;
    },
    masteryBonus: (s) => {
      s.auraRadius += 1.5;
      s.auraDamage += 1;
    },
  },
  {
    id: 'anne',
    name: '特勤安妮',
    nameKey: 'character.anne.name',
    traitKey: 'character.anne.trait',
    descKey: 'character.anne.desc',
    emoji: '💥',
    cost: 400,
    trait: '範圍轟炸｜起始攻擊：新星爆',
    desc: '開局即有定期向外擴張的新星爆，清群能力極強，適合站陣中央炸怪。',
    bodyColor: [0.8, 0.35, 0.4],
    model: 'models/zombie/char_anne.glb',
    apply: (s) => {
      s.novaRadius = 6;
      s.novaDamage += 2;
    },
    masteryBonus: (s) => (s.novaDamage += 2),
  },
  {
    id: 'mako',
    name: '西裝馬可',
    nameKey: 'character.mako.name',
    traitKey: 'character.mako.trait',
    descKey: 'character.mako.desc',
    emoji: '🎯',
    cost: 450,
    trait: '暴擊爆發｜起始攻擊：高暴擊',
    desc: '30% 暴擊率開局，子彈常打出 2 倍傷害，單體爆發兇猛；疊攻擊力後更可怕。',
    bodyColor: [0.4, 0.55, 0.7],
    model: 'models/zombie/char_mako.glb',
    apply: (s) => {
      s.critChance = 0.3;
      s.damage += 1;
    },
    masteryBonus: (s) => (s.critChance = Math.min(0.6, s.critChance + 0.1)),
  },
];

export function getCharacter(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
