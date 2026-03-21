/* ═══════════════════════════════════════
   KARMA — Boot Sequence (loaded LAST)
   ═══════════════════════════════════════ */

(function boot() {
  if (S.auth) {
    showScreen('app');
    goTo('dashboard');
  } else {
    showScreen('auth');
    renderAuth();
  }
})();
