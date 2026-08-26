import { type FnContext, json, clampNum, clampInt } from './_lib';

/**
 * POST /api/run — 送出一場結算，累加全球統計（累計場次／時間／擊殺）。
 * 排行榜已改用 VIVERSE Leaderboard（見 src/viverse/ViverseSession.ts），此端點不再寫入名次相關資料。
 */
export const onRequestPost = async ({ request, env }: FnContext): Promise<Response> => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  /** 合理性驗證（純前端數值可偽造，這裡做基本上限過濾） */
  const time = clampNum(body.time, 0, 3600);
  const kills = clampInt(body.kills, 0, Math.ceil(time * 25) + 50);
  /** 本局是否動過 debug（前端回報）；標記後不累加統計 */
  const cheated = body.cheated ? 1 : 0;

  try {
    /** 作弊局不累加全球統計（避免 EXP×10／無敵 farm 灌水） */
    if (!cheated) {
      await env.DB
        .prepare('UPDATE stats SET plays=plays+1, total_time=total_time+?, total_kills=total_kills+? WHERE id=1')
        .bind(time, kills)
        .run();
    }
  } catch {
    return json({ error: 'db error' }, 500);
  }

  return json({ ok: true });
};
