<script>
	import XLg from "svelte-bootstrap-icons/lib/XLg.svelte";
	import Check2 from "svelte-bootstrap-icons/lib/Check2.svelte";
	import DashLg from "svelte-bootstrap-icons/lib/DashLg.svelte";
	import ThreeDots from "svelte-bootstrap-icons/lib/ThreeDots.svelte";

	export let property;
	export let value;
</script>

{#if property.type == "boolean"}
	{#if value}<Check2/>{:else}<XLg/>{/if}
{:else if value === null}
	<DashLg/>
{:else if typeof value === "object"}
	<ThreeDots/>
{:else}
	{value}
{/if}

