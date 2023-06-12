<script>
	import Header from './headers/Header.svelte'
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	export let title = null;
	export let description = null;
</script>

<div class="nested-form">
	<Header {title} {description} {schema} />
	{#each Object.entries(schema.properties) as [propertyId, property]}
		{@const _currentId = `${currentId}.${propertyId}` }
		{@const required = schema.required && schema.required.includes(propertyId) }
		<OperationFormBase {operationId} schema={property} {required} currentId={_currentId} />
	{/each}
</div>
