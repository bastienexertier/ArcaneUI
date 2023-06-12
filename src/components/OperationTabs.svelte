<script>
	import { capitalizeFirstLetter } from '../lib.js';
	import OperationTab from '../components/OperationTab.svelte';

	export let openapi;

	let activeTag = openapi.tags[0];

	function handleClick(tag) {
		activeTag = tag;
	}
</script>

<ul>
	{#each openapi.tags as tag}
		<li class={activeTag.name === tag.name ? 'active' : ''}>
			<span on:click={() => handleClick(tag)}>{capitalizeFirstLetter(tag.name)} ({tag.operations.length})</span>
		</li>
	{/each}
</ul>

{#if activeTag}
{#key activeTag}
	<OperationTab {openapi} operations={activeTag.operations}/>
{/key}
{/if}


<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		border-bottom: 1px solid #363c48;
	}
	li {
		margin-bottom: -1px;
	}
	span {
		border: 1px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
	span:hover {
		border-color: dimgrey dimgrey lightgrey;
	}
	li.active > span {
		background-color: #363c48;
	}
</style>