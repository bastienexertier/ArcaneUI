<script>
	import InputSelector from './inputs/InputSelector.svelte';

	export let id;
	export let name;
	export let schema;
	export let required;

	let inputId = `${id}_${name}`;

	let title = schema.title || schema.name || name.split('.').slice(-1);// || parameter.name;
</script>

<label for={inputId}>{title}</label>
<InputSelector {inputId} {schema} {name} {required} />
{#if schema.description}
	<small>{schema.description}</small>
{/if}
