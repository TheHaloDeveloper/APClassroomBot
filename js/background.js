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

                        prompt = `
                        You will be given a question below, along with multiple choice answers. Your job is to output one singular letter, for the correct answer. 
                        ######
                        QUESTION:
                        ${question}
                        ####
                        ANSWERS:
                        ${answers.join("\n")}
                        `;

                        fetch('http://localhost:5000/api', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({prompt: prompt})
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.res);
                        });
                    }, 5000);
                },
            });
        }
    }
});