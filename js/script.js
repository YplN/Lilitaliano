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

let TIME = [
    // ["IMPERATIVO", "PRESENTE"],
    // ["INDICATIVO", "FUTURO ANTERIORE"],
    ["INDICATIVO", "PASSATO PROSSIMO"],
    ["INDICATIVO", "PRESENTE"],
    // ["INDICATIVO", "PASSATO REMOTO"],
    // ["INDICATIVO", "FUTURO SEMPLICE"],
    // ["INDICATIVO", "IMPERFETTO"],
    // ["INDICATIVO", "TRAPASSATO REMOTO"],
    // ["INDICATIVO", "TRAPASSATO PROSSIMO"]
];


let wordToGuess;
let verbToGuess;
let wordToGuessDOM = document.getElementById('word_to_guess');

//let answerButton = document.getElementById('answer_button');
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

let traductionModeDOM = document.getElementById('mode_traduction');
let conjugationModeDOM = document.getElementById('mode_conjugation');


let WRONG_MESSAGE = "WRONG";

let listMistakes = document.getElementById('list_mistakes');
let mistakes = [];




if (window.addEventListener) { // Mozilla, Netscape, Firefox
    window.addEventListener('load', WindowLoad, false);
} else if (window.attachEvent) { // IE
    window.attachEvent('onload', WindowLoad);
}


traductionModeDOM.addEventListener("click", switchToTraductionMode);
conjugationModeDOM.addEventListener("click", switchToConjugateMode);

function WindowLoad(event) {
    changeWordToGuess();
}

function switchToConjugateMode() {
    hideFlags();
    changeVerbToGuess();
}

function switchToTraductionMode() {
    showFlags();
    changeWordToGuess();
}


function hideFlags() {
    let flagDOM = document.getElementById("languages");
    flagDOM.style.opacity = 0;
    flagDOM.zIndex = 1;
    languagesDOM.removeEventListener("click", swapLanguages);
}

function showFlags() {
    let flagDOM = document.getElementById("languages");
    flagDOM.style.opacity = 1;
    flagDOM.zIndex = 1;
    languagesDOM.addEventListener("click", swapLanguages);
}


languagesDOM.addEventListener("click", swapLanguages);

answer.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        //answerButton.click();
        handleAnswer();
    }
});


//answerButton.addEventListener("click", handleAnswer);


function oppositeLanguage(lang) {
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


function pickVerbToConjugate(words, times) {
    let time = times[Math.floor(Math.random() * times.length)];
    let word = words[Math.floor(Math.random() * words.length)];
    let pronounIndex = Math.floor(Math.random() * word[2][time[0]][time[1]].length);
    let verb = word[2][time[0]][time[1]][pronounIndex];

    let v = {
        mode: time[0],
        time: time[1],
        conj: verb,
        italian: word[0],
        french: word[1],
        pronounIndex: pronounIndex
    };

    console.log(v);
    return v;
}

function pronounIndexToString(i) {
    if (i === 0)
        return "1ère p.s.";
    else if (i < 3)
        return (i + 1) + "ème p.s.";
    else if (i == 3)
        return "1ère p.p.";
    else
        return (i - 2) + "ème p.p.";


}



function writeNewWordToGuess(word) {
    // wordToGuessDOM.innerHTML = capitalize(word.italian);
    wordToGuessDOM.innerHTML = capitalize(word[LANG]);
}

function writeNewVerbToGuess(verb) {
    console.log(verb);
    wordToGuessDOM.innerHTML = verb.italian + "</br>" + pronounIndexToString(verb.pronounIndex) + "</br> " + verb.time.toLowerCase() + " (" + verb.mode.toLowerCase() + ")";

}


function changeWordToGuess() {
    // wordToGuess = pickNewWordToGuess(WORDS);
    wordToGuess = pickNewWordToGuess(VERBS);
    writeNewWordToGuess(wordToGuess);
}

function changeVerbToGuess() {
    verbToGuess = pickVerbToConjugate(VERBS, TIME);
    console.log(verbToGuess);
    writeNewVerbToGuess(verbToGuess);
}

function checkAnswer(answer) {
    // return wordToGuess.french.includes(answer.toLowerCase());


    //return wordToGuess[1].toLowerCase() === answer.toLowerCase();
    return (formatString(wordToGuess[oppositeLanguage(LANG)]) === formatString(answer));
}


function formatString(s) {
    return accentFold(s).toLowerCase().trim();
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
            language: LANG
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

function printMistakes() {
    listMistakes.innerHTML = "";
    for (let m of mistakes) {
        // listMistakes.innerHTML += m.italian + " x" + m.count + "<br>";

        let showMessage;
        switch (m.language) {
            case (0):
                showMessage = m.italian;
                break;
            case (1):
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
        console.log(pickVerbToConjugate(wordToGuess, ));
        //printMistakes();
    }
}