<script>
	export let schema;
</script>

<span class="title">{schema.title || (schema.xml && schema.xml.name) || (schema.items && schema.items.xml && schema.items.xml.name)}</span>
{#if schema.description}<span class="help">({schema.description})</span>{/if}

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