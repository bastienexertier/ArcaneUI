<script>
	import { capitalizeFirstLetter } from '../lib.js';
	import ActionPage from '../components/action_page.svelte';

	export let url;
	export let openapi;

	export let actionsPerTag;
	export let activeTag = undefined;

    let page;

	function handleClick(tag) {
		activeTag = tag;
	}
</script>

<ul>
	{#each Object.entries(actionsPerTag) as [tag, actions]}
		<li class={activeTag === tag ? 'active' : ''}>
			<span on:click={() => handleClick(tag)}>{capitalizeFirstLetter(tag)} ({actions.length})</span>
		</li>
	{/each}
</ul>

{#if activeTag}
{#key activeTag}
    <ActionPage {url} {openapi} actions={actionsPerTag[activeTag]}/>
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