<script>
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schemas;
	export let currentId;

	export let title = null;
	export let description = null;

	let selected = null;
	let name = currentId + '.anyOf';

	function handleSelect(id) {
		selected = id;
	}

	function handleDelete() {
		document.getElementById(`${name}.${selected}`).checked = false;
		selected = null;
	}
</script>

<div class="choices" class:hidden={selected !== null}>
	{#each schemas as schema, index}
		{@const id = `${name}.${index}`}
		<label class="form-check-label" for={id}>
			{schema.title || (schema.items && schema.items.title) || schema.type}
		</label>
		<input class="form-check-input" type="radio" {name} {id} value={index} on:change={e => handleSelect(e.target.value)} required>
	{/each}
</div>

{#key selected}
	{#if selected !== null}
		<OperationFormBase {operationId} schema={schemas[selected]} {currentId} required={true} {title} {description} {handleDelete}/>
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
	.hidden {
		display: none;
	}
</style>