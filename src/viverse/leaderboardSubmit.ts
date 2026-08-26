import type { GameStats } from '../game/game';

/** VIVERSE Studio 中對應的 API name（可用 .env 覆寫；預設值即目前 Studio 已建立的名稱） */
export const LEADERBOARD_CLEARED = (import.meta.env.VITE_VIVERSE_LEADERBOARD_CLEARED as string) || 'clearedtime';
export const LEADERBOARD_SURVIVAL = (import.meta.env.VITE_VIVERSE_LEADERBOARD_SURVIVAL as string) || 'survivaltime';
export const LEADERBOARD_DEATHMATCH = (import.meta.env.VITE_VIVERSE_LEADERBOARD_DEATHMATCH as string) || 'deathmatchscore';

/**
 * 依模式／勝負決定要送到哪個 VIVERSE 排行榜、送出的數值（整數）。
 * 死鬥模式一律送死鬥榜（分數，與 game-over-modal 的 deathScore 公式一致）；
 * 劇情模式依 won 分流：破關送「破關榜」（時間，Studio 端設定為 Ascending）、
 * 未破關送「生存榜」（時間，Studio 端設定為 Descending）。
 */
export function pickLeaderboard(stats: GameStats, won: boolean): { name: string; value: number } {
  if (stats.mode === 'deathmatch') {
    return { name: LEADERBOARD_DEATHMATCH, value: Math.round(stats.wave * 1000 + stats.kills + stats.time) };
  }
  return { name: won ? LEADERBOARD_CLEARED : LEADERBOARD_SURVIVAL, value: Math.round(stats.time) };
}
