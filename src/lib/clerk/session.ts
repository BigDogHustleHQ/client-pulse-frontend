const REMEMBER_KEY = 'cp_remember';
const SESSION_KEY = 'cp_session';

export const persistSession = () => {
  localStorage.setItem(REMEMBER_KEY, '1');
  sessionStorage.removeItem(SESSION_KEY);
};

export const markTemporarySession = () => {
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.setItem(SESSION_KEY, 'active');
};

export const clearSessionMarkers = () => {
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

export const isSessionAuthorized = (): boolean => {
  return (
    localStorage.getItem(REMEMBER_KEY) === '1' ||
    sessionStorage.getItem(SESSION_KEY) === 'active'
  );
};
