const REMEMBER_KEY = 'cp_remember';
const SESSION_KEY = 'cp_session';

export function persistSession() {
  localStorage.setItem(REMEMBER_KEY, '1');
  sessionStorage.removeItem(SESSION_KEY);
}

export function markTemporarySession() {
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.setItem(SESSION_KEY, 'active');
}

export function clearSessionMarkers() {
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function isSessionAuthorized(): boolean {
  return (
    localStorage.getItem(REMEMBER_KEY) === '1' ||
    sessionStorage.getItem(SESSION_KEY) === 'active'
  );
}
