<script>
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	export let itemId = null;
	export let handleDelete;
</script>

{#if itemId !== null}
	<div class="delete" on:click={() => handleDelete(itemId)}>
		<XCircleFill width={22} height={22} />
	</div>
{/if}

<style>
	.delete {
		cursor: pointer;
		height: 0px;
		float: right;
	}
</style>