import type { GlobalStats } from './leaderboard';

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

/**
 * 回報一場結算的全球累計統計（場次／時間／擊殺，fire-and-forget，離線/失敗則忽略）。
 * 排行榜已改用 VIVERSE Leaderboard（見 src/viverse/ViverseSession.ts），此處只累加 /api/stats 用的全域計數。
 */
export async function reportStats(time: number, kills: number, cheated: boolean): Promise<void> {
  try {
    await fetch(`${BASE}/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ time, kills, cheated, deviceId: deviceId() }),
    });
  } catch {
    /* 離線忽略 */
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
