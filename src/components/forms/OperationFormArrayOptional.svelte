<script>
	import PlusCircleFill from "svelte-bootstrap-icons/lib/PlusCircleFill.svelte";

	import Header from './headers/Header.svelte'
	import OperationFormArray from './OperationFormArray.svelte';
	import AddButton from './buttons/AddButton.svelte';

	export let operationId;
	export let schema;
	export let currentId;

	export let title = null;
	export let description = null;

	let enabled = false;

	const handleAdd = () => enabled = true;
</script>

<Header {title} {description} {schema} />

{#if enabled}
	<OperationFormArray {operationId} {schema} {currentId} />
{:else}
	<AddButton {handleAdd} />
{/if}
