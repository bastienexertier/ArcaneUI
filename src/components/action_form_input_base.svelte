<script>
	export let inputId;
	export let name;
	export let title;
	export let required;
	export let inputType;
	export let description = null;
</script>

<div class="form-group">
	<label for={inputId}>{title}</label>
	<input id={inputId} class="form-control" type={inputType} name={name} required={required}>
	{#if description}
		<small>{description}</small>
	{/if}
</div>