export function formatHistory(history) {
  return history
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
}
