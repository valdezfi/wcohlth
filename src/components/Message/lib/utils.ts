export function safeId(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9_\-!]/gi, '_');
}
