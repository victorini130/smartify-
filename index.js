// index.js - Main initialization and entry point
// This file loads all modules and starts the application

(function() {
  'use strict';

  const enhanceLoginScreen = () => {
    if (document.getElementById('modern-smartschool-login-shell')) return;

    const form = document.querySelector('form');
    if (!form) return;

    const passwordInput = form.querySelector('input[type="password"]');
    const emailInput = form.querySelector('input[type="email"], input[type="text"], input[name*="mail" i], input[name*="user" i]');
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"], button');
    const likelyLoginPage = /login|inlog|signin|auth/i.test(location.pathname + location.search + location.hash) ||
      !!(passwordInput && (emailInput || form.querySelector('input[name*="user" i]')));

    if (!form || !passwordInput || !emailInput || !submitButton || !likelyLoginPage) return;

    document.body.style.background = '#f1f5f9';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.display = 'block';
    document.body.style.padding = '0';
  };

  // Initialize the application
  const tryBuild = () => {
    if (document.getElementById('modern-custom-layout')) return;
    let attempts = 0;
    const poll = () => {
      const nav = document.querySelector('#left,#menu,#navigatie,td.left,div.left,nav,#sidebar,#hoofdmenu');
      if (nav || attempts++ > 10) Layout.buildLayout(); 
      else setTimeout(poll, 500);
    };
    poll();
  };

  const start = () => {
    Utils.uS();
    enhanceLoginScreen();
    tryBuild();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { 
      start();
    });
  } else { 
    start();
  }

  const observer = new MutationObserver(() => {
    enhanceLoginScreen();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
