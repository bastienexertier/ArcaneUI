<script>
	export let actionId;
	export let propertyId;
	export let property;

	let inputTypes = {
		"string": "text",
		"integer": "number"
	};

	let inputId = `${actionId}_${propertyId}`;
	let parameterLabel = property.title || propertyId;
</script>

<div class="form-group">
	<label for={inputId}>{parameterLabel}</label>
	<input id={inputId} class="form-control" type={inputTypes[property.type]} name={propertyId} required>
</div>