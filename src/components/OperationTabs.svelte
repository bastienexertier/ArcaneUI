<script>
	import { capitalizeFirstLetter } from '../lib.js';
	import OperationTab from '../components/OperationTab.svelte';

	export let openapi;

	let urlAnchor = window.location.hash.substr(1);
	let activeTag = openapi.tags.find(t => t.name === urlAnchor) || openapi.tags[0];

	function handleClick(tag) {
		activeTag = tag;
	}
</script>

<ul id="top">
	{#each openapi.tags as tag}
		<li class={activeTag.name === tag.name ? 'active' : ''}>
			<a href=#{tag.name} on:click={() => handleClick(tag)}>{capitalizeFirstLetter(tag.name)} ({tag.operations.length})</a>
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
	a {
		color: white;
		text-decoration: none;
		border: 1px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
	a:hover {
		border-color: dimgrey dimgrey lightgrey;
	}
	li.active > a {
		background-color: #363c48;
	}
</style>