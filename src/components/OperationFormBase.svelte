<script>
	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormDeleteButton from './OperationFormDeleteButton.svelte'

	import OperationFormInput from './OperationFormInput.svelte';
	import OperationFormArray from './OperationFormArray.svelte';
	import OperationFormObject from './OperationFormObject.svelte';
	import OperationFormAnyOf from './OperationFormAnyOf.svelte';

	export let operationId;
	export let schema;
	export let currentId = "";

	export let itemId = null;
	export let handleDelete = null;

	let isNested = schema.type === "array" || schema.type === "object" || "anyOf" in schema;
	let title = schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name);
</script>

{#if isNested}
	<OperationFormDeleteButton {itemId} {handleDelete} />
	{#if schema.type === "array"}
		<OperationFormArray {operationId} {schema} {currentId}/>
	{:else if schema.type === "object"}
		<OperationFormObject {operationId} {schema} {currentId}/>
	{:else if "anyOf" in schema}
		<OperationFormAnyOf {operationId} schemas={schema.anyOf} {currentId}/>
	{/if}
{:else}
	<div>
		<OperationFormInput id={operationId} name={currentId} {schema}/>
		<!-- <OperationFormDeleteButton {itemId} {handleDelete} /> -->
	</div>
{/if}

<style>
	hr {
		margin: 0 0 8px 0;
	}
</style>
