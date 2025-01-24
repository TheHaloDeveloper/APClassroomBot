chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("collegeboard.org")) {
        if (tab.url.includes("assessments/assignments")) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: () => {
                    setTimeout(() => {
                        const element = document.getElementsByClassName("lrn_stimulus_content")[0].textContent;
                        console.log(element);
                    }, 5000);
                },
            });
        }
    }
});