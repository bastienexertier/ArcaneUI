<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	let itemIds = [];

	const handleAdd = id => {itemIds.push(itemIds.length);itemIds=itemIds;};
	const handleDelete = id => {itemIds[id] = null;itemIds=itemIds;};
</script>

<OperationFormHeader {schema} />

{#if itemIds.length !== 0}
	<div class="nested-form">
		{#each itemIds as itemId}
			{#if itemId !== null}
				<OperationFormBase {operationId} schema={schema.items} currentId={`${currentId}.${itemId}`} {itemId} {handleDelete} />
			{/if}
		{/each}
	</div>
{/if}

<div>
	<div class="btn-add" on:click={handleAdd}>
		<PlusCircleFill width={22} height={22} />
	</div>
</div>

<style>
	.btn-add {
		text-align: center;
	}
</style>