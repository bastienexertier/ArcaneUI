<script>
	import { onMount } from 'svelte';

	import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
	import TrashFill from "svelte-bootstrap-icons/lib/TrashFill.svelte";
	import XCircleFill from "svelte-bootstrap-icons/lib/XCircleFill.svelte";

	import ResultEmpty from './results/ResultEmpty.svelte';
	import ResultObject from './results/ResultObject.svelte';
	import ResultArrayOfObjects from './results/ResultArrayOfObjects.svelte';
	import ResultArrayOfValues from './results/ResultArrayOfValues.svelte';

	import { getOperationCurrentResponse, getResponseSchema, chooseBestSchema, createGetHandler } from '../lib.js';

	export let openapi;
	export let operation;
	export let content;
	export let response;
	export let handlers;

	onMount(() => {
		let elementToScrollTo;
		let formElement = document.getElementById('form');
		if (formElement) {
			elementToScrollTo = document.getElementById('result');
		} else {
			elementToScrollTo = document.getElementById('top')
		}
		elementToScrollTo.scrollIntoView();
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
		<div>
			<h4>{title}</h4>
			{#if schema && schema.description}<span>{schema.description}</span>{/if}
		</div>
		<div class="d-flex icons">
			{#if response.ok}
				{#if updateOperation && false}
					<button on:click|preventDefault={() => handlers.delete(response.url, deleteOperation)}>
						<PencilSquare width={22} height={22} />
					</button>
				{/if}
				{#if deleteOperation}
					<button on:click|preventDefault={() => handlers.delete(response.url, deleteOperation)}>
						<TrashFill width={22} height={22} />
					</button>
				{/if}
			{/if}
			<button on:click|preventDefault={() => handlers.close()}><XCircleFill width={22} height={22} /></button>
		</div>
	</div>
	{#if content === null}
		<ResultEmpty />
	{:else}
		{#if schema.type === "array"}
			{#if schema.items.properties}
				<ResultArrayOfObjects {properties} {content} {handleGet} />
			{:else}
				<ResultArrayOfValues schema={schema.items} {content} />
			{/if}
		{:else if schema.type === "object"}
			<ResultObject {properties} {content} />
		{:else}
			{content}
		{/if}
	{/if}
</div>


<style>
	#result {
		border-top: 7px solid;
	}
	button {
		width: 15%;
	}
	.icons button {
		all: unset;
		cursor: pointer;
		margin-right: .5rem !important;
		margin-left: .5rem !important;
	}
</style>