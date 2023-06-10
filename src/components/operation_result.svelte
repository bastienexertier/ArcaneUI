<script>
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";
	import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";

	import { schemaFromObject } from '../lib.js';

	export let operation;
	export let content;
	export let response;
	export let handleClose;
	export let handleDelete;

	let bootstrapClassName = {
		2: "success",
		5: "danger",
		4: "warning"
	}[Math.floor(response.status/100)];

	let responseType = operation.responses[response.status];
	let schema = responseType && responseType.content && responseType.content['application/json'].schema || schemaFromObject(content);

	if (Object.keys(schema).length === 0) {
		schema = schemaFromObject(content);
	}

	console.log(operation, response);
	//console.log(schema, schemaFromObject(result), result);

	//let schemaTitle = operation.responses[200].content['application/json'].schema.title;
	let title = response.statusText;
	if (response.status in operation.responses) {
		title = operation.responses[response.status].description;
	}

	let deleteOperation = operation.endpoint.delete;
	//console.log(deleteOperation);
</script>


<div class="my-3 p-2 box text-white result border-{response.ok? 'success':'danger'}">
	<div class="d-flex flex-row justify-content-between">
		<h5>{title}</h5>
		<div class="d-flex icons">
			{#if deleteOperation && response.ok}
			<div on:click={() => handleDelete(response.url, deleteOperation)}><TrashFill width={22} height={22} /></div>
			{/if}
			<div on:click={() => handleClose()}><XCircleFill width={22} height={22} /></div>
		</div>
	</div>
	{#if content.length != 0}
		<table>
		{#if schema.type === "array"}
			<tr>
				{#each Object.entries(schema.items.properties) as [key, property]}
					<th>{property.title || key}</th>
				{/each}
			</tr>
			{#each content as item}
				<tr>
					{#each Object.keys(schema.items.properties) as propertyKey}
						<td>{item[propertyKey]}</td>
					{/each}
				</tr>
			{/each}
		{:else}
			<tr>
				{#each Object.entries(schema.properties) as [key, property]}
					<th>{property.title || key}</th>
				{/each}
			</tr>
			<tr>
				{#each Object.keys(schema.properties) as propertyKey}
					<td>{content[propertyKey]}</td>
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
	.icons div {
		cursor: pointer;
		margin-right: .5rem !important;
		margin-left: .5rem !important;
	}
</style>