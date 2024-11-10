// Add any global setup for Jest tests
// For example, setting up mock implementations or global configurations

// Polyfill for ResizeObserver if not available in the test environment
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.elements = new Set();
    }

    observe(target) {
      this.elements.add(target);
      this.callback([{ target }], this);
    }

    unobserve(target) {
      this.elements.delete(target);
    }

    disconnect() {
      this.elements.clear();
    }
  };
}
