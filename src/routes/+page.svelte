<script>
	import { onMount } from 'svelte'
	import { loadOpenApiDocument, markdownConverter } from "../lib.js";

	import OperationTabs from '../components/OperationTabs.svelte';

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
			{@html markdownConverter.makeHtml(openapi.info.description)}
		{/if}
		<OperationTabs {openapi}/>
	{/if}
<!-- 	{:catch error}
		<p style="color: red">{error.message}</p> -->
	{/await}
</div>

<style>
	hr {
		margin: 4px 0 8px 0;
	}
</style>