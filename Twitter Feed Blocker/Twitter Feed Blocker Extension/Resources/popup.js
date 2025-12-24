// Popup script for X Feed Blocker

// Random motivational phrases
const motivationalPhrases = [
  {
    message:
      "Every minute is worth money. You're losing focus and wasting your attention on infinite distractions.",
    phrase: "I accept wasting my time",
  },
  {
    message:
      "Your attention is your most valuable asset. The infinite feed is stealing your future, one scroll at a time.",
    phrase: "I choose distraction",
  },
  {
    message:
      "While you scroll, your competitors are building. Every second on the feed is one less second on your dream.",
    phrase: "I give up on my goals",
  },
  {
    message:
      "The algorithm was designed to addict you. It's working. Do you really want to be controlled?",
    phrase: "I accept being controlled",
  },
  {
    message:
      "You have 24 hours in a day. How many will you donate to billionaires who profit from your attention?",
    phrase: "I give my time for free",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const statusBadge = document.getElementById("statusBadge");
  const statusText = document.getElementById("statusText");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalMessage = document.getElementById("modalMessage");
  const modalPhrase = document.getElementById("modalPhrase");
  const modalInput = document.getElementById("modalInput");
  const modalError = document.getElementById("modalError");
  const modalCancel = document.getElementById("modalCancel");
  const modalConfirm = document.getElementById("modalConfirm");

  let currentPhrase = null;

  // Load saved state from browser storage
  browser.storage.local
    .get("xFeedBlockerEnabled")
    .then((result) => {
      const isEnabled = result.xFeedBlockerEnabled !== false;
      updateUI(isEnabled);
    })
    .catch(() => {
      updateUI(true); // Default to enabled
    });

  // Toggle click handler
  toggle.addEventListener("click", function () {
    const isCurrentlyActive = toggle.classList.contains("active");

    if (isCurrentlyActive) {
      // Trying to disable - show confirmation modal
      showModal();
    } else {
      // Enabling - no confirmation needed
      enableBlocking();
    }
  });

  // Modal handlers
  modalCancel.addEventListener("click", hideModal);

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      hideModal();
    }
  });

  modalInput.addEventListener("input", function () {
    modalError.classList.remove("show");
  });

  modalInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      modalConfirm.click();
    }
  });

  modalConfirm.addEventListener("click", function () {
    const userInput = modalInput.value.trim();

    if (userInput === currentPhrase.phrase) {
      // Correct phrase - disable
      disableBlocking();
      hideModal();
    } else {
      // Incorrect phrase
      modalError.classList.add("show");
      modalInput.value = "";
      modalInput.focus();
    }
  });

  function showModal() {
    // Choose random phrase
    currentPhrase =
      motivationalPhrases[
        Math.floor(Math.random() * motivationalPhrases.length)
      ];

    modalMessage.textContent = currentPhrase.message;
    modalPhrase.textContent = currentPhrase.phrase;
    modalInput.value = "";
    modalError.classList.remove("show");

    modalOverlay.classList.add("show");
    setTimeout(() => modalInput.focus(), 100);
  }

  function hideModal() {
    modalOverlay.classList.remove("show");
    modalInput.value = "";
    modalError.classList.remove("show");
  }

  function enableBlocking() {
    browser.storage.local.set({ xFeedBlockerEnabled: true }).then(() => {
      updateUI(true);
      sendMessageToContentScript(true);
    });
  }

  function disableBlocking() {
    browser.storage.local.set({ xFeedBlockerEnabled: false }).then(() => {
      updateUI(false);
      sendMessageToContentScript(false);
    });
  }

  function sendMessageToContentScript(enabled) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        browser.tabs
          .sendMessage(tabs[0].id, {
            action: "toggleBlocking",
            enabled: enabled,
          })
          .catch(() => {
            // Tab might not have content script loaded, that's ok
          });
      }
    });
  }

  function updateUI(enabled) {
    if (enabled) {
      toggle.classList.add("active");
      statusBadge.classList.remove("inactive");
      statusText.textContent = "Active";
    } else {
      toggle.classList.remove("active");
      statusBadge.classList.add("inactive");
      statusText.textContent = "Inactive";
    }
  }
});
