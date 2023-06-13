<script>
	import ItemValue from './ItemValue.svelte';
	
	export let properties;
	export let content;
	export let handleGet;
</script>


<div class="table-responsive">
	<table class="col-12 table table-hover table-bordered" class:table-pointer={handleGet != null}>
		<thead>
			<tr>
				{#each Object.entries(properties) as [key, property]}
					<th>{property.title || key}</th>
				{/each}
			</tr>
		</thead>
		<tbody class="table-group-divider">
			{#each content as item}
				<tr on:click={() => handleGet(item)}>
					{#each Object.keys(properties) as propertyKey}
						<td><ItemValue property={properties[propertyKey]} value={item[propertyKey]} /></td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	table {
		color: white;
		border-color: dimgrey;
		width: 100%;
	}
	.table-hover > tbody > tr:hover > * {
		color: lightgrey;
	}
	.table-pointer {
		cursor: pointer
	}
</style>