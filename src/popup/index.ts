import { browser } from "webextension-polyfill-ts";

const textInput = (<HTMLInputElement>document.getElementById("textinput"));
const submitBtn = (<HTMLButtonElement>document.getElementById("submit-btn"));
const suggest = (<HTMLParagraphElement>document.getElementById("suggest"));
const result = (<HTMLParagraphElement>document.getElementById("result"));

browser.tabs.executeScript({ file: "/background.js" }).then(() => {
    browser.tabs.query({ active: true, windowId: browser.windows.WINDOW_ID_CURRENT }).then((tabs) => {
        if (tabs[0].id) {
            browser.tabs.sendMessage(tabs[0].id, { command: "load-words" }).then((response) => {
                suggestWords(response.allWords);
            })
        };
    });
})

function suggestWords(allWords: Array<string>): void {
    oninput = (event) => {
        if (textInput.value) {
            for (var i = 0; i < allWords.length; i++) {
                if (allWords[i].startsWith(textInput.value.toLowerCase())) {
                    suggest.innerText = `❔ ${allWords[i]}`;
                }
            }
            
        }
    }
}

submitBtn.onclick = (event) => {
    if (textInput.value.toLowerCase()) {
        var wordDefinition = getWordDefinition(textInput.value.toLowerCase());

        suggest.innerText = "";
        textInput.value = "";
        result.innerText = "⚙️ loading definition...";
    
        wordDefinition.then((definition) => {
            if (definition) {
                result.innerHTML = "✅ Definition:" + "<br />" + `${definition}`;
            } else {
                result.innerText = "🚫 Unable to find definition";
            };
        });
    };
};

function getWordDefinition(word: string): Promise<string> | Promise<null> {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then((rawRes) =>{
        if (rawRes.status === 200) {
            return rawRes.json().then((jsonRes) => {
                return jsonRes[0].meanings[0].definitions[0].definition;
            })
        }
        return null;
    })
}