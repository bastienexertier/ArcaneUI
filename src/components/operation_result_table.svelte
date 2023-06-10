<script>
	import OperationResultValue from './operation_result_value.svelte';
	
	export let properties;
	export let content;
	export let handleGet;
	export let getOperation;
</script>


<table class="table table-hover table-bordered" class:table-pointer={getOperation != null}>
	<thead>
		<tr>
			{#each Object.entries(properties) as [key, property]}
				<th>{property.title || key}</th>
			{/each}
		</tr>
	</thead>
	<tbody class="table-group-divider">
		{#each content as item}
			<tr on:click={() => getOperation && handleGet(getOperation, item)}>
				{#each Object.keys(properties) as propertyKey}
					<td><OperationResultValue property={properties[propertyKey]} value={item[propertyKey]} /></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		color: white;
		border-color: dimgrey;
	}
	.table-hover > tbody > tr:hover > * {
		color: lightgrey;
	}
	.table-pointer {
		cursor: pointer
	}
</style>