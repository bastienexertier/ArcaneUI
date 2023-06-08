<script>
	import { callEndpoint } from '../lib.js';

	import Action from '../components/action.svelte';
	import ActionForm from './action_form.svelte';
	import ActionResult from './action_result.svelte';

	export let url;
	export let openapi;
	export let actions;

	let activeAction = null;
	let promise = Promise.resolve(null);

	function handleClick(action) {
		activeAction = action;
		promise = Promise.resolve(null);
	}

	function handleSubmit(e) {
		const formData = new FormData(e.target);
	    promise = callEndpoint(url, openapi, activeAction, formData);
	}
</script>

<div class="row">
	<div class="col-3">
		{#each actions as action (action.operationId)}
			<Action {url} {action} {openapi} {handleClick}/>
		{/each}
	</div>

	{#if activeAction}
	{#key activeAction}
		<div class="col-9">
	    	<ActionForm action={activeAction} handleSubmit={handleSubmit}/>

			{#await promise then res}
			{#if res}
				<ActionResult action={activeAction} result={res.content} response={res.response}/>
			{/if}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
	    </div>
	{/key}
	{/if}
</div>

