<script>
	import ParametersFormRow from './ParametersFormRow.svelte';

	export let parameters;
	export let parameterValues;
</script>

<div class="row">
	<div class="col-9 offset-1">
		<table class="table table-borderless">
			<tbody>
				{#each parameters as parameter, index}
					{#if parameterValues && parameter.name in parameterValues}
						<ParametersFormRow id={index} {parameter} defaultValue={parameterValues[parameter.name]}/>
					{:else}
						<ParametersFormRow id={index} {parameter} />
					{/if}
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
</style>