<script>
	import { getInputType } from '../lib.js';

	import ActionFormInputBase from './action_form_input_base.svelte';
	import ActionFormInputSelect from './action_form_input_select.svelte';
	import ActionFormInputCheckbox from './action_form_input_checkbox.svelte';

	export let actionId;
	export let parameter;

	let inputId = `${actionId}_${parameter.name}`;

	let id = parameter.name;
	let name = parameter.schema.title || parameter.name;
	let description = parameter.schema.description || parameter.description;
	let required = parameter.schema.required;
</script>

{#if 'enum' in parameter.schema}
	<ActionFormInputSelect {inputId} {id} {name} {required} enumValues={parameter.schema.enum} {description}/>
{:else if parameter.schema.type == 'boolean'}
	<ActionFormInputCheckbox {inputId} {id} {name} {required} {description}/>
{:else}
	<ActionFormInputBase {inputId} {id} {name} {required} inputType={getInputType(parameter.schema)} {description}/>
{/if}
