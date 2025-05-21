// EventEmitter để đồng bộ hóa các sự kiện liên quan đến token

type Listener = () => void;

class TokenEventEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Trả về hàm để hủy đăng ký
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        listener => listener !== callback
      );
    };
  }

  emit(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback());
    }
  }
}

export const TOKEN_UPDATED = 'token_updated';
export const TOKEN_REMOVED = 'token_removed';
export const AUTH_STATE_CHANGED = 'auth_state_changed';

export const tokenEvents = new TokenEventEmitter();
