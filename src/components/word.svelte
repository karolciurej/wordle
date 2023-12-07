<script>
    import Letter from "./letter.svelte";
    export let inputs;
    export let results; 
    export let currentTheme = 'light';

</script>

<div class="flex flex-col items-center gap-6">
    {#each inputs as row, rowIndex}
    <div class="flex gap-3 ">
        {#each row as value, columnIndex}
            <Letter bind:theme={currentTheme} bind:value={inputs[rowIndex][columnIndex]} status={results[rowIndex][columnIndex]} />
        {/each}
    </div>
    {/each}
</div>
