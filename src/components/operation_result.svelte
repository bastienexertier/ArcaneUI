<script>
	import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
	import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	import OperationResultTable from './operation_result_table.svelte';
	import OperationResultValue from './operation_result_value.svelte';

	import { schemaFromObject } from '../lib.js';

	export let operation;
	export let content;
	export let response;
	export let handleClose;
	export let handleDelete;

	let responseType = operation.responses[response.status];
	let schema = responseType && responseType.content && responseType.content['application/json'].schema || schemaFromObject(content);

	if (Object.keys(schema).length === 0) {
		schema = schemaFromObject(content);
	}

	//console.log(operation, response);
	//console.log(schema, schemaFromObject(content), content);

	//let schemaTitle = operation.responses[200].content['application/json'].schema.title;
	let title = response.statusText;
	if (response.status in operation.responses) {
		title = operation.responses[response.status].description;
	}

	let deleteOperation = operation.endpoint.delete;
	let updateOperation = operation.endpoint.put;
</script>


<div class="my-3 p-2 box text-white result border-{response.ok? 'success':'danger'}">
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
	{#if content.length != 0}
		{#if schema.type === "array"}
			<OperationResultTable properties={schema.items.properties} content={content} />
		{:else}
			<OperationResultTable properties={schema.properties} content={[content]} />
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