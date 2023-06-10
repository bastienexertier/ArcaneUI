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

	console.log(itemId);
</script>

{#if schema.type === "object"}<OperationFormHeader {schema} />{/if}

{#if isNested}
	<div class="inner">
		<OperationFormDeleteButton {itemId} {handleDelete} />
		{#if schema.type === "array"}
			<OperationFormHeader {schema} />
			<hr>
			<OperationFormArray {operationId} {schema} {currentId}/>
		{:else if schema.type === "object"}
			<OperationFormObject {operationId} {schema} {currentId}/>
		{:else if "anyOf" in schema}
			<OperationFormAnyOf {operationId} schemas={schema.anyOf} {currentId}/>
		{/if}
	</div>
{:else}
	<div>
		<OperationFormInput id={operationId} name={currentId} {schema}/>
		<!-- <OperationFormDeleteButton {itemId} {handleDelete} /> -->
	</div>
{/if}

<style>
	.inner {
		margin-top: 1rem !important;
		margin-bottom: 1rem !important;
		padding-right: 1rem !important;
		padding-left: 1rem !important;
		padding-top: 1rem !important;
		padding-bottom: 1rem !important;
		-webkit-box-shadow: 1px 4px 15px 8px rgba(0,0,0,0.30); 
		box-shadow: 1px 4px 15px 8px rgba(0,0,0,0.30);
		border-radius: 2px;
	}
	hr {
		margin: 0 0 8px 0;
	}
</style>
