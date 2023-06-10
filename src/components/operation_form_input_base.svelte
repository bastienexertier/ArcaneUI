<script>
	export let inputId;
	export let name;
	export let required;
	export let inputType;
	export let defaultValue = null;
</script>


<input id={inputId} class="form-control" type={inputType} name={name} required={required} placeholder={defaultValue} disabled={inputType == 'object' || inputType == 'array'}>
