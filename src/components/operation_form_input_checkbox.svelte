<script>
	export let inputId;
	export let name;
	export let title;
	export let description = null;
	export let defaultValue = null;
</script>

<div class="form-check">
	<label for={inputId}>{title}</label>
	<input id={inputId} class="form-check-input" type="checkbox" name={name} checked={defaultValue}>
	{#if description}
		<small>{description}</small>
	{/if}
</div>