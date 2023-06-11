<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormBase from './OperationFormBase.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	let enabled = false;

	const handleAdd = () => enabled = true;
	const handleDelete = () => enabled = false;
</script>


{#if enabled}
	<OperationFormBase {operationId} {schema} required={true} {currentId} {handleDelete} />
{:else}
	<OperationFormHeader {schema} />
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