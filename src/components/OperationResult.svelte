<script>
	import { onMount } from 'svelte';

	import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
	import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	import ResultObject from './results/ResultObject.svelte';
	import ResultArrayOfObjects from './results/ResultArrayOfObjects.svelte';
	import ResultArrayOfValues from './results/ResultArrayOfValues.svelte';

	import { getOperationCurrentResponse, getResponseSchema, chooseBestSchema, createGetHandler } from '../lib.js';

	export let openapi;
	export let operation;
	export let content;
	export let response;
	export let handlers;

	// onMount(() => window.scrollTo(0, 0));
	onMount(() => {
		let resultElement = document.getElementById('result');
		resultElement && resultElement.scrollIntoView();
	});

	response = response || { // kinda hacky
		ok: false,
		status: 500,
		statusText: 'An error occured on the backend!',
		url: ''
	}

	let operationCurrentResponse = getOperationCurrentResponse(operation, response);
	let schema = chooseBestSchema(getResponseSchema(operationCurrentResponse), content);

	let title = (operationCurrentResponse && operationCurrentResponse.description) || response.statusText;
	let properties = (schema.type === "array"? schema.items.properties: schema.properties) || null;

	let handleGet = createGetHandler(openapi, operation, properties, response.url, handlers.get);
	let deleteOperation = operation.endpoint.delete;
	let updateOperation = operation.endpoint.put;
</script>


<div id="result" class="mt-3 p-2 box text-white border-{response.ok? 'success':'danger'}">
	<div class="d-flex flex-row justify-content-between">
		<h4>{title}</h4>
		{#if schema && schema.description}<span>{schema.description}</span>{/if}
		<div class="d-flex icons">
			{#if response.ok}
				{#if updateOperation && false}
					<div on:click={() => handlers.delete(response.url, deleteOperation)}><PencilSquare width={22} height={22} /></div>
				{/if}
				{#if deleteOperation}
					<div on:click={() => handlers.delete(response.url, deleteOperation)}><TrashFill width={22} height={22} /></div>
				{/if}
			{/if}
			<div on:click={() => handlers.close()}><XCircleFill width={22} height={22} /></div>
		</div>
	</div>
	{#if content}
		{#if schema.type === "array"}
			{#if schema.items.properties}
				<ResultArrayOfObjects {properties} {content} {handleGet} />
			{:else}
				<ResultArrayOfValues schema={schema.items} {content} />
			{/if}
		{:else}
			<ResultObject {properties} {content} />
		{/if}
	{/if}
</div>


<style>
	#result {
		border-top: 7px solid;
	}
	.icons div {
		cursor: pointer;
		margin-right: .5rem !important;
		margin-left: .5rem !important;
	}
</style>