<script>
	import Header from './headers/Header.svelte'
	import DeleteButton from './buttons/DeleteButton.svelte'
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	export let title = null;
	export let description = null;
	export let handleDelete = null;
</script>

<div class="nested-form">
	<div class="d-flex align-items-center justify-content-between">
		<Header {title} {description} {schema} />
		<DeleteButton {handleDelete} />
	</div>
	<hr>
	{#each Object.entries(schema.properties) as [propertyId, property]}
		{@const _currentId = `${currentId}.${propertyId}` }
		{@const required = schema.required && schema.required.includes(propertyId) }
		<OperationFormBase {operationId} schema={property} {required} currentId={_currentId} />
	{/each}
</div>
