<script>
	import OperationFormBase from './operation_form_base.svelte';
	import OperationFormInput from './operation_form_input.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	let arrayLength = 0;
</script>

{#each Array(arrayLength) as _, i}
	<OperationFormBase {operationId} schema={schema.items} currentId={`${currentId}.${i}`} />
	<button type="button" class="btn btn-sm btn-outline-light" on:click={() => arrayLength = Math.max(arrayLength - 1, 0)}>Remove</button>
{/each}

<button type="button" class="btn btn-sm btn-outline-light" on:click={() => arrayLength += 1}>Add</button>

