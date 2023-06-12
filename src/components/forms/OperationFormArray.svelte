<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import Header from './headers/Header.svelte'
	import OperationFormBase from './OperationFormBase.svelte';
	import AddButton from './buttons/AddButton.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	export let title = null;
	export let description = null;

	let itemIds = [];

	const handleAdd = id => { itemIds.push(itemIds.length); itemIds=itemIds; };
	const handleDelete = id => { itemIds[id] = null; itemIds=itemIds; };
</script>

{#if itemIds.filter(e => e !== null).length !== 0}
	<div class="nested-form">
		{#each itemIds as itemId}
			{#if itemId !== null}
				{@const currentId = `${currentId}.${itemId}` }
				<OperationFormBase {operationId} schema={schema.items} {currentId} {itemId} {title} {description} {handleDelete} required/>
			{/if}
		{/each}
	</div>
{/if}

<AddButton {handleAdd} />
