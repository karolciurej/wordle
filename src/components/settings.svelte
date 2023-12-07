<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let selectedTheme = 'light'; 
    let selectedMode = 'api';
    let checkWordExistence = true;

    function saveSettings() {
        dispatch('save', { selectedTheme, selectedMode, checkWordExistence });
    }
</script>

<div class="modal border h-1/2 w-1/2 flex flex-col justify-evenly items-center absolute bg-white left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
    <h2>Ustawienia</h2>
    <div>
        <label>
            Motyw:
            <select bind:value={selectedTheme}>
                <option value="light">Jasny</option>
                <option value="dark">Ciemny</option>
            </select>
        </label>
    </div>
    <div>
        <label>
            Tryb gry:
            <select bind:value={selectedMode}>
                <option value="api">Z API</option>
                <option value="file">Z pliku</option>
            </select>
        </label>
    </div>
    <div>
        <label>
            <input type="checkbox" bind:checked={checkWordExistence}>
            Sprawdzanie istnienia słowa
        </label>
    </div>
    <button on:click={saveSettings}>Zapisz</button>
</div>
