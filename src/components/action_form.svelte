<script>
	import ActionFormInput from '../components/action_form_input.svelte';
	import ActionFormBody from '../components/action_form_body.svelte';

	export let action;
	export let handleSubmit;

	let actionId = action.operationId;
	let actionName = action.summary || action.operationId;
	let bodySchema;

	if (action.requestBody) {
		bodySchema = action.requestBody.content['application/json'].schema;
	} else {
		bodySchema = null;
	}
</script>

<div class="mt-3 p-2 box text-white">
	<h4>{actionName}</h4>
	<hr>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="row">
			{#each action.parameters as parameter}
				<div class="col-3">
					<ActionFormInput {actionId} {parameter}/>
				</div>
			{/each}

			{#if bodySchema}
				{#each Object.entries(bodySchema.properties) as [propertyId, property]}
					<div class="col-3">
						<ActionFormBody {actionId} {propertyId} {property}/>
					</div>
				{/each}
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

