<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import Header from './headers/Header.svelte'
	import OperationFormBase from './OperationFormBase.svelte';
	import AddButton from './buttons/AddButton.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	export let title = null;
	export let description = null;

	let enabled = false;

	const handleAdd = () => enabled = true;
	const handleDelete = () => enabled = false;

	console.log('ObjectOptional', schema, enabled);
</script>

{#if enabled}
	<OperationFormBase {operationId} {schema} {currentId} {title} {description} {handleDelete} />
{:else}
	<Header {title} {description} {schema} />
	<AddButton {handleAdd} />
{/if}
