<script>
	export let schema;
	let title = schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name);
</script>

{#if title}
	<span class="title">{title}</span>
	{#if schema.description}
		<span class="help">({schema.description})</span>
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