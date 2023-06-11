<script>
	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schema;
	export let required;
	export let currentId;
</script>

<div class="nested-form">
	<OperationFormHeader {schema} />
	{#each Object.entries(schema.properties) as [propertyId, property]}
		<OperationFormBase {operationId} schema={property} required={schema.required.includes(propertyId)} currentId={`${currentId}.${propertyId}`}/>
	{/each}
</div>
