<script>
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	import OperationFormBase from './forms/OperationFormBase.svelte';
	import OperationFormInput from './forms/OperationFormInput.svelte';

	export let operation;
	export let handleSubmit;
	export let handleFormClose;

	let operationName = operation.summary || operation.operationId;
	let bodySchema = null;
	let bodySchemaRequired = true

	if (operation.requestBody) {
		bodySchema = operation.requestBody.content['application/json'].schema;
		bodySchemaRequired = operation.requestBody.required || true;
	}
</script>

<div class="mt-3 p-2 box text-white"><!--  sticky-top"> -->
	<div class="d-flex flex-row justify-content-between">
		<div>
			<h4>{operationName}</h4>
			{#if operation.description}<span>{operation.description}</span>{/if}
		</div>
		<div class="d-flex icons">
			<div on:click={() => handleFormClose()}><XCircleFill width={22} height={22} /></div>
		</div>
	</div>
	<hr>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="row">
			{#each operation.parameters as parameter}
				<div class="col-3">
					<OperationFormInput id={operation.operationId} name={'.'+parameter.name} schema={parameter.schema || parameter}/>
				</div>
			{/each}
		</div>

		<div>
			{#if bodySchema}
				<OperationFormBase schema={bodySchema} operationId={operation.operationId} required={bodySchemaRequired} />
			{/if}
		</div>

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
	}
	button {
		width: 15%;
	}
	.icons div {
		cursor: pointer;
		margin-right: .5rem !important;
		margin-left: .5rem !important;
	}
</style>

