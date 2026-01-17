let currentDomain = '';

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

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

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    const origin = urlObj.origin;
    if (!isValidWebOrigin(origin)) {
      return null;
    }
    return origin;
  } catch (e) {
    return null;
  }
}

async function getBlockedDomains() {
  const result = await chrome.storage.sync.get(['blockedDomains']);
  const domains = result.blockedDomains || [];
  return domains.filter(isValidWebOrigin);
}

async function saveBlockedDomains(domains) {
  await chrome.storage.sync.set({ blockedDomains: domains });
}

async function updateBlockedList() {
  const blockedDomains = await getBlockedDomains();
  const blockedList = document.getElementById('blockedList');
  blockedList.textContent = '';

  if (blockedDomains.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-message';
    emptyMsg.textContent = 'No blocked sites yet';
    blockedList.appendChild(emptyMsg);
    return;
  }

  blockedDomains.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'blocked-item';

    const domainSpan = document.createElement('span');
    domainSpan.className = 'blocked-domain';
    domainSpan.textContent = domain;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeDomain(domain));

    item.appendChild(domainSpan);
    item.appendChild(removeBtn);
    blockedList.appendChild(item);
  });
}

async function removeDomain(domain) {
  let blockedDomains = await getBlockedDomains();
  blockedDomains = blockedDomains.filter(d => d !== domain);
  await saveBlockedDomains(blockedDomains);

  if (domain === currentDomain) {
    const tab = await getCurrentTab();
    await chrome.tabs.sendMessage(tab.id, { action: 'enableTracking' });
    updateToggleButton(blockedDomains);
  }

  await updateBlockedList();
  showStatus('Tracking enabled for ' + domain, 'success');
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status show ${type}`;

  setTimeout(() => {
    status.classList.remove('show');
  }, 3000);
}

function updateToggleButton(blockedDomains) {
  const isBlocked = blockedDomains.includes(currentDomain);
  const toggleBtn = document.getElementById('toggleBtn');

  if (isBlocked) {
    toggleBtn.textContent = 'Enable Tracking';
    toggleBtn.className = 'btn btn-enable';
  } else {
    toggleBtn.textContent = 'Disable Tracking';
    toggleBtn.className = 'btn btn-disable';
  }
}

async function toggleTracking() {
  const tab = await getCurrentTab();
  let blockedDomains = await getBlockedDomains();
  const isBlocked = blockedDomains.includes(currentDomain);

  try {
    if (isBlocked) {
      await chrome.tabs.sendMessage(tab.id, { action: 'enableTracking' });
      blockedDomains = blockedDomains.filter(d => d !== currentDomain);
      await saveBlockedDomains(blockedDomains);
      showStatus('Tracking enabled for this site', 'success');
    } else {
      await chrome.tabs.sendMessage(tab.id, { action: 'disableTracking' });
      blockedDomains.push(currentDomain);
      await saveBlockedDomains(blockedDomains);
      showStatus('Tracking disabled for this site', 'success');
    }

    updateToggleButton(blockedDomains);
    await updateBlockedList();
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const tab = await getCurrentTab();
  currentDomain = extractDomain(tab.url);
  const blockedDomains = await getBlockedDomains();

  if (!currentDomain) {
    document.getElementById('currentDomain').textContent = 'Invalid URL';
    document.getElementById('toggleBtn').disabled = true;
  } else {
    document.getElementById('currentDomain').textContent = currentDomain;
    document.getElementById('toggleBtn').addEventListener('click', toggleTracking);
    updateToggleButton(blockedDomains);
  }

  await updateBlockedList();
});
