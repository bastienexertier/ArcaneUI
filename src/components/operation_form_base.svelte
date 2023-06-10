<script>
	import OperationFormInput from './operation_form_input.svelte';
	import OperationFormArray from './operation_form_array.svelte';
	import OperationFormObject from './operation_form_object.svelte';

	export let operationId;
	export let schema;
	export let currentId = "";
</script>

{#if schema.type === "array" || schema.type === "object"}
	<span class="title">{schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name)}</span>
	{#if schema.description}<span class="help">({schema.description})</span>{/if}
{/if}

{#if schema.type === "array"}
	<div class="mx-3"><OperationFormArray {operationId} {schema} {currentId}/></div>
{:else if schema.type === "object"}
	<div class="mx-3"><OperationFormObject {operationId} {schema} {currentId}/></div>
{:else}
	<div><OperationFormInput id={operationId} name={currentId} {schema}/></div>
{/if}

<style>
	.title {
		font-size: 1.25rem;
	}
	.help {
		color: darkgrey;
		font-size: 0.75rem;
		font-style: italic;
	}
</style>
