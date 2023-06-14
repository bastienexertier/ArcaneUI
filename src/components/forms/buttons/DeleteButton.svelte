<script>
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	export let handleDelete = null;
</script>

{#if handleDelete !== null}
	<button class="btn-delete" on:click|preventDefault={handleDelete}>
		<XCircleFill width={22} height={22} />
	</button>
{/if}

<style>
	.btn-delete {
		all: unset;
		cursor: pointer;
		margin-left: auto;
		float: right;
	}
</style>