<script>
	export let inputId;
	export let id;
	export let name;
	export let required;
	export let enumValues;
	export let description = null;
</script>

<div class="form-group">
	<label for={inputId}>{name}</label>
	<select id={inputId} class="form-control" name={id} required={required}>
		{#each enumValues as enumValue}
			<option>{enumValue}</option>
		{/each}
    </select>
	{#if description}
		<small>{description}</small>
	{/if}
</div>