<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormArray from './OperationFormArray.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	let enabled = false;

	const handleAdd = () => enabled = true;

	console.log(schema);
</script>

<OperationFormHeader {schema} />

{#if enabled}
	<OperationFormArray {operationId} {schema} {currentId} />
{:else}
	<div>
		<div class="btn-add" on:click={handleAdd}>
			<PlusCircleFill width={22} height={22} />
		</div>
	</div>
{/if}

<style>
	.btn-add {
		text-align: center;
	}
</style>