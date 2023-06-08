<script>
	export let url;
	export let action;
	export let openapi;
	export let handleClick;

	let bootstrapClassName = {
		"get": "primary",
		"post": "success",
		"delete": "danger",
		"put": "info"
	}[action.method.toLowerCase()];

	let actionName = action.summary || action.operationId;
</script>

<div class="mt-3 p-2 box action text-white border-{bootstrapClassName}" on:click={() => handleClick(action)}>
	<div>
		<h5>{actionName}</h5>
		{#if action.deprecated}
			<span class="card-text deprecated">Do not use!</span>
		{/if}
		{#if action.description}
			<hr>
			<div class="card-text description">{action.description}</div>
		{/if}
	</div>
</div>

<style>
	hr {
		margin: 0 0 8px 0;
	}
	.action {
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
</style>

