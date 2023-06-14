<script>
	import { getInputType } from '/src/lib.js';

	import DefaultInput from './inputs/DefaultInput.svelte';
	import BooleanInput from './inputs/BooleanInput.svelte';
	import EnumInput from './inputs/EnumInput.svelte';

	export let id;
	export let name;
	export let schema;
	export let required;

	let inputId = `${id}_${name}`;

	let title = schema.title || schema.name || name.split('.').slice(-1);// || parameter.name;
	let inputType = getInputType(schema);
</script>


<label for={inputId}>{title}</label>
{#if schema.enum}
	<EnumInput {inputId} {name} {required} enumValues={schema.enum}/>
{:else if schema.type == 'boolean'}
	<BooleanInput {inputId} {name} defaultValue={schema.default}/>
{:else}
	<DefaultInput {inputId} {name} {required} {inputType} defaultValue={schema.default}/>
{/if}
{#if schema.description}
	<small>{schema.description}</small>
{/if}
