<script>
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schema;
	export let currentId;
</script>

{#each Object.entries(schema.properties) as [propertyId, property]}
	<OperationFormBase {operationId} schema={property} currentId={`${currentId}.${propertyId}`}/>
{/each}
