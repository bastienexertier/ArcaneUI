<script>
	import { callOperation, callEndpoint } from '../lib.js';

	import OperationListItem from './operation_list_item.svelte';
	import OperationForm from './operation_form.svelte';
	import OperationResult from './operation_result.svelte';

	export let openapi;
	export let operations;

	let activeOperation = null;
	let operationResult = null;

	function handleClick(operation) {
		activeOperation = operation;
		operationResult = null;
	}

	function handleSubmit(e) {
		const formData = new FormData(e.target);
	    operationResult = callOperation(openapi.server, openapi, activeOperation, formData);
	}

	function handleClose() {
		operationResult = null;
	}

	function handleDelete(url, deleteOperation) {
		if (confirm('Do you really want to delete this item?')) {
			//activeOperation = deleteOperation;
			operationResult = callEndpoint(url, 'delete', {});
			operationResult = null;
		}
	}
</script>

<div class="row">
	<div class="col-3">
		{#each operations as operation (operation.operationId)}
			<OperationListItem operation={operation} {openapi} {handleClick}/>
		{/each}
	</div>

	{#if activeOperation}
	{#key activeOperation}
		<div class="col-9">
	    	<OperationForm operation={activeOperation} handleSubmit={handleSubmit}/>

	    	{#if operationResult}
			{#await operationResult then {content, response}}
				<OperationResult operation={activeOperation} {content} {response} {handleClose} {handleDelete}/>
			{/await}
			{/if}
	    </div>
	{/key}
	{/if}
</div>

