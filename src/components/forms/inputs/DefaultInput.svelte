<script>
	export let inputId;
	export let name;
	export let required;
	export let inputType;
	export let defaultValue = null;
	export let placeholder = null;
</script>

<input id={inputId} class="form-control" type={inputType} {name} {required} {placeholder} value={defaultValue} />
