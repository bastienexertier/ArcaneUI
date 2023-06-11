<script>
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schemas;
	export let currentId;

	let selected = null;
	let name = currentId + '.anyOf';
	const handleDelete = () => selected = null;
</script>

{#if selected === null}
	<div class="choices">
		{#each schemas as schema, index}
			{@const id = `${name}.${index}`}
			<label class="form-check-label" for={id}>
				{schema.title || (schema.items && schema.items.title) || schema.type}
			</label>
			<input class="form-check-input" type="radio" {name} {id} value={index} on:change={e => selected = e.target.value} required>
		{/each}
	</div>
{/if}

{#key selected}
	{#if selected !== null}
		<OperationFormBase {operationId} schema={schemas[selected]} {currentId} {handleDelete} required/>
	{/if}
{/key}

<style>
	.choices label {
		cursor: pointer;
		font-size: 0.9em;
	}
	.choices label:hover {
		text-decoration: underline;
	}
	.choices input {
		width: 0px;
		opacity: 0;
	}
	.selected {
		text-decoration: underline;
	}
</style>