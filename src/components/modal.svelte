<script>
    export let message = "";
    export let onClose;

    function handleKeydown(event) {
        if (event.key === "Enter" || event.key === "Escape") {
            onClose();
        }
    }
</script>

<div class="absolute top-1/2 right-1/2 translate-x-[50%] translate-y-[-50%] bg-white border h-96 w-96 flex flex-col justify-center gap-12 items-center">

        <p>{message}</p>
        <button on:click={onClose}>Close</button>
</div>

<style>

</style>
