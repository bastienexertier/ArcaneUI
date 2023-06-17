<script>
	import ParametersFormRow from './ParametersFormRow.svelte';

	export let parameters;
</script>

<div class="row">
	<div class="col-9 offset-1">
		<table class="table table-borderless">
			<tbody>
				{#each parameters as parameter, index}
					<ParametersFormRow id={index} {parameter} />
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