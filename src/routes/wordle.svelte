<script>
    import { onMount } from "svelte";
    import { keyboardStore } from "../keyboardStore";
    import Settings from "../components/settings.svelte";
    import Modal from "../components/modal.svelte";
    import {
        currentWord,
        fetchWord,
        checkIfWordExists,
        fetchAllWords,
    } from "../store";
    import Word from "../components/word.svelte";
    let showModal = false;
    let gameMode = 'api'; 
    let checkWordExistence = true; 
    let result = false;
    let modalMessage = '';

    function showResult(message) {
        modalMessage = message;
        result = true;
    }
    function closeModal() {
        showModal = false;
    }
    function handleSaveSettings(event) {
        currentTheme = event.detail.selectedTheme;
        gameMode = event.detail.selectedMode;
        checkWordExistence = event.detail.checkWordExistence;
        showModal = false;
    }


    let word = "";
    let inputs = [];
    let results = [];
    let message = "";
    let isLoading = true;
    let hintUsed = false;
    let attemptsLeft = word.length + 1;

    let currentTheme = "light"; 

    function useHint() {
    if (hintUsed || word === "") return; 

    let revealedIndices = new Set();
    while (revealedIndices.size < Math.floor(word.length / 2)) {
        let randomIndex = Math.floor(Math.random() * word.length);
        revealedIndices.add(randomIndex);
    }

    let currentRow = inputs.findIndex(row => row.includes(""));
    if (currentRow === -1) {
        currentRow = inputs.length - 1;
    }

    for (let i = 0; i < word.length; i++) {
        if (revealedIndices.has(i)) {
            inputs[currentRow][i] = word[i].toUpperCase(); 
        } else {
            inputs[currentRow][i] = "-";
        }
    }

    for (let i = 0; i < word.length; i++) {
        results[currentRow][i] = revealedIndices.has(i) ? "correct" : "incorrect";
    }
    if (currentRow === inputs.length - 1) {
        showResult("Przegrałes");
        hintUsed = true;
        return;
    }
    if (currentRow < inputs.length - 1) {
        inputs = inputs.slice(0, currentRow + 2); 
        results = results.slice(0, currentRow + 2); 
    } else {
        inputs.push(Array(word.length).fill(""));
        results.push(Array(word.length).fill(""));
    }

    // Sprawdzenie, czy jesteśmy w ostatnim dostępnym wierszu


    hintUsed = true;
    attemptsLeft = 1; 
    keyboardStore.setLetterStatus({
        letters: inputs[currentRow],
        statuses: results[currentRow],
    });
}




    function getThemeClass(className) {
        return `${className} ${currentTheme === "dark" ? "dark" : ""}`;
    }

    onMount(async () => {
        await fetchWord();
        await fetchAllWords();
        isLoading = false;
        currentWord.subscribe((value) => {
            word = value;
            if (word) {
                inputs = Array(word.length + 1)
                    .fill(null)
                    .map(() => Array(word.length).fill(""));
                results = Array(word.length + 1)
                    .fill(null)
                    .map(() => Array(word.length).fill(""));
            }
        });
    });

    window.onkeydown = (event) => {
        const char = event.key;

        if (char.length === 1 && /^[a-zA-Z]+$/.test(char)) {
            handleKeyPress(event, char.toUpperCase());
        } else if (char === "Enter") {
            handleKeyPress(event, "Enter");
        } else if (char === "Backspace") {
            handleKeyPress(event, "Backspace");
        }
    };

    currentWord.subscribe((value) => {
        word = value;
        if (word) {
            inputs = Array(5)
                .fill(null)
                .map(() => Array(word.length).fill(""));
            results = Array(5)
                .fill(null)
                .map(() => Array(word.length).fill(""));
        }
        console.log(word);
    });

    onMount(() => {
        fetchWord();
    });

    function handleKeyPress(event, char) {
        let currentRow = inputs.findIndex((row) => row.includes(""));
        if (currentRow === -1) {
            currentRow = inputs.length - 1;
        } else if (
            currentRow > 0 &&
            !inputs[currentRow - 1].includes("") &&
            results[currentRow - 1].includes("")
        ) {
            currentRow--;
        }
        if (currentRow > 0 && results[currentRow - 1].includes("")) {
            return;
        }

        if (char === "Enter") {
            if (!inputs[currentRow].includes("")) {
                checkWord(currentRow);
            }
            return;
        } else if (char === "Backspace") {
            if (results[currentRow].includes("")) {
                removeLastChar(currentRow);
            }
            return;
        }

        if (inputs[currentRow].includes("")) {
            for (let j = 0; j < inputs[currentRow].length; j++) {
                if (inputs[currentRow][j] === "") {
                    inputs[currentRow][j] = char;
                    inputs = [...inputs];
                    return;
                }
            }
        }
    }

    async function checkWord(currentRow) {
    const enteredWord = inputs[currentRow].join("");
    const wordExists = await checkIfWordExists(enteredWord);
    console.log(wordExists);
    if (!wordExists && checkWordExistence) {
        console.log(checkIfWordExists)
        console.log("sda")
        message = "Nie ma takiego slowa.";
        return;
    }
    message = "";

    const correctWord = word.split("");
    let rowResult = Array(word.length).fill("incorrect");
    let tempWord = [...correctWord];
    let isCorrectGuess = true;

    for (let i = 0; i < correctWord.length; i++) {
        if (inputs[currentRow][i] === correctWord[i]) {
            rowResult[i] = "correct";
            tempWord[i] = null;
        } else {
            isCorrectGuess = false;
        }
    }
    for (let i = 0; i < correctWord.length; i++) {
        if (rowResult[i] !== "correct" && tempWord.includes(inputs[currentRow][i])) {
            rowResult[i] = "present";
            let foundIndex = tempWord.indexOf(inputs[currentRow][i]);
            tempWord[foundIndex] = null;
        }
    }

    results[currentRow] = rowResult;

    keyboardStore.setLetterStatus({
        letters: inputs[currentRow],
        statuses: rowResult,
    });

    if (isCorrectGuess) {
        showResult("Wygrales!");
    } else {
        if (hintUsed) {
            attemptsLeft--;
        }
        if (attemptsLeft <= 0) {
            showResult("Przegraes.");
        }
    }
}



    function removeLastChar(currentRow) {
        let row = inputs[currentRow];
        let indexToRemove = -1;

        for (let i = row.length - 1; i >= 0; i--) {
            if (row[i] !== "") {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove === row.length - 1) {
            indexToRemove = row.length - 1;
        }

        if (indexToRemove !== -1) {
            row[indexToRemove] = "";
            inputs[currentRow] = row;
            inputs = [...inputs];
        }
    }
</script>
{#if showModal}
    <Settings on:save={handleSaveSettings} />
{/if}
<div
    class="game-container bg-white dark:bg-black mt-12 h-screen {currentTheme ===
    'dark'
        ? 'dark'
        : ''}"
>
    {#if isLoading}
        <div
            class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div class="spinner"></div>
        </div>
    {/if}
    {#if word && !isLoading}
        <Word {inputs} {results} bind:currentTheme />
        <div class="mt-12 flex flex-col items-center">
            <div class="keyboard-row mb-2">
                {#each "QWERTYUIOP".split("") as kbKey}
                    <button
                        class="h-12 w-12 rounded shadow mx-1 {$keyboardStore.letterStatus.get(
                            kbKey,
                        ) || 'unknown'}"
                        on:click={() => handleKeyPress(kbKey)}
                    >
                        {kbKey}
                    </button>
                {/each}
            </div>
            <div class="keyboard-row mb-2">
                {#each "ASDFGHJKL".split("") as kbKey}
                    <button
                        class="h-12 w-12 rounded shadow mx-1 {$keyboardStore.letterStatus.get(
                            kbKey,
                        ) || 'unknown'}"
                        on:click={() => handleKeyPress(kbKey)}
                    >
                        {kbKey}
                    </button>
                {/each}
            </div>
            <div class="keyboard-row">
                {#each "ZXCVBNM".split("") as kbKey}
                    <button
                        class="h-12 w-12 rounded shadow mx-1 {$keyboardStore.letterStatus.get(
                            kbKey,
                        ) || 'unknown'}"
                        on:click={() => handleKeyPress(kbKey)}
                    >
                        {kbKey}
                    </button>
                {/each}
            </div>
        </div>
        <div class="flex justify-center mt-4">
            <button
                class={getThemeClass(
                    "h-12 w-24 bg-gray-200 hover:bg-gray-300 text-black rounded shadow mx-1",
                )}
                on:click={(event) => handleKeyPress(event, "Enter")}
            >
                Enter
            </button>
            <button
                class={getThemeClass(
                    "h-12 w-24 bg-gray-200 hover:bg-gray-300 text-black rounded shadow mx-1",
                )}
                on:click={(event) => handleKeyPress(event, "Backspace")}
            >
                Backspace
            </button>
            <button class="absolute top-2 right-2" on:click={() => showModal = !showModal}>Settings</button>
            <button on:click={useHint} class="absolute top-2 right-36" disabled={hintUsed}>
                Hint
            </button>
        </div>
    {/if}
    {#if result}
    <Modal message={modalMessage} onClose={() => result = false} />
{/if}
</div>


<style>
    .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 4px solid white;
        width: 3rem;
        height: 3rem;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .dark {
        background-color: black;
        color: white;
    }

    .dark button {
        border: solid 1px white;
    }
</style>
