import type { RunRecord, GlobalStats } from './leaderboard';

/** 後端 API（Cloudflare Pages Functions，同源 /api）。全部失敗時回傳 null，由呼叫端回退本機資料。 */
const BASE = 'api';
const DEVICE_KEY = 'animal-survivors:deviceId';

function deviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export interface RunSubmit {
  name: string;
  character: string;
  time: number;
  kills: number;
  level: number;
  gold: number;
  won: boolean;
  difficulty: string;
  /** 本局是否動過 debug（後端據此標記、排除於排行榜） */
  cheated: boolean;
  /** 遊戲模式 story/deathmatch */
  mode: string;
  /** 死鬥波數 */
  wave: number;
  /** 死鬥分數 */
  score: number;
}

/** 送出一場結算（fire-and-forget，離線/失敗則忽略） */
export async function submitRun(run: RunSubmit): Promise<void> {
  try {
    await fetch(`${BASE}/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...run, deviceId: deviceId() }),
    });
  } catch {
    /* 離線忽略 */
  }
}

/**
 * 取全球排行榜。
 * - gameMode='story'：board=cleared 破關榜（最快）/survival 生存榜（最久）
 * - gameMode='deathmatch'：死鬥榜（依分數高到低，board 參數忽略）
 * 可選難度過濾；失敗回傳 null
 */
export async function fetchLeaderboard(
  limit = 10,
  difficulty?: string,
  board: 'cleared' | 'survival' = 'survival',
  gameMode: 'story' | 'deathmatch' = 'story',
): Promise<RunRecord[] | null> {
  try {
    const q = difficulty ? `&difficulty=${encodeURIComponent(difficulty)}` : '';
    const res = await fetch(`${BASE}/leaderboard?limit=${limit}&mode=${board}&gmode=${gameMode}${q}`);
    if (!res.ok) return null;
    return (await res.json()) as RunRecord[];
  } catch {
    return null;
  }
}

/** 進場記錄：標記此裝置在線並回傳目前人數/峰值（取代心跳輪詢，進場只呼叫一次）；失敗回 null */
export async function enterOnline(): Promise<{ online: number; peak: number } | null> {
  try {
    const res = await fetch(`${BASE}/online`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ deviceId: deviceId() }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { online: number; peak: number };
    return { online: data.online ?? 0, peak: data.peak ?? 0 };
  } catch {
    return null;
  }
}

/** 取目前線上遊玩人數 + 同時在線歷史最高；失敗回傳 null */
export async function fetchOnline(): Promise<{ online: number; peak: number } | null> {
  try {
    const res = await fetch(`${BASE}/online`);
    if (!res.ok) return null;
    const data = (await res.json()) as { online: number; peak: number };
    return { online: data.online ?? 0, peak: data.peak ?? 0 };
  } catch {
    return null;
  }
}

/** 取全球累計統計；失敗回傳 null */
export async function fetchStats(): Promise<GlobalStats | null> {
  try {
    const res = await fetch(`${BASE}/stats`);
    if (!res.ok) return null;
    return (await res.json()) as GlobalStats;
  } catch {
    return null;
  }
}
