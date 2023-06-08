<script>
	import { schemaFromObject } from '../lib.js';

	export let result;
	export let action;
	export let response;

	let bootstrapClassName = {
		2: "success",
		5: "danger",
		4: "warning"
	}[Math.floor(response.status/100)];

	let schema = action.responses[response.status].content['application/json'].schema;

	//console.log(action, response);
	console.log(schema);

	//let schemaTitle = action.responses[200].content['application/json'].schema.title;
	let title = 'Result';
	if (response.status in action.responses) {
		title = action.responses[response.status].description;
	}
	let resultEntries = Object.entries(result);
	let properties = schema.properties || schemaFromObject(result);
</script>


<div class="mt-3 p-2 box text-white result border-{bootstrapClassName}">
	<h5>{title}</h5>
	{#if resultEntries.length}
		<table>
			<tr>
				{#each Object.entries(properties) as [key, property]}
					<th>{property.title}</th>
				{/each}
			</tr>
			<tr>
				{#each resultEntries as [_, fieldvalue]}
					<th>{fieldvalue}</th>
				{/each}
			</tr>
		</table>
	{:else}
		{response.statusText}
	{/if}
</div>


<style>
	hr {
		margin: 0 0 8px 0;
	}
	table {
		width: 100%;
	}
	table, th, td {
		padding: 3px 10px;
		border: 1px solid black;
		border-collapse: collapse;
		border-color: dimgrey;
	}
	.result {
		border-top: 7px solid;
	}
</style>