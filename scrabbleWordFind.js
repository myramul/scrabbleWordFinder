// VARIABLES
    const lengthSlider = document.querySelector("#lengthSlider");
    const sliderValue = document.querySelector("#sliderValue");
    const lengthCheckbox = document.querySelector("#specifyLength");
    const slideContainer = document.querySelector(".slidecontainer");
    const errorMsg = document.querySelector("#errorMsg");
    const inputBox = document.querySelector("#inputLetters");
    const findBtn = document.querySelector("#goBtn");
    const results = document.querySelector("#results");

    let wordLength = 0;
    let specificLength = false;
    let userLetters = "";
    
    const scores = new Map([
        ["A", 1],["B", 3],
        ["C", 3],["D", 2],
        ["E", 1],["F", 4],
        ["G", 2],["H", 4],
        ["I", 1],["J", 8],
        ["K", 5],["L", 1],
        ["M", 3],["N", 1],
        ["O", 1],["P", 3],
        ["Q", 10],["R", 1],
        ["S", 1],["T", 1],
        ["U", 1],["V", 4],
        ["W", 4],["X", 8],
        ["Y", 4],["Z", 10],
    ]);

    import {words} from './englishDictionary.js';
    
// FUNCTIONS & EVENTS

    // make slider display value next to it
    sliderValue.textContent = lengthSlider.value;
    lengthSlider.oninput = () => sliderValue.textContent = lengthSlider.value;

    // hide slider unless check box is selected
    lengthCheckbox.onchange = () => {
        if (!lengthCheckbox.checked)
        {
            specificLength = false;
            slideContainer.style.display = "none";
        }
        else
        {  
            specificLength = true;
            slideContainer.style.display = "block";
        }
    }

    function validateInput(letters){
        // check if input contains anything other than letters
        if (/[^a-z]/i.test(letters))
        {
            results.textContent = "";
            errorMsg.style.display = "block";
            errorMsg.textContent = "invalid input: please only enter alphabetic (a-z) characters.";

            setTimeout(() => {
                errorMsg.textContent = "";
                errorMsg.style.display = "none";
                results.textContent = "";
            }, 5000);
            
            return false;
        }
        else
            return true;
    } 

    function getInput(){
            do{
                userLetters = inputBox.value;
                if (validateInput(userLetters))
                    break;
                
                inputBox.value = "";
            }while(!validateInput(userLetters))
            userLetters = userLetters.toUpperCase();
    }

    function calculateScore(word){
        let score = 0;
        for (let c of word)
            score += scores.get(`${c}`);
        return score;
    }

    function clear(){ // add clear button, when pressed everything back to defaults
        results.textContent = "";
        lengthCheckbox.checked = false;
    }

    function createLetterCountMap(someLetters){
        let individualLetterCount = new Map();

        for (let c = 0; c < someLetters.length; c++){
            let character = someLetters[c];

            let count = individualLetterCount.has(character) ? individualLetterCount.get(character) : 0;
            individualLetterCount.set(character, count+1);
        }

        return individualLetterCount;
    }

    function getValidWords(){ 
        results.textContent = "";

        if (lengthCheckbox.checked){
            specificLength = true;
            wordLength = lengthSlider.value;
        }
        else{
            specificLength = false;
            wordLength = 0;
        }
            

        let validWords = [], validWordCount = 0;
        getInput();
        let userLetterMap = createLetterCountMap(userLetters);

        for (let x = 0; x < words.length; x++){
            let dictWordMap = createLetterCountMap(words[x]);
            let wordPossible = true;

            for (let y of dictWordMap.keys())
            {
                let dictCharCount = dictWordMap.get(y);
                let userLettersCharCount = userLetterMap.has(y) ? userLetterMap.get(y) : 0;

                if (dictCharCount > userLettersCharCount){
                    wordPossible = false;
                    break;
                }
            }
            if (wordPossible && !specificLength){
                validWords[validWordCount] = words[x];
                validWordCount++;
            }
            else if (wordPossible && specificLength && (words[x].length == wordLength))
            {
                validWords[validWordCount] = words[x];
                validWordCount++;
            }
        }

        if (validWordCount == 0)
        {
            results.append("No valid scrabble words found.");
        }
        else{
            let appendedWordCount = 0;
            validWords.forEach(validWord => {
                let score = calculateScore(validWord);
                appendedWordCount++;
                if (appendedWordCount % 3 == 0){
                    results.append(`${validWord}[${score}]`);
                    results.append(document.createElement("br"));
                }else if (appendedWordCount == validWordCount){
                    results.append(`${validWord}[${score}]`);
                }else {
                    results.append(`${validWord}[${score}]` + " - ");
                }
            })
        }
    }

    // add on click event for the button, generates valid words list
    findBtn.addEventListener("click", getValidWords);
    inputBox.addEventListener("change", clear);
    


    