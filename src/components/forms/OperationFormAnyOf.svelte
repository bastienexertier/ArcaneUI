<script>
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schemas;
	export let currentId;

	let selected = null;
	const handleDelete = () => selected = null;
</script>

{#if selected === null}<!-- TODO make sure one is selected when submitting -->
	<div class="d-flex flex-row choices">
		{#each schemas as schema, index}
			<div class="me-2" class:selected={index === selected} on:click={() => selected = index}>
				{schema.title || (schema.items && schema.items.title) || schema.type}
			</div>
		{/each}
	</div>
{/if}

{#key selected}
	{#if selected !== null}
		<OperationFormBase {operationId} schema={schemas[selected]} {currentId} {handleDelete} required/>
		<input type="hidden" value={selected} name={currentId + '.anyOf'}/>
	{/if}
{/key}

<style>
	.choices div {
		cursor: pointer;
		font-size: 0.9em;
	}
	.choices div:hover {
		text-decoration: underline;
	}
	.selected {
		text-decoration: underline;
	}
</style>