<script>
	import OpenAPIParser from "@readme/openapi-parser";
	import { defaultMap } from "../lib.js";

	import ActionTab from '../components/action_tab.svelte';

	let url = 'http://localhost:8000';

	async function generate() {
		let openapiDocumentUrl = `${url}/openapi.json`;
		//let openapiDocumentUrl = 'http://localhost:8000/file/swagger.json';
		//let openapiDocumentUrl = 'https://petstore.swagger.io/v2/swagger.json';

		let response = await fetch(openapiDocumentUrl, {mode: 'cors', referrerPolicy: 'no-referrer'});
		let openapi = await OpenAPIParser.dereference(await response.json());

		// doc.components = doc.components || {schemas: {}};

		let actionsPerTag = defaultMap(() => []);

		for (let [path, endpoint] of Object.entries(openapi.paths)) {
			for (let [method, action] of Object.entries(endpoint)) {
				action.path = path;
				action.endpoint = endpoint;
				action.method = method;
				action.parameters = action.parameters || [];
				if (action.tags) {
					for (let tag of action.tags) {
						actionsPerTag[tag].push(action);
					}
				} else {
					actionsPerTag['other'].push(action);
				}
			}
		}

		console.log(openapi);
		return [openapi, actionsPerTag];
	}

	let promise = generate();

</script>

<div class="container">
	{#await promise}
		<h1>...Loading</h1>
	{:then [openapi, actionsPerTag]}
	    <span style="font-size: 2.50rem">{openapi.info.title}</span>
	    &nbsp;
	    <span style="font-size: 1.25rem">{openapi.info.version}</span>
		{#if openapi.info.description}
			<p class="description">{openapi.info.description}</p>
		{/if}
		<ActionTab {url} {openapi} {actionsPerTag}/>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.description {
		font-style: italic;
	}
</style>