class TokenManager {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly LAST_ACTIVITY_KEY = 'last_activity';
  private readonly TOKEN_EXPIRY_TIME = 30 * 60 * 1000;

  private activityCheckInterval: NodeJS.Timeout | null = null;
  private inactivityTimeout: NodeJS.Timeout | null = null;

  saveToken(token: string, role: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    this.updateLastActivity();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  private updateLastActivity(): void {
    const now = Date.now();
    localStorage.setItem(this.LAST_ACTIVITY_KEY, now.toString());
  }

  updateLastActivityExternal(): void {
    this.updateLastActivity();
  }

  private getLastActivity(): number {
    const lastActivity = localStorage.getItem(this.LAST_ACTIVITY_KEY);
    return lastActivity ? parseInt(lastActivity, 10) : 0;
  }

  isTokenExpired(): boolean {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) return true;
    const now = Date.now();
    return now - lastActivity > this.TOKEN_EXPIRY_TIME;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.LAST_ACTIVITY_KEY);
    this.stopActivityTracking();
  }

  startActivityTracking(): void {
    if (this.activityCheckInterval) return;

    this.activityCheckInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        this.handleSessionExpiry();
      }
    }, 60 * 1000);

    this.setupActivityListeners();
    this.resetInactivityTimeout();
  }

  stopActivityTracking(): void {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
    this.removeActivityListeners();
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, this.handleUserActivity, true);
    });
  }

  private removeActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.removeEventListener(event, this.handleUserActivity, true);
    });
  }

  private lastActivityUpdate = 0;
  private readonly ACTIVITY_UPDATE_THROTTLE = 5000;

  private handleUserActivity = (): void => {
    const now = Date.now();
    if (now - this.lastActivityUpdate > this.ACTIVITY_UPDATE_THROTTLE) {
      this.updateLastActivity();
      this.lastActivityUpdate = now;
      this.resetInactivityTimeout();
    }
  };

  private resetInactivityTimeout(): void {
    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.handleSessionExpiry();
    }, this.TOKEN_EXPIRY_TIME);
  }

  private handleSessionExpiry(): void {
    this.clearToken();
    window.dispatchEvent(new CustomEvent('session-expired'));
    window.location.href = '/signin';
  }

  setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateLastActivity();
      } else {
        if (this.isTokenExpired()) {
          this.handleSessionExpiry();
        }
      }
    });
  }

  setupBeforeUnloadListener(): void {
    window.addEventListener('beforeunload', () => {
      this.updateLastActivity();
    });
  }

  initialize(): void {
    const token = this.getToken();
    if (!token) return;
    if (this.isTokenExpired()) {
      this.handleSessionExpiry();
      return;
    }
    this.startActivityTracking();
    this.setupVisibilityListener();
    this.setupBeforeUnloadListener();
  }
}

export const tokenManager = new TokenManager();
