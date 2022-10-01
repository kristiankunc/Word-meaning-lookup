import { browser } from "webextension-polyfill-ts";

browser.runtime.onMessage.addListener((request) => {
    if (request.command === "load-words") {
        return Promise.resolve( {allWords: getWords()} );
    };
});

function getWords(): Array<string> {
    var allElements = Array.prototype.slice.call(document.body.getElementsByTagName("*"), 0);
    var res: Array<string> = []

    allElements.forEach((element) => {
        if (element.innerText) {
            var innerWords: Array<string> = element.innerText.split(/[ \n]/)
            innerWords.forEach((word) => {
                if (word) {
                    res.push(word.toLowerCase());
                };
            });
        };
    });

    return res
}