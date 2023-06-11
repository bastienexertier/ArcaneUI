<script>
	import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
	import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	import OperationResultItem from './results/OperationResultItem.svelte';
	import OperationResultTable from './results/OperationResultTable.svelte';

	import { schemaFromObject } from '../lib.js';

	export let openapi;
	export let operation;
	export let content;
	export let response;
	export let handleGet;
	export let handleClose;
	export let handleDelete;

	response = response || { // kinda hacky
		ok: false,
		status: 500,
		statusText: 'An error occured on the backend!',
		url: ''
	}

	let responseType = operation.responses[response.status];
	let schema = responseType && responseType.content && responseType.content['application/json'].schema;

	if (!schema || (!schema.properties && !(schema.items && schema.items.properties))) {
		schema = schemaFromObject(content);
	}

	//console.log(operation, response);
	//console.log(schema, schemaFromObject(content), content);

	//let schemaTitle = operation.responses[200].content['application/json'].schema.title;
	let title = response.statusText;
	if (response.status in operation.responses) {
		title = operation.responses[response.status].description;
	}

	let properties = schema.type === "array"? schema.items.properties: schema.properties;

	let operationPath = operation.path;//.replace(/\/$/, '');
	let getUrl = null;
	let getOperation = null;
	for (let key of Object.keys(properties)) {
		let endpoint = openapi.paths[operationPath + `/{${key}}`];
		if (endpoint && endpoint.get) {
			getOperation = endpoint.get;
			getUrl = new URL(response.url).pathname + `/{${key}}`;
			break;
		}
	}

	let deleteOperation = operation.endpoint.delete;
	let updateOperation = operation.endpoint.put;
</script>


<div class="mt-3 p-2 box text-white result border-{response.ok? 'success':'danger'}">
	<div class="d-flex flex-row justify-content-between">
		<h5>{title}</h5>
		<div class="d-flex icons">
			{#if response.ok}
				{#if updateOperation && false}
					<div on:click={() => handleDelete(response.url, deleteOperation)}><PencilSquare width={22} height={22} /></div>
				{/if}
				{#if deleteOperation}
					<div on:click={() => handleDelete(response.url, deleteOperation)}><TrashFill width={22} height={22} /></div>
				{/if}
			{/if}
			<div on:click={() => handleClose()}><XCircleFill width={22} height={22} /></div>
		</div>
	</div>
	{#if content}
		{#if schema.type === "array"}
			<OperationResultTable {properties} {content} {handleGet} {getUrl} {getOperation}/>
		{:else}
			<OperationResultItem {properties} {content}/>
		{/if}
	{:else}
		{response.statusText}
	{/if}
</div>


<style>
	.result {
		border-top: 7px solid;
	}
	.icons div {
		cursor: pointer;
		margin-right: .5rem !important;
		margin-left: .5rem !important;
	}
</style>