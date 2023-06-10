<script>
	export let inputId;
	export let name;
	export let required;
	export let enumValues;
</script>

<select id={inputId} class="form-control" name={name} required={required}>
	{#each enumValues as enumValue}
		<option>{enumValue}</option>
	{/each}
</select>
