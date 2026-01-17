function isValidWebOrigin(origin) {
  try {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }
    if (url.origin !== origin || origin === 'null') {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function getBlockedDomains() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['blockedDomains'], (result) => {
      const domains = result.blockedDomains || [];
      resolve(domains.filter(isValidWebOrigin));
    });
  });
}

function getCurrentDomain() {
  return window.location.origin;
}

async function checkAndDisableTracking() {
  const blockedDomains = await getBlockedDomains();
  const currentDomain = getCurrentDomain();

  if (blockedDomains.includes(currentDomain)) {
    localStorage.setItem('umami.disabled', '1');
    localStorage.setItem('datafast_ignore', 'true');
    console.log('Analytics tracking disabled for:', currentDomain);
  }
}

checkAndDisableTracking();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'disableTracking') {
    localStorage.setItem('umami.disabled', '1');
    localStorage.setItem('datafast_ignore', 'true');
    console.log('Analytics tracking disabled');
    sendResponse({ success: true });
  } else if (request.action === 'enableTracking') {
    localStorage.removeItem('umami.disabled');
    localStorage.removeItem('datafast_ignore');
    console.log('Analytics tracking enabled');
    sendResponse({ success: true });
  }
  return true;
});
