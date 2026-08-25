import { onMounted, onUnmounted, reactive } from 'vue';
import { viverseSession, type ViverseState } from './ViverseSession';

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

  return { state, connect, logout };
}
