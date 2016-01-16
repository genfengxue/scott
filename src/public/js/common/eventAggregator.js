const events = {};

export default {
  on: (event, handler) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(handler);
  },
  off: (event, handler) => {
    if (!events[event]) {
      return;
    }
    events[event].splice(events[event].indexOf(handler), 1);
  },
  clear: (event) => {
    events[event] = [];
  },
  emit: (event, payload) => {
    if (!event) {
      return;
    }
    if (events[event] && events[event].length) {
      events[event].forEach((handler) => {
        handler(payload);
      });
    }
  },
  events,
};
