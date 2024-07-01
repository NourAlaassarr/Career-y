export default class EventEmitter {
  events = {};

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  }

  emit(event, payload) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        listener(payload);
      });
    }
  }
}
