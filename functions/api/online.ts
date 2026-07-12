import { type FnContext, type Env, json, sanitizeText } from './_lib';

/** 線上人數 = 近 3 小時內「進場」過的 distinct 裝置數（取代心跳輪詢，大幅降低 Functions 請求數） */
const WINDOW = 3 * 60 * 60 * 1000; // 3 小時

async function activeCount(env: Env, since: number): Promise<number> {
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM presence WHERE last_seen > ?')
    .bind(since)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

async function currentPeak(env: Env): Promise<number> {
  const r = await env.DB.prepare('SELECT peak_online FROM stats WHERE id = 1').first<{ peak_online: number }>();
  return r?.peak_online ?? 0;
}

/** 機會性維護（約 1/8 次）：更新峰值、每小時時序、清除過期 presence(>3h)，降低 D1 寫入 */
async function maintain(env: Env, now: number, n: number): Promise<void> {
  if (Math.random() >= 0.13) return;
  await env.DB.prepare('UPDATE stats SET peak_online = ?, peak_online_at = ? WHERE id = 1 AND peak_online < ?')
    .bind(n, now, n)
    .run();
  const hour = Math.floor(now / 3600000);
  await env.DB.prepare(
    'INSERT INTO online_hourly (hour, peak) VALUES (?, ?) ON CONFLICT(hour) DO UPDATE SET peak = MAX(peak, excluded.peak)',
  )
    .bind(hour, n)
    .run();
  await env.DB.prepare('DELETE FROM presence WHERE last_seen < ?').bind(now - WINDOW).run();
}

/** POST /api/online — 進場：記錄此裝置（依 deviceId upsert）+ 回傳近 3 小時人數與峰值 */
export const onRequestPost = async ({ request, env }: FnContext): Promise<Response> => {
  try {
    const body = (await request.json().catch(() => ({}))) as { deviceId?: string };
    const id = sanitizeText(body.deviceId, 64);
    const now = Date.now();
    if (id) {
      await env.DB.prepare(
        'INSERT INTO presence (device_id, last_seen) VALUES (?, ?) ON CONFLICT(device_id) DO UPDATE SET last_seen = ?',
      )
        .bind(id, now, now)
        .run();
    }
    const n = await activeCount(env, now - WINDOW);
    await maintain(env, now, n);
    return json({ online: n, peak: Math.max(n, await currentPeak(env)) });
  } catch {
    return json({ online: 0, peak: 0 });
  }
};

/** GET /api/online — 只讀近 3 小時人數 + 峰值（開視窗時用，不記錄進場） */
export const onRequestGet = async ({ env }: FnContext): Promise<Response> => {
  try {
    const now = Date.now();
    const n = await activeCount(env, now - WINDOW);
    await maintain(env, now, n);
    return json({ online: n, peak: Math.max(n, await currentPeak(env)) });
  } catch {
    return json({ online: 0, peak: 0 });
  }
};
