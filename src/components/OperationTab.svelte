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
	let parameterValues = null;

	function handleOperationSelect(operation, content) {
		activeOperation = operation;
		parameterValues = content;

		let autoSubmit = !operation.requestBody && operation.parameters.every(p => p.name in content);
		showForm = !autoSubmit;
		if (autoSubmit) {
			operationResult = callOperation(openapi.server, openapi, activeOperation.path, activeOperation, parameterValues);
		} else {
			operationResult = null;
		}
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
			parameterValues = null;
		}
	}

	function handleClose() {
		showForm = true;
		operationResult = null;
		parameterValues = null;
	}

	function handleDelete(url, deleteOperation) {
		if (!confirm('Do you really want to delete this item?')) {return;}
		showForm = true;
		operationResult = callEndpoint(url, 'delete', {});
		operationResult = null;
		parameterValues = null;
	}

	let resultHandlers = {
		get: handleOperationSelect,
		delete: handleDelete,
		close: handleClose
	};
</script>

<div class="row">
	<div class="col-3 mb-5">
		{#each operations as operation (operation.operationId)}
			<OperationListItem {operation} {handleOperationSelect} isActive={operation == activeOperation} />
		{/each}
	</div>

	<div class="col-9 mb-5">
		{#if activeOperation && showForm}
		{#key activeOperation}
	    	<OperationForm operation={activeOperation} {parameterValues} {handleSubmit} {handleFormClose}/>
		{/key}
		{/if}

    	{#if operationResult}
		{#await operationResult then {content, response}}
			<OperationResult {openapi} operation={activeOperation} {content} {response} handlers={resultHandlers} />
			<OperationResultMenu operation={activeOperation} {response} handleMenuClick={operation => handleOperationSelect(operation, content)} />
		{/await}
		{/if}
	</div>
</div>

