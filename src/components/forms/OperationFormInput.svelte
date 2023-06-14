<script>
	import InputSelector from './inputs/InputSelector.svelte';

	export let id;
	export let name;
	export let schema;
	export let required;

	let inputId = `${id}_${name}`;

	let title = schema.title || schema.name || name.split('.').slice(-1);// || parameter.name;
</script>

<div class="row">
	<label class="col-3" for={inputId}>{title}</label>
	<div class="col-7">
		<InputSelector {inputId} {schema} {name} {required} />
	</div>
	{#if schema.description}
		<div class="d-flex justify-content-center">
			<small>{schema.description}</small>
		</div>
	{/if}
</div>

<style>
	.row {
		margin-bottom: 3px;
	}
	.row label {
		font-weight: 100;
		font-style: italic;
		text-align: right;
		white-space: nowrap;
		line-height: 40px;
	}
	small {
		color: darkgrey;
		font-size: 0.75rem;
		font-style: italic;
		display: block;
		text-align: center;
	}
</style>
