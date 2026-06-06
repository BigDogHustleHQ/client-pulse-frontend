import {
  persistSession,
  markTemporarySession,
  clearSessionMarkers,
  isSessionAuthorized,
} from './session';

describe('session markers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('persistSession', () => {
    it('sets the remember flag in localStorage', () => {
      persistSession();
      expect(localStorage.getItem('cp_remember')).toBe('1');
    });

    it('removes any temporary session flag', () => {
      sessionStorage.setItem('cp_session', 'active');
      persistSession();
      expect(sessionStorage.getItem('cp_session')).toBeNull();
    });
  });

  describe('markTemporarySession', () => {
    it('sets the session flag in sessionStorage', () => {
      markTemporarySession();
      expect(sessionStorage.getItem('cp_session')).toBe('active');
    });

    it('removes the remember flag from localStorage', () => {
      localStorage.setItem('cp_remember', '1');
      markTemporarySession();
      expect(localStorage.getItem('cp_remember')).toBeNull();
    });
  });

  describe('clearSessionMarkers', () => {
    it('removes both flags', () => {
      localStorage.setItem('cp_remember', '1');
      sessionStorage.setItem('cp_session', 'active');
      clearSessionMarkers();
      expect(localStorage.getItem('cp_remember')).toBeNull();
      expect(sessionStorage.getItem('cp_session')).toBeNull();
    });
  });

  describe('isSessionAuthorized', () => {
    it('returns false when no markers are set', () => {
      expect(isSessionAuthorized()).toBe(false);
    });

    it('returns true when localStorage remember flag is set', () => {
      localStorage.setItem('cp_remember', '1');
      expect(isSessionAuthorized()).toBe(true);
    });

    it('returns true when sessionStorage session flag is set', () => {
      sessionStorage.setItem('cp_session', 'active');
      expect(isSessionAuthorized()).toBe(true);
    });
  });
});
