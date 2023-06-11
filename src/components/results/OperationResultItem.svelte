<script>
	import OperationResultValue from './OperationResultValue.svelte';
	
	export let properties;
	export let content;
</script>

<hr>
<table class="table table-borderless">
	<tbody>
		{#each Object.entries(properties) as [key, property]}
			<tr>
				<td>{property.title || key}:</td>
				<td><OperationResultValue {property} value={content[key]} /></td>
			</tr>
		{/each}
	</tbody>
</table>


<style>
	hr {
		margin: 0 0 8px 0;
	}
	table {
		color: white;
		border-color: dimgrey;
	}
	td:nth-child(1) {
		font-weight: 100;
		font-style: italic;
		text-align: right;
		white-space: nowrap;
	}
	td:nth-child(2) {
		width: 100%;
		font-weight: bold;
	}
</style>