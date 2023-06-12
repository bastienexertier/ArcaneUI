<script>
	import OperationFormHeader from './OperationFormHeader.svelte'

	import OperationFormObject from './OperationFormObject.svelte';
	import OperationFormArray from './OperationFormArray.svelte';
	import OperationFormAnyOf from './OperationFormAnyOf.svelte';
	import OperationFormInput from './OperationFormInput.svelte';
	import OperationFormObjectOptional from './OperationFormObjectOptional.svelte';
	import OperationFormArrayOptional from './OperationFormArrayOptional.svelte';
	
	import DeleteButton from './buttons/DeleteButton.svelte'

	export let operationId;
	export let schema;
	export let required;
	export let currentId = "";

	export let itemId = null;
	export let handleDelete = null;

	let isNested = schema.type === "array" || schema.type === "object" || "anyOf" in schema || "allOf" in schema;
	let title = schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name);

	console.log(title, required, schema);
</script>

{#if isNested}
	<DeleteButton {itemId} {handleDelete} />
	{#if "allOf" in schema}
		{#each schema.allOf as subSchema}
			<svelte:self {operationId} schema={subSchema} {currentId} required/>
		{/each}
	{:else if schema.type === "array"}
		{#if required}
			<OperationFormHeader {schema} />
			<OperationFormArray {operationId} {schema} {currentId}/>
		{:else}
			<OperationFormArrayOptional {operationId} {schema} {currentId}/>
		{/if}
	{:else if schema.type === "object"}
		{#if required}
			<OperationFormObject {operationId} {schema} {currentId}/>
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
		<!-- <DeleteButton {itemId} {handleDelete} /> -->
	</div>
{/if}

