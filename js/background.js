chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("collegeboard.org")) {
        if (tab.url.includes("assessments/assignments")) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: () => {
                    let all = "ABCDE";

                    setTimeout(() => {
                        let question = document.getElementsByClassName("lrn_stimulus_content")[0].textContent;
                        let answers = [];

                        for (let answer of document.getElementsByClassName("lrn_mcqgroup")[0].children) {
                            let text = answer.children[1].children[0].children[0].children[0].children[0].children[0].children[0].textContent;
                            answers.push(`${all[answers.length]}. ${text}`);
                        }

                        console.log(question);
                        console.log(answers);
                    }, 5000);
                },
            });
        }
    }
});