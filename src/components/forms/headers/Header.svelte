<script>
	import AddButton from '../buttons/AddButton.svelte';
	import DeleteButton from '../buttons/DeleteButton.svelte';

	export let schema;
	export let title = null;
	export let description = null;

	export let handleAdd = null;
	export let handleDelete = null;

	title = title || schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name);
	description = description || schema.description;
</script>

<div class="d-flex align-items-center justify-content-between">
	{#if title}
		<span class="title">{title}</span>
		{#if description}
			<span class="help">({description})</span>
		{/if}
	{/if}
	<div>
		{#if handleAdd}
			<AddButton {handleAdd} />
		{/if}
		{#if handleDelete}
			<DeleteButton {handleDelete} />
		{/if}
	</div>
</div>

<style>
	.title {
		font-size: 1.25rem;
	}
	.help {
		color: darkgrey;
		font-size: 0.75rem;
		font-style: italic;
	}
</style>