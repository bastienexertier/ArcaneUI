<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	export let handleAdd = null;
</script>

{#if handleAdd !== null}
	<button class="btn-add" on:click={handleAdd}>
		<PlusCircleFill width={22} height={22} />
	</button>
{/if}

<style>
	.btn-add {
		all: unset;
		cursor: pointer;
		margin: auto;
		display: block;
	}
</style>