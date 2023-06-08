<script>
	import { getInputType } from '../lib.js';

	import ActionFormInputBase from './action_form_input_base.svelte';
	import ActionFormInputSelect from './action_form_input_select.svelte';
	import ActionFormInputCheckbox from './action_form_input_checkbox.svelte';

	export let actionId;
	export let name;
	export let schema;

	let inputId = `${actionId}_${name}`;

	let title = schema.title;// || parameter.name;
	let description = schema.description;// || parameter.description;
	let required = schema.required || true;
</script>

{#if 'enum' in schema}
	<ActionFormInputSelect {inputId} {name} {title} {required} enumValues={schema.enum} {description}/>
{:else if schema.type == 'boolean'}
	<ActionFormInputCheckbox {inputId} {name} {title} {required} {description}/>
{:else}
	<ActionFormInputBase {inputId} {name} {title} {required} inputType={getInputType(schema)} {description}/>
{/if}
