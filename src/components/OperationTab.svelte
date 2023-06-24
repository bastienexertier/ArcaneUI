<script>
	import { callOperation, callEndpoint, unflattenFormData } from '../lib.js';

	import OperationListItem from './OperationListItem.svelte';
	import OperationForm from './OperationForm.svelte';
	import OperationResult from './OperationResult.svelte';
	import OperationResultMenu from './OperationResultMenu.svelte';

	export let openapi;
	export let operations;

	let showForm = true;
	let activeOperation = null;
	let operationResult = null;

	function handleClick(operation) {
		showForm = true;
		activeOperation = operation;
		operationResult = null;
	}

	function handleGet(getUrl, getOperation, content) {
		showForm = false;
		activeOperation = getOperation;
		operationResult = callOperation(openapi.server, openapi, getUrl, getOperation, content);
	}

	function handleSubmit(e) {
		let data = new FormData(e.target);
		let content = unflattenFormData(data.entries());
	    operationResult = callOperation(openapi.server, openapi, activeOperation.path, activeOperation, content);
	}

	function handleFormClose() {
		if (operationResult) {
			showForm = false;
		} else {
			activeOperation = null;
		}
	}

	function handleClose() {
		showForm = true;
		operationResult = null;
	}

	function handleDelete(url, deleteOperation) {
		if (!confirm('Do you really want to delete this item?')) {return;}
		showForm = true;
		operationResult = callEndpoint(url, 'delete', {});
		operationResult = null;
	}

	let resultHandlers = {
		get: handleGet,
		delete: handleDelete,
		close: handleClose
	};
</script>

<div class="row">
	<div class="col-3 mb-5">
		{#each operations as operation (operation.operationId)}
			<OperationListItem {operation} {handleClick} isActive={operation == activeOperation} />
		{/each}
	</div>

	<div class="col-9 mb-5">
		{#if activeOperation && showForm}
		{#key activeOperation}
	    	<OperationForm operation={activeOperation} {handleSubmit} {handleFormClose}/>
		{/key}
		{/if}

    	{#if operationResult}
		{#await operationResult then {content, response}}
			<OperationResult {openapi} operation={activeOperation} {content} {response} handlers={resultHandlers} />
			<OperationResultMenu operation={activeOperation} {handleClick} />
		{/await}
		{/if}
	</div>
</div>

