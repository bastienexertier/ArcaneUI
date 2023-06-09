<script>
	import { getInputType } from '../lib.js';

	import OperationFormInputBase from './operation_form_input_base.svelte';
	import OperationFormInputSelect from './operation_form_input_select.svelte';
	import OperationFormInputCheckbox from './operation_form_input_checkbox.svelte';

	export let id;
	export let name;
	export let schema;

	let inputId = `${id}_${name}`;

	let title = schema.title || schema.name || name;// || parameter.name;
	let required = schema.required || !('default' in schema);
	let inputType = getInputType(schema);
</script>

{#if schema.enum}
	<OperationFormInputSelect {inputId} {name} {title} {required} enumValues={schema.enum} description={schema.description}/>
{:else if schema.type == 'boolean'}
	<OperationFormInputCheckbox {inputId} {name} {title} {required} description={schema.description}/>
{:else}
	<OperationFormInputBase {inputId} {name} {title} {required} {inputType} description={schema.description} defaultValue={schema.default}/>
{/if}
