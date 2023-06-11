<script>
	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormDeleteButton from './OperationFormDeleteButton.svelte'

	import OperationFormObject from './OperationFormObject.svelte';
	import OperationFormArray from './OperationFormArray.svelte';
	import OperationFormAnyOf from './OperationFormAnyOf.svelte';
	import OperationFormInput from './OperationFormInput.svelte';
	import OperationFormObjectOptional from './OperationFormObjectOptional.svelte';
	import OperationFormArrayOptional from './OperationFormArrayOptional.svelte';

	export let operationId;
	export let schema;
	export let required;
	export let currentId = "";

	export let itemId = null;
	export let handleDelete = null;

	let isNested = schema.type === "array" || schema.type === "object" || "anyOf" in schema;
	let title = schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name);

	//console.log(title, required, schema);
</script>

{#if isNested}
	<OperationFormDeleteButton {itemId} {handleDelete} />
	{#if schema.type === "array"}
		{#if required}
			<OperationFormHeader {schema} />
			<OperationFormArray {operationId} {schema} {currentId}/>
		{:else}
			<OperationFormArrayOptional {operationId} {schema} {currentId}/>
		{/if}
	{:else if schema.type === "object"}
		{#if required}
			<OperationFormObject {operationId} {schema} {required} {currentId}/>
		{:else}
			<OperationFormObjectOptional {operationId} {schema} {currentId}/>
		{/if}
	{:else if "anyOf" in schema}
		<OperationFormHeader {schema} />
		<OperationFormAnyOf {operationId} schemas={schema.anyOf} {currentId}/>
	{/if}
{:else}
	<div>
		<OperationFormInput id={operationId} name={currentId} {schema} {required}/>
		<!-- <OperationFormDeleteButton {itemId} {handleDelete} /> -->
	</div>
{/if}

