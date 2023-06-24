<script>
	import OperationListItem from './OperationListItem.svelte';

	export let operation;
	export let response;
	export let handleClick;
	console.log(operation);
</script>

<div class="row">
	{#if operation.children}
		{#each operation.children as childrenOperation}
			<div class="col-4">
				<OperationListItem operation={childrenOperation.get} {handleClick} />
			</div>
		{/each}
	{/if}
</div>