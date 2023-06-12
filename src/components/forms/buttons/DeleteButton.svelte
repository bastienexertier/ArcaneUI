<script>
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	export let itemId = null;
	export let handleDelete = null;
</script>

{#if handleDelete !== null}
	<button class="btn-delete" on:click={() => handleDelete(itemId)}>
		<XCircleFill width={22} height={22} />
	</button>
{/if}

<style>
	.btn-delete {
		all: unset;
		cursor: pointer;
		height: 0px;
		float: right;
		margin: auto;
		display: block;
	}
</style>