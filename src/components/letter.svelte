<script>
    export let value = '';
    export let status = '';
    export let theme = "light"
</script>

<input 
    bind:value
    class="w-14 h-14 border text-center text-2xl text-black {status}  {theme === 'dark' ? 'dark' : ''} " 
    maxlength="1" 
    type="text"
/>

<style>
    .dark{
        border: white 1px solid;
    }
</style>
