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

	function handleClick(operation) {
		showForm = true;
		activeOperation = operation;
		operationResult = null;
		parameterValues = null;
	}

	function handleGet(getOperation, currentUrl, key, content, autoSubmit) {
		showForm = !autoSubmit;
		activeOperation = getOperation;
		parameterValues = {};
		parameterValues[key] = content[key];

		if (autoSubmit) {
			let getUrl = new URL(currentUrl).pathname.replace(/\/$/, '') + `/{${key}}`;
			operationResult = callOperation(openapi.server, openapi, getUrl, getOperation, content);
		} else {
			operationResult = null;
		}
	}

	function handleSubmit(e) {
		let data = new FormData(e.target);
		let content = unflattenFormData(data.entries());
	    operationResult = callOperation(openapi.server, openapi, activeOperation.path, activeOperation, content);
	    parameterValues = null;
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
	    	<OperationForm operation={activeOperation} {parameterValues} {handleSubmit} {handleFormClose}/>
		{/key}
		{/if}

    	{#if operationResult}
		{#await operationResult then {content, response}}
			<OperationResult {openapi} operation={activeOperation} {content} {response} handlers={resultHandlers} />
			<OperationResultMenu operation={activeOperation} {response} {handleClick} />
		{/await}
		{/if}
	</div>
</div>

