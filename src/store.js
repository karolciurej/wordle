import { writable } from "svelte/store";

export const currentWord = writable("");

export async function fetchWord() {
    const length = Math.floor(Math.random() * (9 - 4 + 1) + 4);
    let url = `https://random-word-api.herokuapp.com/word?length=${length}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        currentWord.set(data[0].toUpperCase()); 
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        currentWord.set(""); 
    }
}
