const sessions = new Map();

export function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}





















