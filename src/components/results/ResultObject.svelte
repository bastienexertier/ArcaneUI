<script>
	import ItemValue from './ItemValue.svelte';
	
	export let properties;
	export let content;
</script>

<hr>
<table class="table table-borderless">
	<tbody>
		{#each Object.entries(properties) as [key, property]}
			<tr>
				<td>{property.title || key}:</td>
				<td><ItemValue type={property.type} value={content[key]} /></td>
			</tr>
		{/each}
	</tbody>
</table>


<style>
	table {
		color: white;
		border-color: dimgrey;
	}
	td:nth-child(1) {
		font-weight: 100;
		font-style: italic;
		text-align: right;
		white-space: nowrap;
		min-width: 20%;
	}
	td:nth-child(2) {
		width: 100%;
		font-weight: bold;
	}
</style>