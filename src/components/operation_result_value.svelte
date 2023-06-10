<script>
	import XLg from "svelte-bootstrap-icons/lib/XLg.svelte";
	import Check2 from "svelte-bootstrap-icons/lib/Check2.svelte";

	export let property;
	export let value;
</script>

{#if property.type == "boolean"}
	{#if value}<Check2/>{:else}<XLg/>{/if}
{:else}
	{value}
{/if}

