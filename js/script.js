let WORDS = [{
        italian: "ciao",
        french: ["salut"],
    },
    {
        italian: "buongiorno",
        french: ["bonjour"],
    },
    {
        italian: "buonasera",
        french: ["bonsoir"],
    },
    {
        italian: "buonaserata",
        french: ["bonne soirée"],
    }
];


let wordToGuess;
let wordToGuessDOM = document.getElementById('word_to_guess');

let answerButton = document.getElementById('answer_button');
let answer = document.getElementById('answer');
let answerContainer = document.getElementById('answer_container');

let numberCorrectDOM = document.getElementById('number_right_answers');
let numberTotalDOM = document.getElementById('number_total_answers');
let numberCorrect = 0;
let numberTotal = 0;
let accuracyDOM = document.getElementById('accuracy');
let currentWinStreakDOM = document.getElementById('current_win_streak');
let longestWinStreakDOM = document.getElementById('max_win_streak');
let currentWinStreak = 0;
let longestWinStreak = 0;

let languagesDOM = document.getElementById('languages');
let LANG = 0;


let WRONG_MESSAGE = "WRONG";

let listMistakes = document.getElementById('list_mistakes');
let mistakes = [];



if (window.addEventListener) { // Mozilla, Netscape, Firefox
    window.addEventListener('load', WindowLoad, false);
} else if (window.attachEvent) { // IE
    window.attachEvent('onload', WindowLoad);
}



function WindowLoad(event) {
    changeWordToGuess();
}


languagesDOM.addEventListener("click", swapLanguages);

answer.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        answerButton.click();
    }
});


answerButton.addEventListener("click", handleAnswer);


function oppositeLanguage(lang){
    return (LANG + 1) % 2;
}

function swapLanguages() {
    LANG = oppositeLanguage(LANG);
    if (LANG === 0) {
        document.getElementById("arrow_icon").classList.remove("swapped");
    } else {
        document.getElementById("arrow_icon").classList.add("swapped");
    }
    changeWordToGuess();
}


function pickNewWordToGuess(words) {
    //return words[Math.floor(Math.random() * words.length)];

    return words[Math.floor(Math.random() * words.length)];

}



function writeNewWordToGuess(word) {
    // wordToGuessDOM.innerHTML = capitalize(word.italian);
    wordToGuessDOM.innerHTML = capitalize(word[LANG]);
}


function changeWordToGuess() {
    // wordToGuess = pickNewWordToGuess(WORDS);
    wordToGuess = pickNewWordToGuess(VERBS);
    writeNewWordToGuess(wordToGuess);
}

function checkAnswer(answer) {
    // return wordToGuess.french.includes(answer.toLowerCase());


    //return wordToGuess[1].toLowerCase() === answer.toLowerCase();
    return (accentFold(wordToGuess[oppositeLanguage(LANG)]).toLowerCase() === accentFold(answer).toLowerCase());
}

function handleSuccess(success) {
    if (success) {

        wordToGuessDOM.classList.remove("fade_in");
        wordToGuessDOM.classList.add("fade_out");
        answerContainer.classList.add("right");

        setTimeout(function () {
            wordToGuessDOM.classList.remove("fade_out");
            answerContainer.classList.remove("right");
            changeWordToGuess();
            wordToGuessDOM.classList.add("fade_in");
        }, 400);
        answer.value = "";


    } else {

        answerContainer.classList.add("wrong");
            answer.value = capitalize(wordToGuess[oppositeLanguage(LANG)]);
        let mistake = {
            italian: wordToGuess[0],
            french: wordToGuess[1],
            language:LANG
        };

        if (mistakes.includes(mistake)) {
            mistake.count++;
        } else {
            mistake.count = 1;
            mistakes.push(mistake);
        }


        setTimeout(function () {
            answerContainer.classList.remove("wrong");

            if (answer.value === capitalize(wordToGuess[oppositeLanguage(LANG)])) {
                answer.value = "";
            }

            wordToGuessDOM.classList.remove("fade_in");
            wordToGuessDOM.classList.add("fade_out");
            answerContainer.classList.add("right");

            setTimeout(function () {
                wordToGuessDOM.classList.remove("fade_out");
                answerContainer.classList.remove("right");
                changeWordToGuess();
                wordToGuessDOM.classList.add("fade_in");
            }, 400);
            answer.value = "";
        }, 1000);

    }



}

// function showSuccess(success) {
//     if (success) {
//         answerContainer.classList.add("right");
//         setTimeout(function () {
//             answerContainer.classList.remove("right");
//         }, 1000);

//     } else {
//         answerContainer.classList.add("wrong");

//         answer.value = capitalize(wordToGuess[1]);

//         let mistake = {
//             italian: wordToGuess[0],
//             french: wordToGuess[1]
//         };

//         if (mistakes.includes(mistake)) {
//             mistake.count++;
//         } else {
//             mistake.count = 1;
//             mistakes.push(mistake);
//         }


//         setTimeout(function () {
//             answerContainer.classList.remove("wrong");
//             if (answer.value === capitalize(wordToGuess[1])) {
//                 answer.value = "";
//             }
//         }, 1000);
//     }
// }

function printMistakes() {
    listMistakes.innerHTML = "";
    for (let m of mistakes) {
        // listMistakes.innerHTML += m.italian + " x" + m.count + "<br>";

        let showMessage;
        switch(m.language){
            case(0):
                showMessage = m.italian;
                break;
            case(1):
                showMessage = m.french;
                break;
        }
        listMistakes.innerHTML += showMessage + " x" + m.count + "<br>";
    }
}

function updateDataResults(success) {
    if (success) {
        numberCorrect++;
        numberCorrectDOM.innerHTML = numberCorrect.toString();
        currentWinStreak++;
        longestWinStreak = Math.max(currentWinStreak, longestWinStreak);
    } else {
        currentWinStreak = 0;
    }

    numberTotal++;
    numberTotalDOM.innerHTML = numberTotal.toString();
    accuracy.innerHTML = toFixed(100 * numberCorrect / numberTotal, 2) + "%";
    longestWinStreakDOM.innerHTML = longestWinStreak.toString();
    currentWinStreakDOM.innerHTML = currentWinStreak.toString();

}

//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}



function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function accentFold(inStr) {
    return inStr.replace(
        /([àáâãäå])|([çčć])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g,
        function (str, a, c, e, i, n, o, s, u, y, ae) {
            if (a) return 'a';
            if (c) return 'c';
            if (e) return 'e';
            if (i) return 'i';
            if (n) return 'n';
            if (o) return 'o';
            if (s) return 's';
            if (u) return 'u';
            if (y) return 'y';
            if (ae) return 'ae';
        }
    );
}



function handleAnswer() {
    let answerValue = answer.value;

    if (answerValue !== "") {

        let success = checkAnswer(answerValue);
        handleSuccess(success);
        updateDataResults(success);
        printMistakes();
    }
}