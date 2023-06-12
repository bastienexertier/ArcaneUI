<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormArray from './OperationFormArray.svelte';
	import AddButton from './buttons/AddButton.svelte';

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
	<AddButton {handleAdd} />
{/if}
