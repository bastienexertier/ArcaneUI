<script>
	export let inputId;
	export let name;
	export let title;
	export let required;
	export let enumValues;
	export let description = null;
</script>

<div class="form-group">
	<label for={inputId}>{title}</label>
	<select id={inputId} class="form-control" name={name} required={required}>
		{#each enumValues as enumValue}
			<option>{enumValue}</option>
		{/each}
    </select>
	{#if description}
		<small>{description}</small>
	{/if}
</div>