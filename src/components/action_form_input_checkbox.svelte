<script>
	export let inputId;
	export let id;
	export let name;
	export let required;
	export let description = null;
</script>

<div class="form-check">
	<label for={inputId}>{name}</label>
	<input id={inputId} class="form-check-input" type="checkbox" name={id} required={required}>
	{#if description}
		<small>{description}</small>
	{/if}
</div>