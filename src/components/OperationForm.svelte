<script>
	import { onMount } from 'svelte';
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	import OperationDescription from './OperationDescription.svelte';
	import ParametersForm from './forms/ParametersForm.svelte';
	import OperationFormBase from './forms/OperationFormBase.svelte';
	import OperationFormInput from './forms/OperationFormInput.svelte';
	import InputSelector from './forms/inputs/InputSelector.svelte';

	export let operation;
	export let parameterValues;
	export let handleSubmit;
	export let handleFormClose;

	let operationName = operation.summary || operation.operationId;
	let bodySchema = null;
	let bodySchemaRequired = true

	onMount(() => {
		let resultElement = document.getElementById('top');
		if (document.documentElement.scrollTop > resultElement.offsetTop)
			resultElement.scrollIntoView();
	});

	if (operation.requestBody) {
		bodySchema = operation.requestBody.content['application/json'].schema;
		bodySchemaRequired = operation.requestBody.required || false; // absent means non required
	}
</script>

<div id="form" class="mt-3 p-2 box text-white">
	<div class="d-flex flex-row justify-content-between">
		<h4>{operationName}</h4>
		<div class="d-flex icons">
			<button on:click|preventDefault={() => handleFormClose()}>
				<XCircleFill width={22} height={22} />
			</button>
		</div>
	</div>
	{#if operation.description}
		<OperationDescription description={operation.description} />
	{/if}
	<hr>
	<form on:submit|preventDefault={handleSubmit}>
		{#if operation.parameters && operation.parameters.length > 0}
			<ParametersForm parameters={operation.parameters} {parameterValues} />
		{/if}

		{#if bodySchema}
			<div>
				<OperationFormBase schema={bodySchema} operationId={operation.operationId} required={bodySchemaRequired} currentId={"body"} />
			</div>
		{/if}

		<div class="button-wrapper">
			<button type="submit" class="btn btn-outline-light">Ok</button>
		</div>
	</form>
</div>

<style>
	hr {
		margin: 0 0 8px 0;
	}
	.button-wrapper {
		display: flex;
		justify-content: space-around;
		margin-top: 15px;
		margin-bottom: 15px;
	}
	button {
		width: 15%;
	}
	.icons button {
		all: unset;
		cursor: pointer;
		margin-right: .5rem !important;
		margin-left: .5rem !important;
	}
	form {
		margin-top: 15px;
	}
</style>

