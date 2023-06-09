<script>
	export let inputId;
	export let name;
	export let title;
	export let required;
	export let description = null;
</script>

<div class="form-check">
	<label for={inputId}>{title}</label>
	<input id={inputId} class="form-check-input" type="checkbox" name={name} required={required}>
	{#if description}
		<small>{description}</small>
	{/if}
</div>