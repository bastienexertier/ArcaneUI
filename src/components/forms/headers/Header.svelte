<script>
	import Header from './Header.svelte';

	export let schema;
	export let title = null;
	export let description = null;

	title = title || schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name);
	description = description || schema.description;
</script>

{#if title}
	<span class="title">{title}</span>
	{#if description}
		<span class="help">({description})</span>
	{/if}
	<hr>
{/if}


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