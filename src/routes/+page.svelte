<script>
	import showdown from "showdown";
	
	import { onMount } from 'svelte'
	import { loadOpenApiDocument } from "../lib.js";

	import OperationTabs from '../components/operation_tabs.svelte';


	let converter = new showdown.Converter();

	let promise = Promise.resolve(null);
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const openapiDocumentUrl = urlParams.get('openapi');
		promise = loadOpenApiDocument(openapiDocumentUrl);
	})
</script>

<div class="container">
	{#await promise}
		<h1>...Loading</h1>
	{:then openapi}
	{#if openapi}
	    <span style="font-size: 2.50rem">{openapi.info.title}</span>
	    &nbsp;
	    <span style="font-size: 1.25rem">{openapi.info.version}</span>
		{#if openapi.info.description}
	    	<hr>
			{@html converter.makeHtml(openapi.info.description)}
		{/if}
		<OperationTabs {openapi}/>
	{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
