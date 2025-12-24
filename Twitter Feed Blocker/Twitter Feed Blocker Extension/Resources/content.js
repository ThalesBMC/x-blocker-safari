// X Feed Blocker - Content Script
// Only blocks the HOME feed, not notifications, messages, explore, or profiles

(function() {
  'use strict';

  let isEnabled = true;
  let styleElement = null;
  let messageInjected = false;

  // Message displayed instead of the feed
  const blockedMessage = `
    <div class="feed-blocked-message">
      <div class="emoji">🛡️</div>
      <h2>Feed Blocked</h2>
      <p>The X home feed is hidden to boost your productivity. You can still use search, notifications, messages, and view profiles.</p>
    </div>
  `;

  // Load saved state from browser storage
  function loadState() {
    if (typeof browser !== 'undefined' && browser.storage) {
      browser.storage.local.get('xFeedBlockerEnabled').then((result) => {
        isEnabled = result.xFeedBlockerEnabled !== false;
        applyState();
      }).catch(() => {
        isEnabled = true;
        applyState();
      });
    } else {
      // Fallback
      isEnabled = true;
      applyState();
    }
  }

  // Listen for messages from popup
  if (typeof browser !== 'undefined' && browser.runtime) {
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === 'toggleBlocking') {
        isEnabled = message.enabled;
        applyState();
      }
      if (message.action === 'getState') {
        return Promise.resolve({ enabled: isEnabled });
      }
    });
  }

  function applyState() {
    if (isEnabled && isHomePage()) {
      hideTimeline();
    } else {
      showTimeline();
    }
  }

  function showTimeline() {
    // Remove hiding styles
    if (styleElement) {
      styleElement.remove();
      styleElement = null;
    }

    // Remove blocked message
    const msg = document.querySelector('.feed-blocked-message');
    if (msg) msg.remove();
    messageInjected = false;

    console.log('🛡️ X Feed Blocker: Feed visible');
  }

  function hideTimeline() {
    if (!isEnabled || !isHomePage()) {
      showTimeline();
      return;
    }

    // Inject CSS to hide only home feed elements
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'x-feed-blocker-style';
      styleElement.textContent = `
        /* Only hide on home page - timeline content */
        [data-testid="primaryColumn"] section[role="region"] > div > div {
          display: none !important;
        }
        
        /* Hide the timeline tabs content area */
        [data-testid="primaryColumn"] [data-testid="cellInnerDiv"] {
          display: none !important;
        }
        
        /* Keep the header visible */
        [data-testid="primaryColumn"] > div > div:first-child {
          display: block !important;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Inject blocked message
    if (!messageInjected) {
      const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
      if (primaryColumn && !primaryColumn.querySelector('.feed-blocked-message')) {
        const section = primaryColumn.querySelector('section[role="region"]');
        if (section) {
          const messageDiv = document.createElement('div');
          messageDiv.innerHTML = blockedMessage;
          section.parentElement.insertBefore(messageDiv, section);
          messageInjected = true;
        }
      }
    }

    console.log('🛡️ X Feed Blocker: Feed hidden');
  }

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/home' || path === '/' || path === '';
  }

  // Initial load
  loadState();

  // Observer for dynamic changes (X is a SPA)
  const observer = new MutationObserver(() => {
    if (isEnabled && isHomePage()) {
      hideTimeline();
    }
  });

  // Start observer when DOM is ready
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.body) {
    startObserver();
  } else {
    document.addEventListener('DOMContentLoaded', startObserver);
  }

  // Re-run on navigation (X uses History API)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      messageInjected = false;
      applyState();
    }
  }).observe(document, { subtree: true, childList: true });

})();
