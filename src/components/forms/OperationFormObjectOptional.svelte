<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import OperationFormHeader from './OperationFormHeader.svelte'
	import OperationFormBase from './OperationFormBase.svelte';
	import AddButton from './buttons/AddButton.svelte';

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
	<AddButton {handleAdd} />
{/if}
