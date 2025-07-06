chrome.tabs.onUpdated.addListener((tabId, changedInfo, tab) => {
    if (changedInfo.url && /^https?:\/\/(?:www\.)?youtube\.com\//.test(changedInfo.url)){
        // Check if the content script has been injected by using chrome storage
        chrome.storage.local.get([`hasInjected_${tabId}`], (result) => {
            if (!result[`hasInjected_${tabId}`]) {
                // Set a flag in storage to indicate the script has been injected
                chrome.storage.local.set({ [`hasInjected_${tabId}`]: true }, () => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ["content.js", "adSkipper.js"]
                    });
                });
            }
        });
    }
});
