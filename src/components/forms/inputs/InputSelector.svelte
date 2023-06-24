<script>
	import { getInputType } from '/src/lib.js';

	import DefaultInput from './DefaultInput.svelte';
	import BooleanInput from './BooleanInput.svelte';
	import EnumInput from './EnumInput.svelte';

	export let inputId;
	export let schema;
	export let name;
	export let required;
	export let defaultValue = null;

	let inputType = getInputType(schema);
</script>

{#if schema.enum}
	<EnumInput {inputId} {name} {required} enumValues={schema.enum}/>
{:else if schema.type == 'boolean'}
	<BooleanInput {inputId} {name} defaultValue={schema.default}/>
{:else}
	<DefaultInput {inputId} {name} {required} {inputType} {defaultValue} placeholder={schema.default}/>
{/if}
