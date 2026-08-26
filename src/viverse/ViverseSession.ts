/**
 * VIVERSE session: auth (ported from graviflip/src/viverse/ViverseSession.js) + global leaderboard
 * (ported from puzzle_game/src/viverse/ViverseSession.js, see its viverse-leaderboard skill for the
 * gameDashboard contract/gotchas). Additive: never blocks gameplay when VIVERSE is unavailable —
 * the local-device leaderboard (src/game/leaderboard.ts) is always the fallback.
 */

const VERSION_NAME = 'zombie-survivors-viverse-session-1';
const AUTH_DOMAIN = 'account.htcvive.com';
const HANDSHAKE_DELAY_MS = 1200;
const AUTH_RETRY_COUNT = 3;
const AUTH_RETRY_DELAY_MS = 1000;
const DASHBOARD_BASE_URL = 'https://www.viveport.com/';
const DASHBOARD_COMMUNITY_BASE_URL = 'https://www.viverse.com/';
const PENDING_KEY = 'zombie-survivors:viversePending';

export type ViverseStatus = 'unavailable' | 'logged_out' | 'logging_in' | 'logged_in' | 'error';

export interface ViverseUser {
  accessToken: string;
  displayName: string;
}

export interface ViverseState {
  status: ViverseStatus;
  message: string;
  user: ViverseUser | null;
}

type Listener = (state: ViverseState) => void;

interface ViverseClient {
  checkAuth(): Promise<{ access_token?: string } | null>;
  loginWithWorlds(options: { state?: string }): Promise<void>;
  logout?(): Promise<void>;
  getUserInfo?(): Promise<Record<string, unknown>>;
  getUser?(): Promise<Record<string, unknown>>;
  getProfileByToken?(token: string): Promise<Record<string, unknown>>;
}

interface LeaderboardQuery {
  name: string;
  range_start: number;
  range_end: number;
  region: 'global' | 'local';
  time_range: 'alltime';
  around_user: boolean;
}

export interface LeaderboardRow {
  /** 1-based 名次（API 回傳 0-based，這裡已 +1） */
  rank: number;
  name: string;
  value: number;
}

interface DashboardClient {
  uploadLeaderboardScore(appId: string, entries: { name: string; value: number }[]): Promise<unknown>;
  getLeaderboard(appId: string, config: LeaderboardQuery): Promise<unknown>;
  getGuestLeaderboard?(appId: string, config: LeaderboardQuery): Promise<unknown>;
}

interface ViverseSdk {
  client: (new (options: { clientId: string; domain: string }) => ViverseClient) | ViverseClient;
  avatar?: new (options: {
    baseURL: string;
    accessToken: string;
    token: string;
    authorization: string;
    appId: string;
    clientId: string;
  }) => { getProfile(): Promise<Record<string, unknown>> };
  gameDashboard?: new (options: { token: string; clientId: string; baseURL: string; communityBaseURL: string }) => DashboardClient;
  GameDashboard?: new (options: { token: string; clientId: string; baseURL: string; communityBaseURL: string }) => DashboardClient;
}

/** VIVERSE leaderboard API 回傳形狀不一，逐一嘗試已知欄位 */
function extractRows(res: unknown): Array<Record<string, unknown>> {
  const r = res as Record<string, unknown> | null | undefined;
  const d = r?.data as Record<string, unknown> | undefined;
  const lb = r?.leaderboard as Record<string, unknown> | undefined;
  const rows =
    r?.rankings ?? r?.ranking ?? r?.leaderboard_rankings ?? d?.rankings ?? d?.ranking ?? lb?.rankings ?? lb?.ranking;
  return Array.isArray(rows) ? (rows as Array<Record<string, unknown>>) : [];
}

/** rank 為 0-based；顯示需 +1，且只有欄位缺席時才退回 index（rank=0 是合法的「#1」，不可用 || 判斷） */
function normalizeRows(rows: Array<Record<string, unknown>>): LeaderboardRow[] {
  return rows.map((row, index) => ({
    rank: typeof row.rank === 'number' ? row.rank + 1 : index + 1,
    name: (row.name as string) ?? (row.displayName as string) ?? (row.nickname as string) ?? '',
    value: typeof row.value === 'number' ? row.value : Number(row.value) || 0,
  }));
}

async function queryRankings(
  fetchPage: (config: LeaderboardQuery) => Promise<unknown>,
  leaderboardName: string,
  limit: number,
): Promise<LeaderboardRow[]> {
  const configs: LeaderboardQuery[] = [
    { name: leaderboardName, range_start: 0, range_end: limit - 1, region: 'global', time_range: 'alltime', around_user: false },
    { name: leaderboardName, range_start: 0, range_end: limit - 1, region: 'global', time_range: 'alltime', around_user: true },
    { name: leaderboardName, range_start: 0, range_end: limit - 1, region: 'local', time_range: 'alltime', around_user: false },
  ];
  for (const config of configs) {
    try {
      const rows = extractRows(await fetchPage(config));
      if (rows.length > 0) return normalizeRows(rows);
    } catch {
      /* 換下一組設定 */
    }
  }
  return [];
}

function readPending(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
function writePending(payload: Record<string, unknown>) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    /* 忽略寫入失敗 */
  }
}
function clearPending() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* 忽略 */
  }
}

declare global {
  interface Window {
    viverse?: ViverseSdk;
    VIVERSE_SDK?: ViverseSdk;
    vSdk?: ViverseSdk;
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class ViverseSession {
  private listeners = new Set<Listener>();
  private sdk: ViverseSdk | null = null;
  private client: ViverseClient | null = null;
  private appId = '';
  private bootstrapPromise: Promise<ViverseState> | null = null;
  private state: ViverseState = { status: 'unavailable', message: 'Available on VIVERSE.', user: null };

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private setState(status: ViverseStatus, message: string, user: ViverseUser | null = null) {
    this.state = { status, message, user };
    for (const listener of this.listeners) listener(this.state);
  }

  private getSdk(): ViverseSdk | null {
    return window.viverse || window.VIVERSE_SDK || window.vSdk || null;
  }

  private resolveAppId(): string {
    const configured = import.meta.env.VITE_VIVERSE_CLIENT_ID as string | undefined;
    if (configured && configured !== 'YOUR_APP_ID') return configured;
    const match = window.location.hostname.match(/^([a-z0-9]+)(?:-preview)?\.world\.viverse\.app$/);
    return match ? match[1] : '';
  }

  async initialize(): Promise<ViverseState> {
    if (this.bootstrapPromise) return this.bootstrapPromise;
    this.bootstrapPromise = this.bootstrap();
    return this.bootstrapPromise;
  }

  private async bootstrap(): Promise<ViverseState> {
    console.info(`[VIVERSE] ${VERSION_NAME}`);
    this.sdk = this.getSdk();
    this.appId = this.resolveAppId();
    if (!this.sdk || !this.appId) {
      this.setState('unavailable', 'Available on VIVERSE.');
      return this.state;
    }
    try {
      if (typeof this.sdk.client === 'function') {
        const ClientCtor = this.sdk.client as new (options: { clientId: string; domain: string }) => ViverseClient;
        this.client = new ClientCtor({ clientId: this.appId, domain: AUTH_DOMAIN });
      } else if (this.sdk.client) {
        this.client = this.sdk.client as ViverseClient;
      } else {
        this.setState('error', 'VIVERSE authentication is unavailable.');
        return this.state;
      }
      await delay(HANDSHAKE_DELAY_MS);
      const auth = await this.checkAuth();
      if (!auth?.access_token) {
        this.setState('logged_out', 'Connect VIVERSE to sign in.');
        return this.state;
      }
      const user = await this.loadProfile(auth.access_token);
      this.setState('logged_in', `Connected as ${user.displayName}.`, user);
    } catch (error) {
      console.warn('[VIVERSE] Auth bootstrap failed.', error);
      this.setState('error', 'VIVERSE connection failed. You can still play.');
    }
    return this.state;
  }

  private async checkAuth(): Promise<{ access_token?: string } | null> {
    let auth: { access_token?: string } | null = null;
    for (let attempt = 0; attempt < AUTH_RETRY_COUNT; attempt += 1) {
      auth = (await this.client!.checkAuth()) ?? null;
      if (auth?.access_token) return auth;
      if (attempt < AUTH_RETRY_COUNT - 1) await delay(AUTH_RETRY_DELAY_MS);
    }
    return auth;
  }

  private async loadProfile(token: string): Promise<ViverseUser> {
    let profile: Record<string, unknown> | null = null;
    const merge = (value: unknown) => {
      if (value && typeof value === 'object') profile = profile ? { ...profile, ...(value as object) } : (value as Record<string, unknown>);
    };
    const hasIdentity = () =>
      Boolean(
        profile &&
          ((profile as Record<string, unknown>).name ||
            (profile as Record<string, unknown>).displayName ||
            (profile as Record<string, unknown>).display_name ||
            (profile as Record<string, unknown>).nickName ||
            (profile as Record<string, unknown>).nickname ||
            (profile as Record<string, unknown>).userName ||
            (profile as Record<string, unknown>).email),
      );
    try {
      if (this.sdk?.avatar) {
        const avatar = new this.sdk.avatar({
          baseURL: 'https://sdk-api.viverse.com/',
          accessToken: token,
          token,
          authorization: token,
          appId: this.appId,
          clientId: this.appId,
        });
        merge(await avatar.getProfile());
      }
      if (!hasIdentity() && this.client?.getUserInfo) merge(await this.client.getUserInfo());
      if (!hasIdentity() && this.client?.getUser) merge(await this.client.getUser());
      if (!hasIdentity() && this.client?.getProfileByToken) merge(await this.client.getProfileByToken(token));
      if (!hasIdentity()) {
        const response = await fetch('https://account-profile.htcvive.com/SS/Profiles/v3/Me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) merge(await response.json());
      }
    } catch (error) {
      console.warn('[VIVERSE] Profile enrichment failed.', error);
    }
    const p = (profile ?? {}) as Record<string, unknown>;
    const displayName =
      (p.displayName as string) ||
      (p.display_name as string) ||
      (p.name as string) ||
      (p.nickName as string) ||
      (p.nickname as string) ||
      (p.userName as string) ||
      (p.email as string) ||
      'VIVERSE Player';
    return { accessToken: token, displayName };
  }

  async connect(): Promise<ViverseState> {
    await this.initialize();
    if (this.state.status === 'unavailable' || this.state.status === 'error' || this.state.status === 'logged_in') return this.state;
    try {
      this.setState('logging_in', 'Opening VIVERSE login...');
      await this.client!.loginWithWorlds({ state: 'zombie-survivors' });
    } catch (error) {
      console.warn('[VIVERSE] Login failed.', error);
      this.setState('error', 'VIVERSE login failed. You can still play.');
    }
    return this.state;
  }

  async logout(): Promise<ViverseState> {
    try {
      await this.client?.logout?.();
    } catch (error) {
      console.warn('[VIVERSE] Logout failed.', error);
    }
    this.setState('logged_out', 'Connect VIVERSE to sign in.');
    return this.state;
  }

  /** 已登入才能取得 dashboard client（上傳分數必須用有 token 的版本；訪客讀取見 fetchLeaderboard 的 guest 分支） */
  private async getDashboardClient(): Promise<DashboardClient | null> {
    await this.initialize();
    const token = this.state.user?.accessToken;
    if (!this.sdk || !token) return null;
    const DashboardClass = this.sdk.gameDashboard ?? this.sdk.GameDashboard;
    if (!DashboardClass) return null;
    return new DashboardClass({
      token,
      clientId: this.appId,
      baseURL: DASHBOARD_BASE_URL,
      communityBaseURL: DASHBOARD_COMMUNITY_BASE_URL,
    });
  }

  /** 上傳一筆分數；需已登入，訪客會直接失敗回傳 false */
  async submitScore(leaderboardName: string, value: number): Promise<boolean> {
    if (!leaderboardName) return false;
    const dashboard = await this.getDashboardClient();
    if (!dashboard) return false;
    try {
      await dashboard.uploadLeaderboardScore(this.appId, [{ name: leaderboardName, value }]);
      return true;
    } catch (error) {
      console.warn('[VIVERSE] Leaderboard submission failed.', error);
      return false;
    }
  }

  /** 讀取排行榜；已登入優先用個人化查詢，否則（或查無資料）退回訪客讀取 */
  async fetchLeaderboard(leaderboardName: string, limit = 10): Promise<LeaderboardRow[]> {
    if (!leaderboardName) return [];
    const dashboard = await this.getDashboardClient();
    if (dashboard) {
      const rows = await queryRankings((config) => dashboard.getLeaderboard(this.appId, config), leaderboardName, limit);
      if (rows.length > 0) return rows;
    }
    return this.fetchLeaderboardAsGuest(leaderboardName, limit);
  }

  /** 不需登入的排行榜讀取（供未連結 VIVERSE 帳號的玩家瀏覽） */
  private async fetchLeaderboardAsGuest(leaderboardName: string, limit = 10): Promise<LeaderboardRow[]> {
    await this.initialize();
    if (!this.sdk) return [];
    const DashboardClass = this.sdk.gameDashboard ?? this.sdk.GameDashboard;
    if (!DashboardClass) return [];
    try {
      const dashboard = new DashboardClass({
        token: '',
        clientId: this.appId,
        baseURL: DASHBOARD_BASE_URL,
        communityBaseURL: DASHBOARD_COMMUNITY_BASE_URL,
      });
      if (typeof dashboard.getGuestLeaderboard === 'function') {
        return await queryRankings((config) => dashboard.getGuestLeaderboard!(this.appId, config), leaderboardName, limit);
      }
    } catch (error) {
      console.warn('[VIVERSE] Guest leaderboard read failed.', error);
    }
    return [];
  }

  /** 尚未登入時：記下待辦動作並觸發登入導轉；已登入則直接回傳目前使用者 */
  async ensureLogin(pendingPayload?: Record<string, unknown>): Promise<ViverseUser | null> {
    await this.initialize();
    if (this.state.status === 'logged_in' && this.state.user) return this.state.user;
    if (pendingPayload) writePending(pendingPayload);
    await this.connect();
    return null;
  }

  /**
   * App 開機時呼叫一次：若上次因登入導轉而暫存了待辦動作，且此刻已成功登入，回傳該筆待辦供呼叫端續做
   * （例如重新送出排行榜分數），否則回傳 null。無論登入是否成功都會清掉暫存，不會重試第二次。
   */
  async resumePending(): Promise<Record<string, unknown> | null> {
    const pending = readPending();
    if (!pending) return null;
    clearPending();
    await this.initialize();
    if (this.state.status !== 'logged_in') return null;
    return pending;
  }
}

export const viverseSession = new ViverseSession();
