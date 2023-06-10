<script>
	import OperationFormBase from './OperationFormBase.svelte';
	import OperationFormInput from './OperationFormInput.svelte';

	export let operation;
	export let handleSubmit;

	let operationName = operation.summary || operation.operationId;
	let bodySchema = null;

	if (operation.requestBody) {
		bodySchema = operation.requestBody.content['application/json'].schema;
	}
</script>

<div class="mt-3 p-2 box text-white"><!--  sticky-top"> -->
	<h4>{operationName}</h4>
	{#if operation.description}<span>{operation.description}</span>{/if}
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
				<OperationFormBase schema={bodySchema} operationId={operation.operationId} />
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
</style>

