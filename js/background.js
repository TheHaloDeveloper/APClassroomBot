chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("collegeboard.org")) {
        if (tab.url.includes("assessments/assignments")) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: call
            });
        }
    }
});

function call() {
    document.addEventListener('keydown', function(event) {
        if (event.key === '`') {
            let all = "ABCDE";
            let question = document.getElementsByClassName("lrn_stimulus_content")[0].textContent;
            let answers = [];
            
            let elems = document.getElementsByClassName("lrn_mcqgroup");

            for (let answer of elems[elems.length - 2].children) {
                let text = answer.children[1].children[0].children[0].children[0].children[0].children[0].children[0].textContent;
                answers.push(`${all[answers.length]}. ${text}`);
            }

            console.log(question)
            console.log(answers);

            let prompt = `
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
        }
    });
}