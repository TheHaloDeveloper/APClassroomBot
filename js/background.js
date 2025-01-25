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
    let all = "ABCDE";
    let color_maps = {
        "Green": "rgb(160, 242, 201)",
        "Yellow": "rgb(246, 255, 166)",
        "Red": "rgb(255, 136, 125)"
    }
    
    let timer = 0;
    let first = true

    document.addEventListener('keydown', function(event) {
        if (event.key === '`') {
            if (first) {
                document.body.innerHTML += `<div id="timer-ratelimit" style="position: absolute; z-index: 99999; right: 5px; bottom: 5px;">${timer}</div>`;
                first = false;

                setInterval(function() {
                    if (timer > 0) {
                        timer--;
                        document.getElementById("timer-ratelimit").innerHTML = timer;
                    }
                }, 1000);
            }

            if (timer == 0) {
                timer = 30;
                let elems = document.getElementsByClassName("bluebook-popover");
                let num = parseInt(elems[elems.length - 1].children[0].children[0].children[1].children[0].children[1].textContent.split(" of")[0]);
    
                let main = document.getElementsByClassName("learnosity-item")[num - 1].getElementsByClassName("lrn_clearfix")[0];
                let ul = main.children[2].children[0].children[2].children[0].children[0];
    
                if(main.children[1].getElementsByTagName("img").length == 0) {
                    let question = main.children[1].children[0].children[0].textContent;
                    let answers = [];
        
                    for (let answer of ul.children) {
                        let text = answer.getElementsByClassName("lrn-label")[0].textContent.split("Option ")[0];
                        answers.push(`${all[answers.length]}. ${text}`);
                    }
        
                    let prompt = `
    You will be given a multiple-choice question about computer science. Your task is to:
    - Carefully evaluate the code and choose the correct answer.
    - Provide a confidence level using the colors:
      - Green: 100% confidence, cannot be wrong at all.
      - Yellow: Pretty sure, but not 100% confident
      - Red: Not sure, but based on the analysis, the best answer.
    - Use the given answer format below, with a hyphen between the letter and your confidence level respresented by a color.
    RESPOND ONLY WITH THE ANSWER FORMAT REQUESTED, NO EXPLANATION.
    
    Here are a few examples of how to approach these types of questions:
    
    Example 1:
    Question:
    Consider the following code:
    int x = 5;
    x *= 2;
    System.out.println(x);
    
    What is printed?
    Options:
    A. 5
    B. 10
    C. 15
    D. 2
    
    B - Green
    
    
    Example 2:
    Question:
    Consider the following code:
    int a = 7;
    a += 3;
    System.out.println(a);
    
    What is printed?
    Options:
    A. 7
    B. 3
    C. 10
    D. 17
    
    C - Green
    
    Now, here is the current question:
    ######
    QUESTION:
    ${question.replaceAll(";", ";\n")}
    ####
    ANSWERS:
    ${answers.join("\n")}
                    `;
        
                    fetch('https://ai-server-lilac.vercel.app/api', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({prompt: prompt})
                    })
                    .then(response => response.json())
                    .then(data => {
                        let parts = data.res.trim().replaceAll("\n", "").replaceAll("*", "").split(" - ");
                        let elem = ul.children[all.indexOf(parts[0])];
                        elem.style.backgroundColor = `${color_maps[parts[1]]}`;
                        
                        setTimeout(function() {
                            elem.style.backgroundColor = "unset";
                        }, 500)
                    });
                } else {
                    for (let li of ul.children) {
                        li.style.backgroundColor = color_maps["Red"];
        
                        setTimeout(function() {
                            li.style.backgroundColor = "unset";
                        }, 500)
                    }
                }
            }
        }
    });
}