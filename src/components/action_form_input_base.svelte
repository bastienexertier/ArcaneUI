<script>
	export let inputId;
	export let id;
	export let name;
	export let required;
	export let inputType;
	export let description = null;
</script>

<div class="form-group">
	<label for={inputId}>{name}</label>
	<input id={inputId} class="form-control" type={inputType} name={id} required={required}>
	{#if description}
		<small>{description}</small>
	{/if}
</div>