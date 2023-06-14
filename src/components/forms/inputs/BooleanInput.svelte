<script>
	export let inputId;
	export let name;
	export let defaultValue = null;
</script>

<input id={inputId} class="form-check-input" type="checkbox" name={name} checked={defaultValue}>
