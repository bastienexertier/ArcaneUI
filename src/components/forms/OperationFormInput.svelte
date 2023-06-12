<script>
	import { getInputType } from '/src/lib.js';

	import OperationFormInputBase from './inputs/OperationFormInputBase.svelte';
	import OperationFormInputSelect from './inputs/OperationFormInputSelect.svelte';
	import OperationFormInputCheckbox from './inputs/OperationFormInputCheckbox.svelte';

	export let id;
	export let name;
	export let schema;
	export let required;

	let inputId = `${id}_${name}`;

	let title = schema.title || schema.name || name.split('.').slice(-1);// || parameter.name;
	//let required = schema.required || !('default' in schema);
	let inputType = getInputType(schema);

	console.log(id, name, schema, required);
</script>


<label for={inputId}>{title}</label>
{#if schema.enum}
	<OperationFormInputSelect {inputId} {name} {required} enumValues={schema.enum}/>
{:else if schema.type == 'boolean'}
	<OperationFormInputCheckbox {inputId} {name} defaultValue={schema.default}/>
{:else}
	<OperationFormInputBase {inputId} {name} {required} {inputType} defaultValue={schema.default}/>
{/if}
{#if schema.description}
	<small>{schema.description}</small>
{/if}
