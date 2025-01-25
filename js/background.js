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
            
            let elems = document.getElementsByClassName("bluebook-popover");
            let num = parseInt(elems[elems.length - 1].children[0].children[0].children[1].children[0].children[1].textContent.split(" of")[0]);

            let question = document.getElementsByClassName("learnosity-item")[num - 1].children[0].children[0].children[0].children[1].children[0].children[1].children[0].children[0].textContent;
            let answers = [];

            for (let answer of document.getElementsByClassName("lrn_mcqgroup")[0].children) {
                let text = answer.getElementsByClassName("lrn-label")[0].textContent.split("Option ")[0];
                answers.push(`${all[answers.length]}. ${text}`);
            }

            console.log(question);
            console.log(answers);

            let prompt = `
            You will be given a question below, along with multiple choice answers. Your job is to output one singular letter, for the correct answer. If there are no correct answers, pick the best option - you must always answer the question.
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