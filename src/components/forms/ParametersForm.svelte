<script>
	import InputSelector from './inputs/InputSelector.svelte';

	export let parameters;
</script>

<div class="row">
	<div class="col-9 offset-1">
		<table class="table table-borderless">
			<tbody>
				{#each parameters as parameter, index}
					<tr>
						<td><label for={index}>{parameter.schema.title}</label></td>
						<td><InputSelector inputId={index} schema={parameter.schema} name={parameter.name} required={parameter.required} /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	table {
		color: white;
		border-color: dimgrey;
		margin-bottom: 0px;
	}
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