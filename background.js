chrome.runtime.onInstalled.addListener(() => {
  console.log('Internal Traffic Filter installed');
});

chrome.storage.sync.get(['blockedDomains'], (result) => {
  if (!result.blockedDomains) {
    chrome.storage.sync.set({ blockedDomains: [] });
  }
});
