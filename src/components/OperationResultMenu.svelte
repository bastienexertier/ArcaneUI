<script>
	import OperationListItem from './OperationListItem.svelte';

	export let operation;
	export let response;
	export let handleClick;
	console.log(operation);
</script>

<div class="row">
	{#if operation.endpoint.children}
		{#each operation.endpoint.children as operation (operation.operationId)}
			<div class="col-4">
				<OperationListItem {operation} {handleClick} />
			</div>
		{/each}
	{/if}
</div>