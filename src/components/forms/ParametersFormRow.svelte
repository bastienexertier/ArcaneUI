<script>
	import InputSelector from './inputs/InputSelector.svelte';
	
	export let id;
	export let parameter;
</script>

<tr>
	<td><label for={id}>{parameter.schema.title}</label></td>
	<td><InputSelector inputId={id} schema={parameter.schema} name={parameter.name} required={parameter.required} /></td>
</tr>

<style>
	td:nth-child(1) {
		font-weight: 100;
		font-style: italic;
		text-align: right;
		vertical-align: middle;
		white-space: nowrap;
	}
	td:nth-child(2) {
		width: 100%;
		font-weight: bold;
	}
</style>