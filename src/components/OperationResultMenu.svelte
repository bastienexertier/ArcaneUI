<script>
	import OperationListItem from './OperationListItem.svelte';

	export let operation;
	export let response;
	export let handleMenuClick;
</script>

<div class="row">
	{#if operation.endpoint.children}
		{#each operation.endpoint.children as childOperation (childOperation.operationId)}
			{#if childOperation.path != operation.path || childOperation.method != operation.method}
				<div class="col-4">
					<OperationListItem operation={childOperation} handleOperationSelect={handleMenuClick} />
				</div>
			{/if}
		{/each}
	{/if}
</div>