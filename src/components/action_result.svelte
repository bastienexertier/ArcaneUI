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

	let schema = action.responses[response.status].content['application/json'].schema || schemaFromObject(result);
	if (Object.keys(schema).length === 0) {schema = schemaFromObject(result);}

	//console.log(action, response);
	//console.log(schema, schemaFromObject(result), result);

	//let schemaTitle = action.responses[200].content['application/json'].schema.title;
	let title = 'Result';
	if (response.status in action.responses) {
		title = action.responses[response.status].description;
	}
</script>


<div class="mt-3 p-2 box text-white result border-{bootstrapClassName}">
	<h5>{title}</h5>
	{#if result.length != 0}
		<table>
		{#if schema.type === "array"}
			<tr>
				{#each Object.entries(schema.items.properties) as [key, property]}
					<th>{property.title}</th>
				{/each}
			</tr>
			{#each result as item}
				<tr>
					{#each Object.keys(schema.items.properties) as propertyKey}
						<td>{item[propertyKey]}</td>
					{/each}
				</tr>
			{/each}
		{:else}
			<tr>
				{#each Object.entries(schema.properties) as [key, property]}
					<th>{property.title}</th>
				{/each}
			</tr>
			<tr>
				{#each Object.keys(schema.properties) as propertyKey}
					<td>{result[propertyKey]}</td>
				{/each}
			</tr>
		{/if}
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