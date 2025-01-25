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
            let main = document.getElementsByClassName("learnosity-item")[num - 1].getElementsByClassName("lrn_clearfix")[0];

            let question = main.children[1].children[0].children[0].textContent;
            let answers = [];

            let ul = main.children[2].children[0].children[2].children[0].children[0];
            for (let answer of ul.children) {
                let text = answer.getElementsByClassName("lrn-label")[0].textContent.split("Option ")[0];
                answers.push(`${all[answers.length]}. ${text}`);
            }

            let prompt = `
            You will be given a question below, along with multiple choice answers. Your job is to output one singular letter, for the BEST option given. You should also output one of three colors: Green, Yellow, or Orange. Green means you are 99% confident that you are correct, yellow means that you are pretty sure, and red means you don't know and you're picking the best option.
            Output examples: A - Green, E - Yellow, D - Red
            ######
            QUESTION:
            ${question}
            ####
            ANSWERS:
            ${answers.join("\n")}
            `;

            let color_maps = {
                "Green": "rgb(160, 242, 201)",
                "Yellow": "rgb(246, 255, 166)",
                "Red": "rgb(255, 136, 125)"
            }

            fetch('http://localhost:5000/api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt: prompt})
            })
            .then(response => response.json())
            .then(data => {
                let parts = data.res.trim().split(" - ");
                let elem = ul.children[all.indexOf(parts[0])];
                elem.style.backgroundColor = `${color_maps[parts[1]]}`;
                
                setTimeout(function() {
                    elem.style.backgroundColor = "unset";
                }, 500)
            });
        }
    });
}