<script>
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schemas;
	export let currentId;

	let selected = 0;
</script>

<div class="d-flex flex-row choices">
	{#each schemas as schema, index}
		<div class="me-2" class:selected={index == selected} on:click={() => selected = index}>
			{schema.title || schema.type}
		</div>
	{/each}
</div>

{#key selected}
	<OperationFormBase {operationId} schema={schemas[selected]} {currentId} />
	<input type="hidden" value={selected} name={currentId + '.anyOf'}/>
{/key}

<style>
	.choices div {
		cursor: pointer;
		font-size: 0.9em;
	}
	.selected {
		text-decoration: underline;
	}
</style>