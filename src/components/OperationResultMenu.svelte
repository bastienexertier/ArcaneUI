<script>
	import { capitalizeFirstLetter } from '../lib.js';
	import OperationListItem from './OperationListItem.svelte';

	export let operation;
	export let response;
	export let handleMenuClick;

	let operationsPerTag = {};
	let otherOperations = [];
	for (let op of operation.endpoint.children) {
		if (op.path == operation.path && op.method == operation.method) {
			continue;
		}
		if (!op.tags || op.tags.length == 0) {
			otherOperations.push(op);
			continue;
		}
		for (let tag of op.tags) {
			let tagName = tag;
			if (tagName[0] == '_') {
				if(tagName[1] == '_') {
					continue;
				}
				tagName = tagName.slice(1);
			}
			if (!(tagName in operationsPerTag)) {
				operationsPerTag[tagName] = [];
			}
			operationsPerTag[tagName].push(op);
		}
	}
	if (otherOperations.length > 0) {
		if (!('other' in operationsPerTag)) {
			operationsPerTag['other'] = otherOperations;
		} else {
			operationsPerTag['other'].push(...otherOperations);
		}
	}
</script>

<div class="row px-4">
	{#each Object.entries(operationsPerTag) as [tag, operations]}
		<h5 class="mt-4">{capitalizeFirstLetter(tag)}</h5>
		<hr>
		{#each operations as childOperation (childOperation.operationId)}
			<div class="col-4">
				<OperationListItem operation={childOperation} handleOperationSelect={handleMenuClick} />
			</div>
		{/each}
	{/each}
</div>