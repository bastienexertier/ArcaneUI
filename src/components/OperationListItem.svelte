<script>
	export let operation;
	export let handleClick;
	export let isActive = false;

	let bootstrapClassName = {
		"get": "primary",
		"post": "success",
		"delete": "danger",
		"put": "info"
	}[operation.method.toLowerCase()];

	let actionName = operation.summary || operation.operationId;
</script>

<div class:active={isActive} class="mt-3 p-2 box operation-item border-{bootstrapClassName}" on:click={() => handleClick(operation)} >
	<div>
		<h5>{actionName}</h5>
		{#if operation.deprecated}
			<span class="card-text deprecated">Do not use!</span>
		{/if}
	</div>
</div>

<style>
	hr {
		margin: 0 0 8px 0;
	}
	.operation-item {
		cursor: pointer;
		border-bottom: 7px solid;
	}
	.deprecated {
		font-size: 0.9rem;
		font-style: italic;
	}
	.description {
		white-space: pre-line;
	}
	.active {
		background-color: #4c5566;
	}
</style>
