<script>
	import Header from './headers/Header.svelte'

	import OperationFormObject from './OperationFormObject.svelte';
	import OperationFormArray from './OperationFormArray.svelte';
	import OperationFormAnyOf from './OperationFormAnyOf.svelte';
	import OperationFormInput from './OperationFormInput.svelte';
	import OperationFormObjectOptional from './OperationFormObjectOptional.svelte';
	import OperationFormArrayOptional from './OperationFormArrayOptional.svelte';
	
	import DeleteButton from './buttons/DeleteButton.svelte'

	export let operationId;
	export let schema;
	export let currentId;
	export let required;

	export let title = null;
	export let description = null;

	export let itemId = null;
	export let handleDelete = null;

	let isNested = schema.type === "array" || schema.type === "object" || "anyOf" in schema || "allOf" in schema;

	// console.log(currentId, required, schema);
</script>

{#if isNested}
	<!-- <DeleteButton {itemId} {handleDelete} /> -->
	{#if "allOf" in schema}
		{#each schema.allOf as subSchema}
			<svelte:self {operationId} schema={subSchema} {currentId} {required} title={schema.title} description={schema.description} />
		{/each}
	{:else if schema.type === "array"}
		{#if required}
			<OperationFormArray {operationId} {schema} {currentId} />
		{:else}
			<OperationFormArray {operationId} {schema} {currentId} />
			<!-- <OperationFormArrayOptional {operationId} {schema} {currentId} {title} {description} /> -->
		{/if}
	{:else if schema.type === "object"}
		{#if required}
			<OperationFormObject {operationId} {schema} {currentId} {title} {description} {handleDelete} />
		{:else}
			<OperationFormObjectOptional {operationId} {schema} {currentId} {title} {description} />
		{/if}
	{:else if "anyOf" in schema}
		<Header {title} {description} {schema} />
		<OperationFormAnyOf {operationId} schemas={schema.anyOf} {currentId} />
	{/if}
{:else}
	<OperationFormInput id={operationId} name={currentId} {schema} {required} />
{/if}

