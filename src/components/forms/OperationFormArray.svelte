<script>
	import ThreeDots from "svelte-bootstrap-icons/lib/ThreeDots.svelte";

	import Header from './headers/Header.svelte'
	import OperationFormBase from './OperationFormBase.svelte';
	import AddButton from './buttons/AddButton.svelte';
	import AddButtonCentered from './buttons/AddButtonCentered.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	export let title = null;
	export let description = null;

	let itemIds = [];

	const handleAdd = id => { itemIds.push(itemIds.length); itemIds=itemIds; };
	const handleDelete = id => { itemIds[id]=null; itemIds=itemIds; };
</script>


<div class="nested-form">
	{#if itemIds.filter(e => e !== null).length === 0}
		<div class="d-flex align-items-center justify-content-between">
			<Header {title} {description} {schema} />
			<AddButton {handleAdd} />
		</div>
		<hr>
		<ThreeDots/>
	{:else}
		<Header {title} {description} {schema} />
		{#each itemIds as itemId}
			{#if itemId !== null}
				{@const currentId = `${currentId}.${itemId}` }
				<OperationFormBase {operationId} schema={schema.items} {currentId} required={true} {itemId} {title} {description} handleDelete={() => handleDelete(itemId)}/>
			{/if}
		{/each}
		<AddButtonCentered {handleAdd} />
	{/if}
</div>
