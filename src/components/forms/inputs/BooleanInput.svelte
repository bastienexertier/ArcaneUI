<script>
	export let inputId;
	export let name;
	export let defaultValue = null;
</script>

<input id={inputId} class="form-check-input" type="checkbox" name={name} checked={defaultValue} height="40" />

<style>
	input {
		height: 30px;
		width: 30px;
	}
</style>
