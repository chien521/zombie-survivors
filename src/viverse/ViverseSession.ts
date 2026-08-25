/**
 * Auth-only VIVERSE session (no leaderboard) — ported from graviflip/src/viverse/ViverseSession.js.
 * Additive: never blocks the existing anonymous D1 leaderboard/gameplay flow when VIVERSE is unavailable.
 */

const VERSION_NAME = 'zombie-survivors-viverse-session-1';
const AUTH_DOMAIN = 'account.htcvive.com';
const HANDSHAKE_DELAY_MS = 1200;
const AUTH_RETRY_COUNT = 3;
const AUTH_RETRY_DELAY_MS = 1000;

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
}

export const viverseSession = new ViverseSession();
