<script>
    import { onMount } from "svelte";
    import Word from "../components/Word.svelte";
    import { currentWord, fetchWord } from "../store";

    let word = "";
    let inputs = [];

    currentWord.subscribe((value) => {
        word = value;
        if (word) {
            console.log(word)
            inputs = Array(5)
                .fill(null)
                .map(() => Array(word.length).fill(""));
        }
    });

    onMount(() => {
        fetchWord();
    });

    function handleKeyPress(event, char) {
    if (char === "Enter") {
        console.log("Enter pressed, current inputs:", JSON.stringify(inputs));
        checkWord();
        return;
    } else if (char === "Backspace") {
        removeLastChar();
        return;
    }
    
    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs[i].length; j++) {
            if (inputs[i][j] === "") {
                inputs[i][j] = char;
                console.log(JSON.stringify(inputs));
                inputs = [...inputs]; 
                return;
            }
        }
    }
}

function checkWord() {
    let currentRow = inputs.findIndex(row => row.includes(''));
    if (currentRow === -1) {
        currentRow = inputs.length - 1; 
    } else if (currentRow > 0 && !inputs[currentRow - 1].includes('')) {
        currentRow--;
    }
    if (inputs[currentRow].includes('')) {
        return; 
    }

    const correctWord = word.split('');

    for (let i = 0; i < correctWord.length; i++) {
        if (inputs[currentRow][i] === correctWord[i]) {
            console.log(i, "is correct:");
        } else {
            console.log(i, "is incorrect:");
        }
    }
}




    function removeLastChar() {

}


    function handleInputFocus(event) {
        console.log("Input focused:", event.target);
    }
</script>

<div class="game-container">
    {#if word}
        <Word {inputs} />
        <div class="mt-12">
            {#each "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") as key}
                <button
                    class="h-16 w-16 border"
                    on:click={(event) => handleKeyPress(event, key)}
                    >{key}</button
                >
            {/each}
            <button class="h-16 w-16 border" on:click={(event) => handleKeyPress(event, "Enter")}
                >Enter</button
            >
            <button class="h-16 w-24 border" on:click={(event) => handleKeyPress(event, "Backspace")}
                >Backspace</button
            >
        </div>
    {/if}
</div>
