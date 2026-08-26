import { onMounted, onUnmounted, reactive } from 'vue';
import { viverseSession, type ViverseState, type LeaderboardRow } from './ViverseSession';

export function useViverse() {
  const state = reactive<ViverseState>({ status: 'unavailable', message: 'Available on VIVERSE.', user: null });

  let unsubscribe: (() => void) | null = null;
  onMounted(() => {
    unsubscribe = viverseSession.subscribe((next) => {
      state.status = next.status;
      state.message = next.message;
      state.user = next.user;
    });
    void viverseSession.initialize();
  });
  onUnmounted(() => unsubscribe?.());

  function connect() {
    void viverseSession.connect();
  }
  function logout() {
    void viverseSession.logout();
  }
  /** 尚未登入時會記下待辦動作並導轉登入（回傳 null）；已登入則直接送出分數 */
  function ensureLoginAndSubmit(leaderboardName: string, value: number, pendingPayload: Record<string, unknown>): Promise<boolean | null> {
    return viverseSession.ensureLogin(pendingPayload).then((user) => {
      if (!user) return null;
      return viverseSession.submitScore(leaderboardName, value);
    });
  }
  function fetchLeaderboard(leaderboardName: string, limit?: number): Promise<LeaderboardRow[]> {
    return viverseSession.fetchLeaderboard(leaderboardName, limit);
  }
  function resumePending(): Promise<Record<string, unknown> | null> {
    return viverseSession.resumePending();
  }
  function submitScore(leaderboardName: string, value: number): Promise<boolean> {
    return viverseSession.submitScore(leaderboardName, value);
  }

  return { state, connect, logout, ensureLoginAndSubmit, fetchLeaderboard, resumePending, submitScore };
}
