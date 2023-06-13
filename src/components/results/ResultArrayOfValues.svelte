<script>
	import ItemValue from './ItemValue.svelte';
	
	export let schema;	
	export let content;
</script>


<div class="table-responsive">
	<table class="col-12 table table-hover table-bordered">
		<thead>
			<tr>
				<th>{schema.title || "Values"}</th>
			</tr>
		</thead>
		<tbody class="table-group-divider">
			{#each content as value}
				<tr>
					<td><ItemValue type={schema.type} {value} /></td>
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
</style>